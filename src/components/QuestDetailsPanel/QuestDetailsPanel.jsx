import { useRef, useState, useEffect, useCallback } from "react";
import TagPicker from "../Tags/Tags.jsx";
import { SimpleButton } from "../Buttons.jsx";
import DescriptionBox from "./DescriptionBox";
import tagColours from "../../data/tagData.js";
import { formatDate } from "../../utils/dateUtils.js";
import DatePicker from "../DatePicker.jsx";
import "../Buttons.css";
import {ReactComponent as MoreIcon} from '../../assets/more-horiz.svg';
import QuestOptions from "./QuestOptions";

export default function QuestDetailsPanel({ ref, quest, onUpdate, onDelete, tagProps }) {
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
        setIsNotifying(quest.isNotifying || false);
    }, [getTag, quest]);

    useEffect(() => {
        setIsEditingTitle(false);
        setIsEditingTag(false);
        setIsEditingDate(false);
        setIsEditingScheduledDate(false);
        setDropdownIsShowing(false);
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
                            : <button className="simple-button" style={{color: "gray"}} onClick={() => setIsEditingTag(true)}>Add Tag</button>
                    }

                    {
                        isEditingDate
                        ? <DatePicker value={deadline} 
                            onChange={(date) => {
                                setDeadline(date);
                                setIsEditingDate(false);
                                updateDeadline(date);
                            }}
                            onBlur={() => setIsEditingDate(false)}
                            remindChecked={isNotifying}
                            onRemindChange={e => {
                                const notifying = e.target.checked;
                                setIsNotifying(notifying);
                                updateisNotifying(notifying);
                            }}
                          />
                        : deadline
                        ? <SimpleButton onClick={() => setIsEditingDate(true)}>{formatDate(deadline)}</SimpleButton>
                        : <SimpleButton style={{ color: "gray" }} onClick={() => setIsEditingDate(true)}>Add Deadline</SimpleButton>
                    }

                    <span className="label" style={{ whiteSpace: 'pre', alignSelf: "center" }}>{daysRemaining}</span>
                </div>
                <div style={{ padding: "0.5rem" }}>
                    <span>Do on:</span>
                    <span style={{ margin: "0.5rem" }}>
                    {
                        isEditingScheduledDate
                        ? <DatePicker value={scheduledDate} 
                            onChange={date => {
                                setScheduledDate(date);
                                setIsEditingScheduledDate(false);
                                updateScheduledDate(date);
                            }}
                            onBlur={() => setIsEditingScheduledDate(false)}
                            showRemind={false}
                          />
                        : scheduledDate
                        ? <button className="simple-button" onClick={() => setIsEditingScheduledDate(true)}>{formatDate(scheduledDate)}</button>
                        : <button style={{ color: "gray" }} className="simple-button" onClick={() => setIsEditingScheduledDate(true)}>Add Date</button>
                    }
                    </span>
                </div>
            </div>
        )
    }

    const titleRef = useRef(null);
    const dropdownRef = useRef(null);

    const handleTitleKeyDown = (event) => {
        if (event.key === 'Enter') {
            titleRef.current.blur();
            endEditTitle();
        }
    }

    const endEditTitle = () => {
        setTitle(titleRef.current.innerText.trim());
        const title = titleRef.current.innerText.trim();
        title !== ""
        ? updateTitle(title)
        : setTitle(quest.title);
        setIsEditingTitle(false);
    }

    useEffect(() => {
        if (!isEditingTitle && titleRef.current) {
            titleRef.current.innerText = title;
        }
    }, [isEditingTitle, title]);

    useEffect(() => {
        if (titleRef.current) {
            if (isEditingTitle) {
                titleRef.current.style.textTransform = "none";
            } else {
                titleRef.current.style.textTransform = "";
        }
    }
    }, [isEditingTitle]);

    const [dropdownIsShowing, setDropdownIsShowing] = useState(false);

    useEffect(() => {
        if (!dropdownIsShowing) return;
        
        const clickHandler = (event) => {
            if (!dropdownRef.current?.contains(event.target)) {
                event.stopImmediatePropagation();
                setDropdownIsShowing(false);
            }
        }

        const timeout = setTimeout(() => {
            document.addEventListener("click", clickHandler);
        }, 500)

        return () => {
            clearTimeout(timeout);
            document.removeEventListener("click", clickHandler);
        }
    }, [dropdownIsShowing])

    return(
        <div ref={ref} className="quest-details-panel">
            <div 
                className="icon-wrapper" 
                onClick={() => setDropdownIsShowing(!dropdownIsShowing)}
                style={{ marginLeft: "auto", position: "relative", cursor:"pointer" }}
            >
                <MoreIcon className="icon-button"/>
                {
                    dropdownIsShowing && <QuestOptions ref={dropdownRef} onDelete={() => onDelete(quest.id)}/>
                }
            </div>
            <span
                ref={titleRef}
                className="h2-input"
                style={{ color: isEditingTitle ? "var(--highlight-color)" : "white" }}
                onFocus={() => setIsEditingTitle(true)}
                onBlur={endEditTitle}
                onKeyDown={handleTitleKeyDown}
                contentEditable
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