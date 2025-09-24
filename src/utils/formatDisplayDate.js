
const formatDisplayDate = (dateString) => {
    if(!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US",{
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default formatDisplayDate;