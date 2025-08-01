import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import tagColours from "../../data/tagData.js";
import { useAudioContext } from "../../AudioContext.js";

export default function TodoItem({ todo, tagProps, onCompletedChange, onClick, isOpen }) {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
    id: todo.id,
  });
  const [completed, setCompleted] = useState(todo.completed);
  const { playSfx } = useAudioContext();

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

  const handleCheckboxChange = (e) => {
    const newVal = e.target.checked;
    newVal ? playSfx("ding swipe 2") : playSfx("swipe");
    setCompleted(newVal);
    onCompletedChange(newVal);
  }

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
      <input type="checkbox" checked={completed} onClick={e => e.stopPropagation()} onChange={handleCheckboxChange}/>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr fit-content(5rem) auto', gap: '8px', alignItems: 'left'}}>
            <div style={{ display: 'contents', cursor: 'pointer' }} {...listeners}>
            <span className={`todo-item-title ${completed && "completed"}`}>{todo.title}</span>
            {
              getTag() &&
              <span 
                className="tag"
                style={{ background: `${completed ? "#3c3c3cff" : tagColours.find(c => c.id === getTag()?.colour)?.background}`,
                color:`${completed ? "gray" : ""}`,
                justifySelf: "start", alignSelf: "center" }}>
                  {getTag()?.name}
              </span>
            }
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