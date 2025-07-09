export const formatDate = (date) => {
    const inputDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1)
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1)

    if (inputDate.setHours(0,0,0,0) === today.setHours(0,0,0,0)) {
        return "Today";
    } else if (inputDate.setHours(0,0,0,0) === tomorrow.setHours(0,0,0,0)) {
        return "Tomorrow";
    } else if (inputDate.setHours(0,0,0,0) === yesterday.setHours(0,0,0,0)) {
        return "Yesterday";
    }

    return date
                ? inputDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
                : ""
}