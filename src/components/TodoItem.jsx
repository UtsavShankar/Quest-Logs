import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TodoItem({ todo, tagProps, setIsCompleted, onClick, isOpen }) {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
    id: todo.id,
  });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  };

  const { userTags } = tagProps;

  const getTag = () => {
    const tagId = todo.tags?.[0];
    const tagData = userTags.find(tag => tag.id === tagId);
    return tagId && tagData ? tagData.name : null;
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
      <input type="checkbox" checked={todo.completed} onChange={e => setIsCompleted(e.target.checked)}/>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3rem auto', gap: '8px', alignItems: 'left'}}>
            <div style={{ display: 'contents', cursor: 'pointer' }} {...listeners}>
            <span>{todo.title}</span>
            <span>{getTag()}</span>
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