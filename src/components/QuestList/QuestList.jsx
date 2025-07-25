import { useState } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import TodoItem from "./TodoItem";
import TimelineView from "./TimelineView";
import TagPicker from "../Tags/Tags";
import "../Buttons.css";
import DatePicker from "../DatePicker";
import { formatDate } from "../../utils/dateUtils";
import { useTheme } from "../../hooks/ThemeContext";
import tagColours from "../../data/tagData.js";

export default function QuestList({ todos, activeList, shownTodos, tagProps, toggleCompleted, openQuest, setOpenQuest, addTodoToDatabase }) {
    const { userTags, addTag, deleteTag, updateTag } = tagProps;
    const [newTask, setNewTask] = useState("");
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [tag, setTag] = useState(null);
    const [isAddingDate, setIsAddingDate] = useState(false);
    const [deadline, setDeadline] = useState(null);
    const [isNotifying, setIsNotifying] = useState(true);
    const { theme } = useTheme();
    
    const addTodo = async () => {
        if (!newTask.trim()) return;
        const item = {
            title: newTask,
            completed: false,
            createdAt: Date.now(),
            sortOrder: todos.length,
            deadline: deadline,
            isNotifying: isNotifying,
            tags: [tag ? tag.id : null],
            description: "",
        };
        if (activeList !== "all" && activeList !== "timeline" && activeList !== "completed") {
            item.list = activeList;
        }
        setNewTask("");
        setTag(null);
        setDeadline(null);
        setIsAddingTag(false);
        setIsAddingDate(false);
        setIsNotifying(true);
        addTodoToDatabase(item);
    };

    const getTagColour = () => {
        return tagColours.find(c => c.id === tag?.colour)?.background;
    }

    return (
        <div className="quest-list">
            <div className="quests">
            {activeList !== "timeline"
            ? <SortableContext items={todos}>
            <ul style={{listStyleType: "none", margin: 0, padding: 0, flex: 1, minHeight: 0 }}>
                {shownTodos.map((todo) => (
                    <TodoItem
                        key={todo.id} 
                        todo={todo}
                        tagProps={tagProps}
                        onCompletedChange={completed => toggleCompleted(todo.id, completed)} 
                        onClick={() => setOpenQuest(todo)}
                        isOpen={openQuest && openQuest.id === todo.id}
                    />
                    ))}
            </ul>
            </SortableContext>
            : <TimelineView 
                todos={todos}
                tagProps={{ userTags, addTag, deleteTag, updateTag }}
                todoActions={{ toggleCompleted, openQuest, setOpenQuest }}
            />
            }
            </div>
            <br />
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: "1fr auto", gap: '8px', alignItems: 'center', margin: "0 1em 0"}}>
                <input className="text-input" value={newTask} placeholder={`Enter new ${theme.taskName}`} onChange={(e) => setNewTask(e.target.value)} />
                <button onClick={addTodo}>{`Add ${theme.taskName.charAt(0).toUpperCase() + theme.taskName.slice(1)}`}</button>
            </div>
            <div style={{ display: "flex", gap: "1em", margin: "0.5em 1em 0.5em", position: "relative"}}>
                <span>
                {
                    !isAddingTag
                    ? tag
                    ? <span className="tag" style={{ background: getTagColour() }} onClick={() => setIsAddingTag(true)}>{tag.name}</span>
                    : <button className="simple-button" onClick={() => setIsAddingTag(true)}>Add Tag</button>
                    : <TagPicker editTag={tag} tagProps={{ userTags, addTag, deleteTag, updateTag }} onUpdate={newTag => setTag(newTag)} endEdit={() => setIsAddingTag(false)}/>
                }
                </span>
                <span>
                {
                    !isAddingDate
                    ? <button className="simple-button" onClick={() => setIsAddingDate(true)}>{deadline ? formatDate(deadline) : "Add Date"}</button>
                    : <DatePicker value={deadline || ""} 
                        onChange={date => setDeadline(date)}
                        onBlur={() => setIsAddingDate(false)}
                        remindChecked={isNotifying}
                        onRemindChange={e => {
                            const notifying = e.target.checked;
                            setIsNotifying(notifying)
                        }}
                    />
                }
                </span>
            </div>
        </div>
    )
}