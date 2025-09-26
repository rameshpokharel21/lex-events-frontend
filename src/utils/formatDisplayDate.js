
const formatDisplayDate = (dateString) => {
    if(!dateString) return "";

    // const [datePart, timePart] = dateString.split("T");
    // const [year, month, day] = datePart.split("-");
    // const [hours, minutes, seconds] = timePart.split(":");
    
    // const localDate = new Date(year, month-1, day, hours, minutes, seconds);
    let cleanDateString = dateString;
    if(dateString.split(":").length === 2){
        cleanDateString = dateString + ":00";
    }
    cleanDateString = cleanDateString.replace(" ", "T");
    const localDate = new Date(cleanDateString);
    return localDate.toLocaleString("en-US",{
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default formatDisplayDate;