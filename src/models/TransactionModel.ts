export interface Transaction {
  id?: string;
  userId?: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description?: string;
  date?: Date | { toDate: () => Date };
  createdAt?: Date | { toDate: () => Date };
}

// Normalize Firestore data (converts Timestamp to Date)
export const normalizeTransaction = (doc: any): Transaction => {
  const transaction: Transaction = {
    id: doc.id,
    userId: doc.userId,
    title: doc.title,
    amount: doc.amount,
    type: doc.type,
    category: doc.category,
    description: doc.description,
  };

  // Normalize date field
  if (doc.date) {
    if (typeof doc.date === "object" && "toDate" in doc.date) {
      transaction.date = doc.date.toDate();
    } else if (doc.date instanceof Date) {
      transaction.date = doc.date;
    } else {
      transaction.date = new Date(doc.date);
    }
  }

  // Normalize createdAt field
  if (doc.createdAt) {
    if (typeof doc.createdAt === "object" && "toDate" in doc.createdAt) {
      transaction.createdAt = doc.createdAt.toDate();
    } else if (doc.createdAt instanceof Date) {
      transaction.createdAt = doc.createdAt;
    } else {
      transaction.createdAt = new Date(doc.createdAt);
    }
  }

  return transaction;
};

// Batch normalize an array of Firestore documents
export const normalizeTransactions = (docs: any[]): Transaction[] => {
  return docs.map(normalizeTransaction);
};

// Utility functions for filtering transactions

export const filterExpenses = (transactions: Transaction[]): Transaction[] =>
  transactions.filter((t) => t.type === "expense");

export const filterIncome = (transactions: Transaction[]): Transaction[] =>
  transactions.filter((t) => t.type === "income");

export const filterByCategory = (
  transactions: Transaction[],
  category: string
): Transaction[] => transactions.filter((t) => t.category === category);

export const filterByType = (
  transactions: Transaction[],
  type: "income" | "expense"
): Transaction[] => transactions.filter((t) => t.type === type);

// Get unique categories from transactions
export const getUniqueCategories = (transactions: Transaction[]): string[] =>
  Array.from(new Set(transactions.map((t) => t.category))).sort();

// Calculate totals
export const calculateTotals = (transactions: Transaction[]) => {
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalIncome = filterIncome(transactions).reduce(
    (sum, tx) => sum + tx.amount,
    0
  );
  const totalExpense = filterExpenses(transactions).reduce(
    (sum, tx) => sum + tx.amount,
    0
  );

  return {
    totalAmount,
    totalIncome,
    totalExpense,
  };
};

// Group transactions by category
export const groupByCategory = (
  transactions: Transaction[]
): Record<string, Transaction[]> => {
  return transactions.reduce(
    (acc, tx) => {
      if (!acc[tx.category]) {
        acc[tx.category] = [];
      }
      acc[tx.category].push(tx);
      return acc;
    },
    {} as Record<string, Transaction[]>
  );
};

// Sort transactions by date (newest first)
export const sortByDateDesc = (transactions: Transaction[]): Transaction[] => {
  return [...transactions].sort((a, b) => {
    const getValidDate = (val: any): Date => {
      if (!val) return new Date(0);
      if (typeof val === "object" && "toDate" in val) return val.toDate();
      return new Date(val);
    };

    const dateA = getValidDate(a.date ?? a.createdAt);
    const dateB = getValidDate(b.date ?? b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
};
