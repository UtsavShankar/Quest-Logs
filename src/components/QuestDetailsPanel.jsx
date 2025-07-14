import { useRef, useState, useEffect, useCallback } from "react";
import TagPicker from "./Tags";
import { SimpleButton } from "./Buttons";
import DescriptionBox from "./DescriptionBox";
import tagColours from "../data/tagData.js";
import { formatDate } from "../utils/dateUtils.js";

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
    const [isNotifying, setIsNotifying] = useState(quest.isNotifying || false);
    
    const [deadline, setDeadline] = useState(quest.deadline);
    const [isEditingDate, setIsEditingDate] = useState(false);
    
    const [scheduledDate, setScheduledDate] = useState(quest.scheduledDate);
    const [isEditingScheduledDate, setIsEditingScheduledDate] = useState(false);

    const [description, setDescription] = useState(quest.description);

    useEffect(() => {
        setTitle(quest.title);
        setTag(getTag());
        setDeadline(quest.deadline);
        setDescription(quest.description);
        setScheduledDate(quest.scheduledDate);
        setIsNotifying(quest.isNotifying || true);
    }, [getTag, quest]);

    useEffect(() => {
        setIsEditingTitle(false);
        setIsEditingTag(false);
        setIsEditingDate(false);
        setIsEditingScheduledDate(false);
    }, [quest.id]);

    const updateTitle = (newTitle) => 
        onUpdate(quest.id, newTitle, tag ? tag.id : null, deadline, scheduledDate, quest.description, isNotifying);
    const updateTag = (newTag) => 
        onUpdate(quest.id, quest.title, newTag ? newTag.id : null, deadline, scheduledDate, quest.description, isNotifying);
    const updateDeadline = (newDeadline) => 
        onUpdate(quest.id, quest.title, tag ? tag.id : null, newDeadline, scheduledDate, quest.description);
    const updateDescription = (newDescription) => 
        onUpdate(quest.id, quest.title, tag ? tag.id : null, deadline, scheduledDate, newDescription, isNotifying);
    const updateScheduledDate = (newScheduledDate) => 
        onUpdate(quest.id, quest.title, tag ? tag.id : null, deadline, newScheduledDate, quest.description, isNotifying);
    const updateisNotifying = (newisNotifying) => 
        onUpdate(quest.id, quest.title, tag ? tag.id : null, deadline, scheduledDate, quest.description, newisNotifying);

    function DatePicker({ value, onChange }) {
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
            <input ref={ref} type="date" value={value} style={{ width: "100px" }} onChange={onChange}/>
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
            <div>
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
                        ? <DatePicker value={deadline} onChange={(e) => {
                            const newDeadline = e.target.value;
                            setDeadline(newDeadline);
                            setIsEditingDate(false);
                            updateDeadline(newDeadline);
                          }}/>
                        : deadline
                        ? <SimpleButton onClick={() => setIsEditingDate(true)}>{formatDate(deadline)}</SimpleButton>
                        : <SimpleButton style={{ color: "gray" }} onClick={() => setIsEditingDate(true)}>Add Deadline</SimpleButton>
                    }

                    <span style={{ whiteSpace: 'pre' }}>{daysRemaining}</span>
                </div>
                <div style={{ padding: "0.5rem" }}>
                    <span>Do on:</span>
                    <span style={{ margin: "0.5rem" }}>
                    {
                        isEditingScheduledDate
                        ? <DatePicker value={scheduledDate} onChange={e => {
                            const newScheduledDate = e.target.value
                            setScheduledDate(newScheduledDate);
                            setIsEditingScheduledDate(false);
                            updateScheduledDate(newScheduledDate);
                          }} />
                        : scheduledDate
                        ? <button className="simple-button" onClick={() => setIsEditingScheduledDate(true)}>{formatDate(scheduledDate)}</button>
                        : <button style={{ color: "gray" }} className="simple-button" onClick={() => setIsEditingScheduledDate(true)}>Add Date</button>
                    }
                    </span>
                                     <span style={{ margin: "0.5rem" }}>
                    {
                        isNotifying
                        ? <SimpleButton value={tag || ""} onClick={() => { setIsNotifying(false); updateisNotifying(false); }}>NOTIFICATIONS ON</SimpleButton>
                        : <SimpleButton onClick={() => { setIsNotifying(true); updateisNotifying(true); }}>NOTIFICATIONS OFF</SimpleButton>
                    }
                    </span>
                </div>
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