import React, { useEffect, useState, useCallback } from "react";
import { db, auth } from "../firebase.js";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.8.0/firebase-firestore.js";
import { DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import TodoItem from "./TodoItem";
import TagPicker from "./Tags";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

export default function TodoList({ user }) {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor)
  );
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tag, setTag] = useState(null);
  const [isAddingDate, setIsAddingDate] = useState(false);
  const [deadline, setDeadline] = useState(null);

  const loadTodos = useCallback(async () => {
    if (!user) return;
    const q = query(
      collection(db, "todos"), 
      where("userId", "==", user.uid),
      orderBy("sortOrder", "asc")
    );
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    setTodos(items);
  }, [user]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const addTodo = async () => {
    if (!newTask.trim()) return;
    await addDoc(collection(db, "todos"), {
      title: newTask,
      completed: false,
      userId: user.uid,
      createdAt: Date.now(),
      sortOrder: todos.length,
      deadline: deadline,
      tags: [tag]
    });
    setNewTask("");
    setTag("");
    setDeadline(null);
    setIsAddingTag(false);
    setIsAddingDate(false);
    loadTodos();
  };

  const updateTodo = async (id, newTitle, newTag, newDeadline) => {
    await updateDoc(doc(db, "todos", id), { 
      title: newTitle,
      tags: newTag ? [newTag] : [],
      deadline: newDeadline,
    });
    loadTodos();
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    loadTodos();
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex(t => t.id === active.id);
    const newIndex = todos.findIndex(t => t.id === over.id);
    const newTodos = arrayMove(todos, oldIndex, newIndex);

    setTodos(newTodos);

    await Promise.all(
      newTodos.map((todo, index) =>
        updateDoc(doc(db, "todos", todo.id), { sortOrder: index })
      )
    );
  };

  return (
    <div>
      <button onClick={handleLogout} style={{marginBottom: '10px'}}>Logout</button>
      <h1 style={{textAlign: 'center'}}>Quest Log</h1>
      <br />
      <DndContext onDragEnd={handleDragEnd} sensors={sensors} modifiers={[restrictToVerticalAxis]}>
        <SortableContext items={todos}>
          <ul>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <div style={{ width: '80%', left: '10%', position: 'relative', display: 'grid', gridTemplateColumns: "1fr 100px 110px 150px auto", gap: '8px', alignItems: 'center'}}>
        <input value={newTask} placeholder="Enter new quest" onChange={(e) => setNewTask(e.target.value)} />
        {
          !isAddingTag
          ? tag
            ? <span onClick={() => setIsAddingTag(true)}>{tag.name}</span>
            : <button onClick={() => setIsAddingTag(true)}>Add Tag</button>
          : <TagPicker userId={user.uid} editTag={tag} onUpdate={newTag => setTag(newTag)} endEdit={() => setIsAddingTag(false)}/>
        }
        {
          !isAddingDate
          ? <button value={tag || ""} onClick={() => setIsAddingDate(true)}>Add Date</button>
          : <input type="date" value={deadline || ""} onChange={(e) => setDeadline(e.target.value)}/>
        }
        <button onClick={addTodo}>Add Quest</button>
      </div>
    </div>
  );
}