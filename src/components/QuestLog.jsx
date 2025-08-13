import { useEffect, useState, useCallback } from "react";
import { db, auth } from "../firebase.js";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  writeBatch
} from "firebase/firestore";
import { DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import QuestList from "./QuestList/QuestList.jsx";
import SettingsMenu from "./Settings.jsx";
import { SettingsButton } from "./Buttons.jsx";
import TabList from "./SideMenu/TabList.jsx"
import QuestDetailsPanel from "./QuestDetailsPanel/QuestDetailsPanel.jsx";
import { useTheme } from "../hooks/ThemeContext.js";
import ThemeSync from "./ThemeSync.jsx";

export default function TodoList({ user, settings, setSettings }) {
  const [todos, setTodos] = useState([]);
  const [shownTodos, setShownTodos] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }
  ));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [activeList, setActiveList] = useState("all");
  const [openQuest, setOpenQuest] = useState(null);
  const { theme } = useTheme();

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

  //if todos is changed, send the todos to ipc renderer
  useEffect(() => {
    if (todos.length > 0 && window?.electronAPI.sendTodosToMain) {
      window.electronAPI.sendTodosToMain(todos);
    }
  },[todos])

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
      name: doc.name,
      colour: doc.colour
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

  const updateTodo = async (id, newTitle, newTagId, newDeadline, newScheduledDate, newDescription, isNotifying) => {
     await updateDoc(doc(db, "users", user.uid, "todos", id), { 
      title: newTitle,
      tags: newTagId ? [newTagId] : [],
      deadline: newDeadline,
      scheduledDate: newScheduledDate ?? null,
      description: newDescription,
      isNotifying: isNotifying ?? false
    });
    loadTodos();
  };

  const addTodo = async (todo) => {
    await addDoc(collection(db, "users", user.uid, "todos"), todo);
    loadTodos();
  }

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
    await addDoc(collection(db, "users", user.uid, "tags"), { 
      name: tagName,
      colour: "grey"
    });
    loadUserTags();
  }

  const deleteTag = async (tagId) => {
    const docRef = doc(db, "users", user.uid, "tags", tagId);
    await deleteDoc(docRef);
    loadUserTags();

    const q = query(
      collection(db, "users", user.uid, "todos"),
      where("tags", "array-contains", tagId)
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.forEach(doc => {
      const data = doc.data();
      const newTags = data.tags.filter(t => t !== tagId);
      batch.update(doc.ref, { tags: newTags });
    });

    await batch.commit();
    loadTodos();
  }

  const updateTag = async (tagId, newName, newColour) => {
    await updateDoc(doc(db, "users", user.uid, "tags", tagId), { 
      name: newName,
      colour: newColour
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

  const updateList = async (listId, newName) => {
    const docRef = doc(db, "users", user.uid, "lists", listId);
    await updateDoc(docRef, {
      name: newName
    });
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
        <button className="simple-button" 
          style={{ fontFamily: "var(--subheading-font)", fontSize: "15px" }}
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    )
  }

  return (
    <div>
      <ThemeSync settings={settings}/>
      <div style={{ padding: '1rem', minHeight: '45rem', boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100vh"  }}>
        <TopBar />
        <h1 style={{textAlign: 'center'}}>{theme.logTitle}</h1>
        <br />
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flex: 1, margin: '2rem 2rem 2rem', minHeight: 0 }}>
            <TabList userTabs={userLists} currentTab={activeList} setCurrentTab={activateList} addUserTab={addList} deleteUserTab={deleteList} updateTab={updateList}/>
            <QuestList 
              todos={todos}
              activeList={activeList}
              shownTodos={shownTodos}
              tagProps={{ userTags, addTag, deleteTag, updateTag }}
              toggleCompleted={toggleCompleted}
              openQuest={openQuest}
              setOpenQuest={setOpenQuest}
              addTodoToDatabase={addTodo}
            />
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