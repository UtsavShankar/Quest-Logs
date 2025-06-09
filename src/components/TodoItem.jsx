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

  const save = () => {
    onUpdate(todo.id, editVal);
    setIsEditing(false);
  };

  return (
    <li ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {isEditing ? (
        <>
          <input value={editVal} onChange={(e) => setEditVal(e.target.value)} />
          <button onClick={save}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <span>{todo.title}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </>
      )}
      </div>
    </li>
  );
}
