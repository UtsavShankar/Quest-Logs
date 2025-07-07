import { useEffect, useState, useCallback } from "react";
import { db, auth } from "../firebase.js";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy
} from "firebase/firestore";
import { DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import TodoItem from "./TodoItem";
import TagPicker from "./Tags";
import SettingsMenu from "./Settings";
import { SettingsButton, SimpleButton } from "./Buttons";
import TabList from "./TabList"
import QuestDetailsPanel from "./QuestDetailsPanel.jsx";

export default function TodoList({ user, settings, setSettings }) {
  const [todos, setTodos] = useState([]);
  const [shownTodos, setShownTodos] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [newTask, setNewTask] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }
  ));
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tag, setTag] = useState(null);
  const [isAddingDate, setIsAddingDate] = useState(false);
  const [deadline, setDeadline] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [activeList, setActiveList] = useState("all");
  const [openQuest, setOpenQuest] = useState(null);

  const activateList = useCallback((listId) => {
    if (listId === "all") {
      setShownTodos(todos);
    } else if (listId === "completed") {
      setShownTodos(todos.filter(t => t.completed === true));
    } else {
      setShownTodos(todos.filter(t => t.list === listId))
    }
    setActiveList(listId);
  }, [todos]);

  useEffect(() => {
    activateList(activeList);
  }, [activateList, activeList, todos]);

  const loadTodos = useCallback(async () => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "todos"),
      orderBy("sortOrder", "asc")
    );
    
    const unsubscribe = onSnapshot(q, snapshot => {
      const items = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setTodos(items);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const loadSubCollection = useCallback(async (subcollection) => {
    const q = query(
        collection(db, "users", user.uid, subcollection)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
        docId: doc.id,
        ...doc.data()
    }));
  }, [user.uid]);

  const loadUserTags = useCallback(async () => {
    const items = (await loadSubCollection("tags")).map(doc => ({
      id: doc.docId,
      name: doc.name
    }));
    setUserTags(items);
  }, [loadSubCollection]);

  useEffect(() => {
      loadUserTags();
  }, [loadUserTags]);

  const loadQuestLists = useCallback(async () => {
    const items = (await loadSubCollection("lists")).map(doc => ({ 
        id: doc.docId,
        name: doc.name
    }));
    setUserLists(items);
  }, [loadSubCollection]);

  useEffect(() => {
      loadQuestLists();
  }, [loadQuestLists]);

  const addTodo = async () => {
    if (!newTask.trim()) return;
    const item = {
      title: newTask,
      completed: false,
      createdAt: Date.now(),
      sortOrder: todos.length,
      deadline: deadline,
      tags: [tag],
      description: "",
    };
    if (activeList !== "all" && activeList !== "completed") {
      item.list = activeList;
    }
    await addDoc(collection(db, "users", user.uid, "todos"), item);
    setNewTask("");
    setTag("");
    setDeadline(null);
    setIsAddingTag(false);
    setIsAddingDate(false);
    loadTodos();
  };

  const updateTodo = async (id, newTitle, newTagId, newDeadline, newDescription) => {
     await updateDoc(doc(db, "users", user.uid, "todos", id), { 
      title: newTitle,
      tags: newTagId ? [newTagId] : [],
      deadline: newDeadline,
      description: newDescription
    });
    loadTodos();
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "todos", id));
    loadTodos();
    setOpenQuest(null);
  };

  const toggleCompleted = async (id, completed) => {
    await updateDoc(doc(db, "users", user.uid, "todos", id), {
      completed: completed
    });
    loadTodos();
  }

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const newList = userLists.find(t => t.id === over.id);

    if (newList) {
      // Move todo to list
      moveTodoToList(active.id, over.id);
    } else {
      // Reorder todos
      const oldIndex = todos.findIndex(t => t.id === active.id);
      const newIndex = todos.findIndex(t => t.id === over.id);
      const newTodos = arrayMove(todos, oldIndex, newIndex);

      setTodos(newTodos);

      await Promise.all(
        newTodos.map((todo, index) =>
          updateDoc(doc(db, "users", user.uid, "todos", todo.id), { sortOrder: index })
        )
      );
    }
  };

  const addTag = async (tagName) => {
    await addDoc(collection(db, "users", user.uid, "tags"), { name: tagName });
    loadUserTags();
  }

  const deleteTag = async (tagId) => {
    const docRef = doc(db, "users", user.uid, "tags", tagId);
    await deleteDoc(docRef);
    loadUserTags();
  }

  const updateTag = async (tagId, newName) => {
    await updateDoc(doc(db, "users", user.uid, "tags", tagId), { 
      name: newName
    });
    loadUserTags();
  }

  const addList = async (listName) => {
    const docRef = await addDoc(collection(db, "users", user.uid, "lists"), { name: listName });
    loadQuestLists();
    activateList(docRef.id);
  }

  const deleteList = async (listId) => {
    const docRef = doc(db, "users", user.uid, "lists", listId);
    await deleteDoc(docRef);
    loadQuestLists();
  }

  const moveTodoToList = async (todoId, listId) => {
    await updateDoc(doc(db, "users", user.uid, "todos", todoId), {
      list: listId
    });
    loadTodos();
  }

  function TopBar() {
    return (
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <SettingsButton onClick={() => setSettingsOpen(true)} />
        <SimpleButton onClick={handleLogout}>Log out</SimpleButton>
      </div>
    )
  }

  function QuestList() {
    return (
      <div className="quest-list">
          <SortableContext items={todos}>
            <ul style={{listStyleType: "none", margin: 0, padding: 0}}>
              {shownTodos.map((todo) => (
                <TodoItem
                  key={todo.id} 
                  todo={todo}
                  tagProps={{ userTags, addTag, deleteTag, updateTag }}
                  onUpdate={updateTodo} 
                  onDelete={deleteTodo} 
                  onCompletedChange={completed => toggleCompleted(todo.id, completed)} 
                  onClick={() => setOpenQuest(todo)}
                  isOpen={openQuest && openQuest.id === todo.id}
                />
              ))}
            </ul>
          </SortableContext>
        <br />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: "1fr auto", gap: '8px', alignItems: 'center', margin: "0 1em 0"}}>
          <input className="text-input" value={newTask} placeholder="Enter new quest" onChange={(e) => setNewTask(e.target.value)} />
          <button onClick={addTodo}>Add Quest</button>
        </div>
        <div style={{ display: "flex", gap: "1em", margin: "0.5em 1em 0.5em", position: "relative"}}>
          <span>
            {
              !isAddingTag
              ? tag
                ? <span className="tag" onClick={() => setIsAddingTag(true)}>{tag.name}</span>
                : <SimpleButton onClick={() => setIsAddingTag(true)}>Add Tag</SimpleButton>
              : <TagPicker userId={user.uid} editTag={tag} tagProps={{ userTags, addTag, deleteTag, updateTag }} onUpdate={newTag => setTag(newTag)} endEdit={() => setIsAddingTag(false)}/>
            }
          </span>
          <span>
            {
              !isAddingDate
              ? <SimpleButton value={tag || ""} onClick={() => setIsAddingDate(true)}>Add Date</SimpleButton>
              : <input type="date" value={deadline || ""} onChange={(e) => setDeadline(e.target.value)}/>
            }
          </span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ padding: '1rem', minHeight: '45rem', boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
        <TopBar />
        <h1 style={{textAlign: 'center'}}>Quest Log</h1>
        <br />
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flex: 1, margin: '2rem 2rem 2rem' }}>
            <TabList userTabs={userLists} currentTab={activeList} setCurrentTab={activateList} addUserTab={addList} deleteUserTab={deleteList}/>
            <QuestList />
            {
              openQuest && <QuestDetailsPanel 
                quest={openQuest} 
                tagProps={{ userTags, addTag, deleteTag, updateTag }}
                onUpdate={updateTodo} 
                onDelete={deleteTodo}
              />
            }
          </div>
        </DndContext>
      </div>
      {
        settingsOpen && <SettingsMenu settings={settings} setSettings={setSettings} closeMenu={() => setSettingsOpen(false)}/>
      }
    </div>
  );
}