import React, { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TagPicker from "./Tags";
import { SimpleButton } from "./Buttons";

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(todo.title);
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
    id: todo.id,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '3px'
  };
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [editTag, setEditTag] = useState(todo.tags ? todo.tags[0] : null);
  const [editDeadline, setEditDeadline] = useState(todo.deadline ?? "");
  const [isAddingDate, setIsAddingDate] = useState(false);

  // setting timeout for when the deadline expires, reloads every time deadline value is updated, pretty efficient
  useEffect(() => {
    if (todo.deadline) {
      const deadlineDate = new Date(todo.deadline);
      const now = new Date();
      const timeout = deadlineDate.getTime() - now.getTime();
      console.log("Timeout for deadline:", timeout,now, deadlineDate);
      if (timeout > 0) {
        const timer = setTimeout(() => {
          new window.Notification(todo.title, { body: "Your quest has expired! You made a valiant effort!" });         
        }, timeout);// 5 second for testing, change to timeout for deadline
        return () => clearTimeout(timer);
      }
    }
  }, [editDeadline]);


  const daysRemaining = (() => {
    if (!todo.deadline) return "";

    const milisBetween = new Date(todo.deadline) - new Date();
    const daysBetween = Math.ceil(milisBetween / (1000 * 60 * 60 * 24));

    return `${daysBetween} day${daysBetween === 1 ? "" : "s"} remaining`;
  })();

  const save = () => {
    onUpdate(todo.id, editVal, editTag, editDeadline);
    setIsEditing(false);
    setIsEditingTag(false);
  };

  const cancel = () => {
    setIsEditing(false);
    setIsEditingTag(false);
    setEditTag(todo.tags && todo.tags[0] ? todo.tags[0] : null);
  }

  function DragHandle({ listeners }) {
    return (
      <div style={{display: "flex", justifyContent: "center"}}>
        <div style={{display:"grid", gridTemplateColumns: "3px 3px", gridGap: "3px", cursor: "grab"}} {...listeners}>
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>
      </div>
    )
  }

  return (
    <li ref={setNodeRef} style={{display: "grid", gridTemplateColumns: "25px auto 25px", alignItems: "center", ...style}} {...attributes}>
      <input type="checkbox"/>
      {isEditing ? (
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: "1fr 100px 110px 150px auto", gap: '8px', alignItems: 'center'}}>
          <input value={editVal} onChange={(e) => setEditVal(e.target.value)}/>
          {
            isEditingTag
            ? <TagPicker 
                userId={todo.userId} 
                editTag={editTag}
                onUpdate={newTag => setEditTag(newTag)} 
                endEdit={() => setIsEditingTag(false)}
              />
            : editTag
              ? <span onClick={() => setIsEditingTag(true)}>{editTag.name}</span>
              : <SimpleButton onClick={() => setIsEditingTag(true)}>Add Tag</SimpleButton>
          }
          {
            todo.deadline
            ? <input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)}/>
            : !isAddingDate
              ? <SimpleButton onClick={() => setIsAddingDate(true)}>Add Date</SimpleButton>
              : <input type="date" value={editDeadline || ""} onChange={(e) => setEditDeadline(e.target.value)}/>
          }
          <div/>
          <div>
            <SimpleButton onClick={save}>Save</SimpleButton>
            <SimpleButton onClick={cancel}>Cancel</SimpleButton>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: "1fr 100px 110px 150px auto", gap: '8px', alignItems: 'left'}}>
          <div style={{ display: 'contents', cursor: 'default' }} {...listeners}>
          <span>{todo.title}</span>
          <span>{(todo.tags && todo.tags[0]) ? todo.tags[0].name : ""}</span>
          <span>{todo.deadline
            ? new Date(todo.deadline).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
          })
            : ""
          }</span>
          <span>{daysRemaining}</span>
          </div>
          <div>
            <SimpleButton onClick={() => {setIsEditing(true); console.log("editing")}}>Edit</SimpleButton>
            <SimpleButton onClick={() => onDelete(todo.id)}>Delete</SimpleButton>
          </div>
        </div>
      )}
      <DragHandle listeners={listeners}/>
    </li>
  );
}
