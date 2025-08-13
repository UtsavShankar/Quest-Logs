import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {ReactComponent as MoreIcon} from '../../assets/more-horiz.svg';
import TabEditMenu from "./TabEditMenu";
import { useFloating, autoUpdate } from "@floating-ui/react";

export default function Tab({ tab, currentTab, deleteTab, updateTab, handleTabClick }) {
    const [isHovering, setIsHovering] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const {isOver, setNodeRef} = useDroppable({
        id: tab.id
    })
    const {refs, floatingStyles} = useFloating({
        placement: 'right',
        whileElementsMounted: autoUpdate,
    });
    
    const style = {
        textAlign: "left",
        display: "flex",
        justifyContent: "space-between",
        padding: "0.25em 0.5em 0.25em",
        borderRadius: "0.3em",
        backgroundColor: isOver ? 'var(--dark-highlight-color)' : undefined,
    };

    const updateName = (tabId, newName) => {
        if (newName && newName !== tab.name) {
            updateTab(tabId, newName);
        }
        setMenuIsOpen(false);
    }

    return (
        <div ref={tab.canEdit ? setNodeRef : null} style={style} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <button 
                key={tab.id}
                className={`side-button ${currentTab === tab.id && "selected"}`}
                style={{ textAlign: "left"}}
                onClick={() => handleTabClick(tab.id)}>
                    {tab.name}
            </button>
            <div ref={refs.setReference}>
                {
                ((tab.canEdit && isHovering) || menuIsOpen) &&
                <button className="icon-wrapper" onClick={() => setMenuIsOpen(!menuIsOpen)}>
                    <MoreIcon className="icon-button"/>
                </button>
                }
            </div>
            {menuIsOpen && <TabEditMenu ref={refs.setFloating} style={floatingStyles} deleteTab={deleteTab} updateName={updateName} tab={tab} setMenuIsOpen={setMenuIsOpen} />}
        </div>
    )
}