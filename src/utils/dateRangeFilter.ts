import { Transaction } from "../types";
import { DateRange } from "../components/DateRangeFilter";

export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  dateRange: DateRange
): Transaction[] => {
  if (!dateRange.startDate || !dateRange.endDate) {
    return transactions;
  }

  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);

  // Set time to start of day for start date and end of day for end date
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return transactions.filter((transaction) => {
    let transactionDate: Date;

    // Parse transaction date
    if (transaction.date) {
      if (
        typeof transaction.date === "object" &&
        "toDate" in transaction.date
      ) {
        transactionDate = transaction.date.toDate();
      } else if (transaction.date instanceof Date) {
        transactionDate = transaction.date;
      } else {
        transactionDate = new Date(transaction.date);
      }
    } else if (transaction.createdAt) {
      if (
        typeof transaction.createdAt === "object" &&
        "toDate" in transaction.createdAt
      ) {
        transactionDate = transaction.createdAt.toDate();
      } else if (transaction.createdAt instanceof Date) {
        transactionDate = transaction.createdAt;
      } else {
        transactionDate = new Date(transaction.createdAt);
      }
    } else {
      return false; // Skip transactions without a date
    }

    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

export const formatDateRange = (dateRange: DateRange): string => {
  if (!dateRange.startDate || !dateRange.endDate) {
    return "All time";
  }

  const start = new Date(dateRange.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const end = new Date(dateRange.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${start} - ${end}`;
};
