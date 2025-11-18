export const shortIds = (id)=>{
    return id?.substring(0, 6).toUpperCase() || 'N/A';
}

export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[date.getMonth()]}-${String(date.getDate()).padStart(
      2,
      "0"
    )},${date.getFullYear()}`;
  };