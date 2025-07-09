import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import tagColours from "../data/tagData.js";

export default function TodoItem({ todo, tagProps, onCompletedChange, onClick, isOpen }) {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
    id: todo.id,
  });
  const [completed, setCompleted] = useState(todo.completed);

  useEffect(() => {
    setCompleted(todo.completed);
  }, [todo])
  
  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  };

  const { userTags } = tagProps;

  const getTag = () => {
    const tagId = todo.tags?.[0];
    const tagData = userTags.find(tag => tag.id === tagId);
    return tagId && tagData ? tagData : null;
  }

  const getDaysRemaining = (deadline) => {
    if (!deadline) return "";

    const milisBetween = new Date(deadline) - new Date();
    const daysBetween = Math.ceil(milisBetween / (1000 * 60 * 60 * 24));

    return `${daysBetween} day${daysBetween === 1 ? "" : "s"}`;
  };

  function DragHandle({ listeners }) {
    return (
      <div style={{display: "flex", justifyContent: "center"}}>
        <div style={{display: "grid", gridTemplateColumns: "3px 3px", gridGap: "3px", cursor: "grab"}}
          {...listeners}>
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
    <li ref={setNodeRef} className={`todo-item ${isOpen && "selected"}`} style={style} {...attributes} onClick={onClick}>
      <input type="checkbox" checked={completed} onClick={e => e.stopPropagation()} onChange={e => {
        const newVal = e.target.checked;
        setCompleted(newVal);
        onCompletedChange(newVal);
      }}/>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr fit-content(5rem) auto', gap: '8px', alignItems: 'left'}}>
            <div style={{ display: 'contents', cursor: 'pointer' }} {...listeners}>
            <span>{todo.title}</span>
            <span style={{ background: `${tagColours.find(c => c.id === getTag()?.colour)?.background}`,
              justifySelf: "start", alignSelf: "center" }} className="tag">{getTag()?.name}</span>
            </div>
          </div>
        </div>
      <DragHandle listeners={listeners}/>
      <span style={{ color: "gray", fontSize: "14px", gridColumn: "2 / -1", cursor: "pointer" }}>
        {getDaysRemaining(todo.deadline)}
      </span>
    </li>
  );
}