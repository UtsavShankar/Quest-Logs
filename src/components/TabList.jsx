import { useState, useRef, useEffect } from "react";

export default function TabList() {
    const defaultTabs = [
        {
            id: "all",
            name: "All",
            canEdit: false
        },
        {
            id: "completed",
            name: "Completed",
            canEdit: false
        }
    ]

    const [currentTab, setCurrentTab] = useState("all");
    const [isAddingTab, setIsAddingTab] = useState(false);
    const [tabs, setTabs] = useState(defaultTabs);

    const addTab = (name) => {
        setTabs([
            ...tabs,
            {
                id: tabs.length, // TODO: change this
                name: name,
                canEdit: true
            }
        ]);
        setIsAddingTab(false);
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
            <div className="side-bar">
                {tabs.map((tab) => 
                    <button 
                        className={`side-button ${currentTab === tab.id && "selected"}`}
                        style={{ textAlign: "left" }}
                        onClick={() => setCurrentTab(tab.id)}>
                            {tab.name}
                    </button>)}
                <AddTabButton />
            </div>
        </div>
    )
}