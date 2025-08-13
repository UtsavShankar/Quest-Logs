import { useState, useEffect, useRef } from "react";
import {ReactComponent as DeleteIcon} from '../../assets/icon-delete.svg';
import ListDeletePopup from "./ListDeletePopup";

export default function TabEditMenu({ deleteTab, updateName, setMenuIsOpen, tab, ref, style }) {
    const [editName, setEditName] = useState(tab.name);
    const menuRef = useRef();
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const handler = (event) => {
            if (isDeleting) return;
            const clickedInEditMenu = menuRef.current?.contains(event.target);

            if (!clickedInEditMenu) {
                setMenuIsOpen(false);
            }
        };

        const timeout = setTimeout(() => {
            document.addEventListener("click", handler);
        }, 100);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener("click", handler);
        }
    }, [setMenuIsOpen, isDeleting]);

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            updateName(tab.id, event.target.value);
        }
    }

    const onDelete = () => {
        deleteTab(tab.id);
        setIsDeleting(false);
    }

    return (
        <>
            <div ref={ref} style={style} className='tag-edit-menu'>
                <div ref={menuRef} className="tag-options">
                    <input type="text" className="tag-edit-input" value={editName}
                            onChange={e => setEditName(e.target.value)}
                            autoFocus="autofocus" onKeyDown={handleInputKeyDown}/>
                    <button style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.2rem 0.2rem" }} onClick={() => setIsDeleting(true)}>
                        <DeleteIcon className="icon" style={{ margin: "0 0.3rem 0" }}/>
                        Delete
                    </button>
                </div>
            </div>
            {isDeleting && <ListDeletePopup tabName={tab.name} onDelete={onDelete} onCancel={() => setIsDeleting(false)}/>}
        </>
    )
}