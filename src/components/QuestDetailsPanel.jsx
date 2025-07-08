import { useRef, useState, useEffect, useCallback } from "react";
import TagPicker from "./Tags";
import { SimpleButton } from "./Buttons";
import DescriptionBox from "./DescriptionBox";
import tagColours from "./TagData";

export default function QuestDetailsPanel({ quest, onUpdate, onDelete, tagProps }) {
    const { userTags } = tagProps;

    const [title, setTitle] = useState(quest.title);
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const getTag = useCallback(() => {
        const tagId = quest.tags?.[0];
        const tagData = userTags.find(tag => tag.id === tagId);
        const tag = tagId && tagData ? { 
            id: tagId, 
            name: tagData.name, 
            colour: tagData.colour
        } : null;
        return tag;
    }, [quest.tags, userTags])

    const [tag, setTag] = useState(getTag());
    const [isEditingTag, setIsEditingTag] = useState(false);
    
    const [deadline, setDeadline] = useState(quest.deadline);
    const [isEditingDate, setIsEditingDate] = useState(false);

    const formattedDeadline = deadline
                    ? new Date(deadline).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
                    : ""
    
    const [description, setDescription] = useState(quest.description);

    useEffect(() => {
        setTitle(quest.title);
        setTag(getTag());
        setDeadline(quest.deadline);
        setDescription(quest.description);
    }, [getTag, quest]);

    const updateTitle = (newTitle) => onUpdate(quest.id, newTitle, tag.id, deadline, quest.description);
    const updateTag = (newTag) => onUpdate(quest.id, quest.title, newTag ? newTag.id : null, deadline, quest.description);
    const updateDeadline = (newDeadline) => onUpdate(quest.id, quest.title, tag.id, newDeadline, quest.description);
    const updateDescription = (newDescription) => onUpdate(quest.id, quest.title, tag.id, deadline, newDescription)

    function DatePicker() {
        const ref = useRef();
        
        useEffect(() => {
            const handler = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    setIsEditingDate(false);
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

        return (
            <input ref={ref} type="date" value={deadline} style={{ width: "100px" }} onChange={(e) => {
                const newDeadline = e.target.value;
                setDeadline(newDeadline);
                setIsEditingDate(false);
                updateDeadline(newDeadline);
            }}/>
        )
    }

    function MetaRow() {
        let daysRemaining = "";
        if (deadline) {
            const milisBetween = new Date(deadline) - new Date();
            const daysBetween = Math.ceil(milisBetween / (1000 * 60 * 60 * 24));
            daysRemaining = `${daysBetween} day${daysBetween === 1 ? "" : "s"} remaining`;
        }

        return (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 2fr", position: "relative"}}>
                {
                    isEditingTag
                    ? <TagPicker 
                        userId={quest.userId} 
                        tagProps={tagProps}
                        editTag={tag}
                        onUpdate={newTag => {
                            setTag(newTag);
                            updateTag(newTag);
                        }} 
                        endEdit={() => setIsEditingTag(false)}
                        />
                    : tag
                        ? <span style={{ background: `${tagColours.find(c => c.id === tag?.colour)?.background}`, 
                            justifySelf: "start", cursor: "pointer" }} 
                            className="tag" onClick={() => setIsEditingTag(true)}>{tag.name}</span>
                        : <SimpleButton style={{color: "gray"}} onClick={() => setIsEditingTag(true)}>Add Tag</SimpleButton>
                }
                {
                    isEditingDate
                    ? <DatePicker/>
                    : deadline
                    ? <SimpleButton onClick={() => setIsEditingDate(true)}>{formattedDeadline}</SimpleButton>
                    : <SimpleButton style={{ color: "gray" }} onClick={() => setIsEditingDate(true)}>Add Date</SimpleButton>
                }
                <span style={{ whiteSpace: 'pre' }}>{daysRemaining}</span>
            </div>
        )
    }

    // setting timeout for when the deadline expires, reloads every time deadline value is updated, pretty efficient
    useEffect(() => {
        let timer;

        if (quest.deadline) {
            const deadlineDate = new Date(quest.deadline);
            const now = new Date();
            const timeout = deadlineDate.getTime() - now.getTime();

            console.log("Timeout for deadline:", timeout, now, deadlineDate);

            if (timeout > 0) {
                const scheduleNotification = () => {
                timer = setTimeout(() => {
                        new window.Notification(quest.title, { body: "Your quest has expired! You made a valiant effort!" });         
                    }, timeout); // 5 second for testing, change to timeout for deadline
                }

                if (Notification.permission === "granted") {
                    scheduleNotification();
                } else if (Notification.permission !== "denied") {
                    Notification.requestPermission().then(permission => {
                        if (permission === "granted") {
                        scheduleNotification();
                        }
                    });
                }
            }
        }
        
        return () => clearTimeout(timer);
    }, [deadline, quest.deadline, quest.title]);

    const titleRef = useRef(null);

    const handleTitleKeyDown = (event) => {
        if (event.key === 'Enter' && event.target.value) {
            titleRef.current.blur();
            endEditTitle();
        }
    }

    const endEditTitle = () => {
        title !== ""
        ? updateTitle(title)
        : setTitle(quest.title);
        setIsEditingTitle(false);
    }

    const [dropdownIsShowing, setDropdownIsShowing] = useState(false);

    return(
        <div className="quest-details-panel">
            <SimpleButton onClick={() => setDropdownIsShowing(!dropdownIsShowing)} style={{ marginLeft: "auto", position: "relative" }}>
                ...
                {
                    dropdownIsShowing && <button 
                        className="delete-button"
                        onClick={() => onDelete(quest.id)}>Delete</button>
                }
            </SimpleButton>
            <input ref={titleRef}
                className="h2-input" 
                value={title}
                style={{color: `${isEditingTitle ? "var(--highlight-color" : "white"}`}}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setIsEditingTitle(true)}
                onBlur={endEditTitle}
                onKeyDown={handleTitleKeyDown}
            />
            <MetaRow/>
            <div style={{ margin: "1em 0.3em 0.3em", flex: 1 }}>
                <DescriptionBox 
                    description={description}
                    onUpdate={desc => updateDescription(desc)}
                />
            </div >
        </div>
    )
}