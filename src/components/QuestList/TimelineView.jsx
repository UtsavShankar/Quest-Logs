import TodoDateGroup from "./TodoDateGroup";

export default function TimelineView({ todos, tagProps, todoActions }) {
    const scheduledDates = [...new Set(todos.map(t => t.scheduledDate ? t.scheduledDate : null))].sort(function(a,b) {
        if (!b) return -1;
        if (!a) return 1;
        return new Date(a) - new Date(b);
    });

    return (
        scheduledDates.map(date => <TodoDateGroup
            key={date}
            date={date}
            todos={todos}
            tagProps={tagProps}
            todoActions={todoActions}
        />
        )
    )
}