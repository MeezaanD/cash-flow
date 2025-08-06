export const formatDate = (date: string | Date | { toDate: () => Date }) => {
  let d: Date;

  if (typeof date === "string") {
    d = new Date(date);
  } else if (typeof date === "object" && date !== null && "toDate" in date) {
    // Handle Firestore timestamp objects
    d = (date as { toDate: () => Date }).toDate();
  } else if (date instanceof Date) {
    d = date;
  } else {
    return "Invalid Date";
  }

  // Check if the date is valid
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
