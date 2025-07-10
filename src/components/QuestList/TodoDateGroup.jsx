import { formatDate } from "../../utils/dateUtils"
import TodoItem from "./TodoItem"

export default function TodoDateGroup({ date, todos, tagProps, todoActions }) {
    const { toggleCompleted, openQuest, setOpenQuest } = todoActions;

    return (
        <div>
            <h3 style={{ padding: "0 0 0 0.8rem" }}>{date ? formatDate(date) : "Upcoming"}</h3>
            {
            todos.filter(t => date ? t.scheduledDate === date : !t.scheduledDate)
                .map(todo => <TodoItem
                key={todo.id} 
                    todo={todo}
                    tagProps={tagProps}
                    onCompletedChange={completed => toggleCompleted(todo.id, completed)} 
                    onClick={() => setOpenQuest(todo)}
                    isOpen={openQuest && openQuest.id === todo.id}
                />
                )
            }
        </div>
    )
}