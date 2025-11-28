export const shortIds = (id) => {
  if (!id) return "N/A";

  // simple hash for strings
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }

  // convert hash → base36 → take 6 chars
  return hash.toString(36).padStart(6, "0").substring(0, 6).toUpperCase();
};

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

export const formatDateRaw = (dateString) => {
  if (!dateString) return "Never";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return "Invalid date";
  }
};
