import { Budget, BudgetProgress, Transaction } from '../types';

export type { Budget };

export const normalizeBudget = (doc: any): Budget => {
	const budget: Budget = {
		id: doc.id,
		userId: doc.userId,
		category: doc.category,
		amount: doc.amount ?? 0,
		period: doc.period ?? 'monthly',
	};

	if (doc.createdAt) {
		if (typeof doc.createdAt === 'object' && 'toDate' in doc.createdAt) {
			budget.createdAt = doc.createdAt.toDate();
		} else if (doc.createdAt instanceof Date) {
			budget.createdAt = doc.createdAt;
		} else {
			budget.createdAt = new Date(doc.createdAt);
		}
	}

	return budget;
};

export const normalizeBudgets = (docs: any[]): Budget[] => docs.map(normalizeBudget);

export const calculateBudgetUsage = (
	budget: Budget,
	transactions: Transaction[]
): BudgetProgress => {
	const now = new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
	const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

	const spent = transactions
		.filter((t) => {
			if (t.type !== 'expense') return false;
			if (t.category !== budget.category) return false;
			const txDate = getTransactionDate(t);
			return txDate >= monthStart && txDate <= monthEnd;
		})
		.reduce((sum, t) => sum + t.amount, 0);

	const remaining = Math.max(0, budget.amount - spent);
	const percent = budget.amount > 0 ? Math.min(100, (spent / budget.amount) * 100) : 0;

	return { budget, spent, remaining, percent };
};

const getTransactionDate = (t: Transaction): Date => {
	if (!t.date) return t.createdAt instanceof Date ? t.createdAt : new Date();
	if (typeof t.date === 'object' && 'toDate' in t.date) return t.date.toDate();
	if (t.date instanceof Date) return t.date;
	return new Date();
};
