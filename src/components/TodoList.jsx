import React, { useEffect, useState, useCallback } from "react";
import { db, auth } from "../firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.8.0/firebase-firestore.js";
import TodoItem from "./TodoItem";
import { signOut } from "firebase/auth";

export default function TodoList({ user }) {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [isAddingDate, setIsAddingDate] = useState(false);

  const loadTodos = useCallback(async () => {
    if (!user) return;
    const q = query(collection(db, "todos"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();

      if (typeof data.title === "object" && data.title !== null && "title" in data.title) {
        const newTitle = data.title.title;
        await updateDoc(doc(db, "todos", docSnap.id), { title: newTitle });
      }
    }
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Title:", data.title);
      console.log("Deadline:", data.deadline);
    });
    const items = snapshot.docs.map((docSnap) => ({
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
      deadline: deadline
    });
    setNewTask("");
    setDeadline(null);
    setIsAddingDate(false);
    loadTodos();
  };

  const updateTodo = async (id, newTitle, newDeadline) => {
    await updateDoc(doc(db, "todos", id), { 
      title: newTitle,
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

  return (
    <div>
      <h2>Quest Log</h2>
      <button onClick={handleLogout} style={{marginBottom: '10px'}}>Logout</button>
      <br />
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
        ))}
      </ul>
      <input value={newTask} placeholder="Enter new quest" onChange={(e) => setNewTask(e.target.value)} />
      {
        !isAddingDate
        ? <button onClick={() => setIsAddingDate(true)}>Add Date</button>
        : <input type="date" value={deadline || ""} onChange={(e) => setDeadline(e.target.value)}/>
      }
      <button onClick={addTodo}>Add Quest</button>
    </div>
  );
}