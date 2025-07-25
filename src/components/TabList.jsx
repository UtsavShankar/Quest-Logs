import { useState, useRef, useEffect, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {ReactComponent as DeleteIcon} from '../assets/icon-delete.svg';

export default function TabList({ userTabs, currentTab, setCurrentTab, addUserTab, deleteUserTab }) {

    const defaultTabs = useMemo(() => [
        {
            id: "all",
            name: "All",
            canEdit: false
        },
        {
            id: "timeline",
            name: "Timeline",
            canEdit: false
        },
        {
            id: "completed",
            name: "Completed",
            canEdit: false
        }
    ], []);

    const [isAddingTab, setIsAddingTab] = useState(false);
    const [tabs, setTabs] = useState([]);

    useEffect(() => {
        setTabs([...defaultTabs, ...userTabs.map(tab => ({ ...tab, canEdit: true }))]);
    }, [defaultTabs, userTabs])

    const addTab = (name) => {
        addUserTab(name);
        setIsAddingTab(false);
    }

    const deleteTab = (tabId) => {
        if (currentTab === tabId) {
            setCurrentTab("all");
        }
        deleteUserTab(tabId);
    }

    const handleTabClick = (tabId) => {
        setCurrentTab(tabId);
    }

    function Tab({ tab }) {
        const {isOver, setNodeRef} = useDroppable({
            id: tab.id
        })
        
        const style = {
            textAlign: "left",
            display: "flex",
            justifyContent: "space-between",
            padding: "0.25em 0.5em 0.25em",
            borderRadius: "0.3em",
            backgroundColor: isOver ? 'var(--dark-highlight-color)' : undefined,
        };

        return (
            <div ref={tab.canEdit ? setNodeRef : null} style={style}>
                <button 
                    key={tab.id}
                    className={`side-button ${currentTab === tab.id && "selected"}`}
                    style={{ textAlign: "left"}}
                    onClick={() => handleTabClick(tab.id)}>
                        {tab.name}
                </button>
                {tab.canEdit && 
                <button
                    style={{ all: "unset", display: "inline-flex", height: "auto", width: "auto", cursor: "pointer", alignSelf: "center" }}
                    onClick={() => deleteTab(tab.id)}
                >
                    <DeleteIcon className="icon-button" />
                </button>}
            </div>
        )
    }

    function AddTabButton() {
        const addTabRef = useRef();

        useEffect(() => {
            const handler = (event) => {
                if (addTabRef.current && !addTabRef.current.contains(event.target)) {
                    setIsAddingTab(false);
                }
            }
            
            const timeout = setTimeout(() => {
                document.addEventListener("click", handler);
            }, 0);

            return () => {
                clearTimeout(timeout);
                document.removeEventListener("click", handler);
            }
        }, []);

        const handleKeyDown = (event) => {
            if (event.key === 'Enter' && event.target.value) {
                addTab(event.target.value);
            }
        }

        return (
            isAddingTab
            ? <input ref={addTabRef} autoFocus="autofocus" onKeyDown={handleKeyDown} placeholder="New List"/>
            : <button onClick={() => setIsAddingTab(true)} className="add-button">+</button>
        )
    }

    return (
        <div className="tab-list">
            {tabs.map((tab) => <Tab key={tab.id} tab={tab}/>)}
            <AddTabButton />
        </div>
    )
}