import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const [editTag, setEditTag] = useState(todo.tags ? todo.tags[0] : "");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [editDeadline, setEditDeadline] = useState(todo.deadline ?? "");
  const [isAddingDate, setIsAddingDate] = useState(false);

  const daysRemaining = (() => {
    if (!todo.deadline) return "";

    const milisBetween = new Date(todo.deadline) - new Date();
    const daysBetween = Math.ceil(milisBetween / (1000 * 60 * 60 * 24));

    return `${daysBetween} day${daysBetween === 1 ? "" : "s"} remaining`;
  })();

  const save = () => {
    onUpdate(todo.id, editVal, editDeadline);
    setIsEditing(false);
    setIsAddingTag(false);
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes}>
      {isEditing ? (
        <div style={{ display: 'grid', gridTemplateColumns: "1fr 100px 110px 150px auto", gap: '8px', alignItems: 'center'}}>
          <input value={editVal} onChange={(e) => setEditVal(e.target.value)}/>
          {
            (todo.tags && todo.tags[0] !== "") || isAddingTag
            ? <input value={editTag} onChange={(e) => setEditTag(e.target.value)}/>
            : <button onClick={() => setIsAddingTag(true)}>Add Tag</button>
          }
          {
            todo.deadline
            ? <input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)}/>
            : !isAddingDate
              ? <button onClick={() => setIsAddingDate(true)}>Add Date</button>
              : <input type="date" value={editDeadline || ""} onChange={(e) => setEditDeadline(e.target.value)}/>
          }
          <div/>
          <div>
            <button onClick={save}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: "1fr 100px 110px 150px auto", gap: '8px', alignItems: 'left'}}>
          <div style={{ display: 'contents', cursor: 'default' }} {...listeners}>
          <span>{todo.title}</span>
          <span>{todo.tags ? todo.tags[0] : ""}</span>
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
            <button onClick={() => {setIsEditing(true); console.log("editing")}}>Edit</button>
            <button onClick={() => onDelete(todo.id)}>Delete</button>
          </div>
        </div>
      )}
    </li>
  );
}
