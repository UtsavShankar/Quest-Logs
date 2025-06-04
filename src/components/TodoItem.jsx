import React, { useState } from "react";

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(todo.title);

  const save = () => {
    onUpdate(todo.id, editVal);
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input value={editVal} onChange={(e) => setEditVal(e.target.value)} />
          <button onClick={save}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span>{todo.title}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </div>
      )}
    </li>
  );
}
