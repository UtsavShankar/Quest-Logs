import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "../Buttons.css";
import {ReactComponent as DeleteIcon} from '../../assets/icon-delete.svg';

export default function TagItem({ tag, colours, onClick, onUpdate, onDelete, menuRef }) {
    const [currentColour, setCurrentColour] = useState("grey");
    const [isEditing, setIsEditing] = useState(false);
    const menuButtonRef = useRef();
    const [editName, setEditName] = useState(tag.name);

    useEffect(() => {
        if (tag.colour)
            setCurrentColour(tag.colour);
    }, [tag])

    function ColourButton({ colour }) {
        const active = currentColour === colour.id;
        return (
            <button style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.2rem 0 0.2rem", color: `${active && "var(--highlight-color)"}` }}
                onClick={() => {
                    setCurrentColour(colour.id);
                    onUpdate(tag.id, tag.name, colour.id);
                }}
            >
                <span style={{ backgroundColor: colour.background }} className="tag-colour-swatch"/>
                <span style={{ width: "5rem" }}>{colour.label}</span>
                <span style={{ margin: "0 0.5rem 0", visibility: active ? "visible" : "hidden" }}>✓</span>
            </button>
        )
    }

    function TagEditMenu({ anchorRef }) {
        const [pos, setPos] = useState({ top: 0, left: 0 });

        useEffect(() => {
            if (!anchorRef.current || !menuRef.current) return;
            const rect = anchorRef.current.getBoundingClientRect();
            const menuRect = menuRef.current.getBoundingClientRect();
            const top = rect.bottom - menuRect.height - rect.height;
            setPos({ top: top, left: rect.left });
        }, [anchorRef]);

        const handleInputKeyDown = (event) => {
            if (event.key === 'Enter' && event.target.value) {
                setIsEditing(false);
                onUpdate(tag.id, event.target.value, currentColour);
            }
        }
        
        return createPortal(
            <div ref={menuRef} 
                style={{
                    top: `${pos.top}px`,
                    left: `${pos.left}px`
                }}
                className="tag-edit-menu"
            >
                <div className="tag-options">
                    <input type="text" className="tag-edit-input" value={editName}
                        onChange={e => setEditName(e.target.value)}
                        autoFocus="autofocus" onKeyDown={handleInputKeyDown}/>
                    <button style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.2rem 0.2rem" }} onClick={() => onDelete(tag.id)}>
                        <DeleteIcon className="icon" style={{ margin: "0 0.3rem 0" }}/>
                        Delete
                    </button>
                </div>
                <hr style={{ width: "90%", height: "1px", border: 0, backgroundColor: "gray" }}/>
                <span className="menu-text">Colours</span>
                <div className="tag-options">
                    {
                        colours.map(c => 
                            <ColourButton key={c.label} colour={c}/>)
                    }
                </div>
            </div>,
            document.body
        )
    }

    return (
        <div>
            <div className={`search-result ${isEditing && "active"}`} onClick={onClick}>
                <span style={{ background: colours.find(c => c.id === currentColour).background }} className="tag">{tag.name}</span>
                <button className="simple-button" ref={menuButtonRef} onClick={e => {
                        e.stopPropagation();
                        setIsEditing(!isEditing);
                    }} style={{ position: "relative" }}>...
                </button>
            </div>
            {
                isEditing && <TagEditMenu anchorRef={menuButtonRef} />
            }
        </div>
    )
};