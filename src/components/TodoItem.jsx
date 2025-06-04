import React, { useState } from "react";

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(todo.title);
  const [editDeadline, setEditDeadline] = useState(todo.deadline ?? "");

  const save = () => {
    onUpdate(todo.id, editVal, editDeadline);
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input value={editVal} onChange={(e) => setEditVal(e.target.value)} />
          {
            todo.deadline
            ? <input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)}/>
            : null
          }
          <button onClick={save}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span>{todo.title}</span>
          <span>{todo.deadline
            ? new Date(todo.deadline).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
          })
            : ""
          }</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </div>
      )}
    </li>
  );
}
