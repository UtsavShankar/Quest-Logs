import { useEffect, useRef } from "react";

export default function NewTabButton({ addTab, isAddingTab, setIsAddingTab }) {
    const addTabRef = useRef();

    useEffect(() => {
        if (!isAddingTab) return;

        const handler = (event) => {
            if (addTabRef.current && !addTabRef.current.contains(event.target)) {
                setIsAddingTab(false);
            }
        }
        
        const timeout = setTimeout(() => {
            document.addEventListener("click", handler);
        }, 500);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener("click", handler);
        }
    }, [isAddingTab, setIsAddingTab]);

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