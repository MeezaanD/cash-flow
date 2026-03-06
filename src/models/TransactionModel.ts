import { Transaction, TransactionType } from '../types';
import { parseDbDateOrNull } from '../utils/date';

export type { Transaction };

export const normalizeTransaction = (doc: any): Transaction => {
	const transaction: Transaction = {
		id: doc.id,
		userId: doc.userId,
		accountId: doc.accountId,
		title: doc.title,
		amount: doc.amount,
		type: doc.type as TransactionType,
		category: doc.category,
		description: doc.description,
		transferAccountId: doc.transferAccountId,
	};

	if (doc.date) {
		if (typeof doc.date === 'object' && 'toDate' in doc.date) {
			transaction.date = doc.date.toDate();
		} else if (doc.date instanceof Date) {
			transaction.date = doc.date;
		} else {
			transaction.date = new Date(doc.date);
		}
	}

	if (doc.createdAt) {
		if (typeof doc.createdAt === 'object' && 'toDate' in doc.createdAt) {
			transaction.createdAt = doc.createdAt.toDate();
		} else if (doc.createdAt instanceof Date) {
			transaction.createdAt = doc.createdAt;
		} else {
			transaction.createdAt = new Date(doc.createdAt);
		}
	}

	return transaction;
};

export const normalizeTransactions = (docs: any[]): Transaction[] =>
	docs.map(normalizeTransaction);

export const filterExpenses = (transactions: Transaction[]): Transaction[] =>
	transactions.filter((t) => t.type === 'expense');

export const filterIncome = (transactions: Transaction[]): Transaction[] =>
	transactions.filter((t) => t.type === 'income');

export const filterTransfers = (transactions: Transaction[]): Transaction[] =>
	transactions.filter((t) => t.type === 'transfer');

export const filterByCategory = (transactions: Transaction[], category: string): Transaction[] =>
	transactions.filter((t) => t.category === category);

export const filterByType = (
	transactions: Transaction[],
	type: TransactionType
): Transaction[] => transactions.filter((t) => t.type === type);

export const filterByAccount = (transactions: Transaction[], accountId: string): Transaction[] =>
	transactions.filter((t) => t.accountId === accountId);

export const getUniqueCategories = (transactions: Transaction[]): string[] =>
	Array.from(new Set(transactions.map((t) => t.category))).sort();

export const calculateTotals = (transactions: Transaction[]) => {
	const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
	const totalIncome = filterIncome(transactions).reduce((sum, tx) => sum + tx.amount, 0);
	const totalExpense = filterExpenses(transactions).reduce((sum, tx) => sum + tx.amount, 0);

	return {
		totalAmount,
		totalIncome,
		totalExpense,
	};
};

export const groupByCategory = (transactions: Transaction[]): Record<string, Transaction[]> => {
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

export const sortByDateDesc = (transactions: Transaction[]): Transaction[] => {
	return [...transactions].sort((a, b) => {
		const dateA =
			parseDbDateOrNull(a.date) ?? parseDbDateOrNull(a.createdAt) ?? new Date(0);
		const dateB =
			parseDbDateOrNull(b.date) ?? parseDbDateOrNull(b.createdAt) ?? new Date(0);
		return dateB.getTime() - dateA.getTime();
	});
};
