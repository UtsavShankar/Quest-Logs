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

export default function TodoList({ user }) {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor)
  );
  const [deadline, setDeadline] = useState(null);
  const [isAddingDate, setIsAddingDate] = useState(false);

  const loadTodos = useCallback(async () => {
    if (!user) return;
    const q = query(
      collection(db, "todos"), 
      where("userId", "==", user.uid),
      orderBy("sortOrder", "asc")
    );
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
    console.log("Loaded todos:", items);
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
      <h2>Quest Log</h2>
      <button onClick={handleLogout} style={{marginBottom: '10px'}}>Logout</button>
      <br />
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext items={todos}>
          <ul>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
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