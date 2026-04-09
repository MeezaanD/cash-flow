export interface RecurringTransaction {
id?: string;
userId?: string;
accountId?: string;
title: string;
amount: number;
type?: 'income' | 'expense';
category: string;
description?: string;
frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
createdAt?: Date | { toDate: () => Date };
}

export const normalizeRecurringTransaction = (doc: any): RecurringTransaction => {
const recurringTransaction: RecurringTransaction = {
id: doc.id,
userId: doc.userId,
accountId: doc.accountId,
title: doc.title,
amount: doc.amount,
type: doc.type ?? 'expense',
category: doc.category,
description: doc.description,
frequency: doc.frequency,
};

if (doc.createdAt) {
if (typeof doc.createdAt === 'object' && 'toDate' in doc.createdAt) {
recurringTransaction.createdAt = doc.createdAt.toDate();
} else if (doc.createdAt instanceof Date) {
recurringTransaction.createdAt = doc.createdAt;
} else {
recurringTransaction.createdAt = new Date(doc.createdAt);
}
}

return recurringTransaction;
};

export const normalizeRecurringTransactions = (docs: any[]): RecurringTransaction[] =>
docs.map(normalizeRecurringTransaction);

export const validateRecurringTransaction = (transaction: Partial<RecurringTransaction>): string[] => {
const errors: string[] = [];

if (!transaction.title || transaction.title.trim() === '') {
errors.push('Title is required');
}

if (transaction.amount === undefined || transaction.amount === null || transaction.amount <= 0) {
errors.push('Amount must be greater than 0');
}

if (!transaction.category || transaction.category.trim() === '') {
errors.push('Category is required');
}

if (transaction.frequency && !['daily', 'weekly', 'monthly', 'yearly'].includes(transaction.frequency)) {
errors.push('Frequency must be daily, weekly, monthly, or yearly');
}

return errors;
};
