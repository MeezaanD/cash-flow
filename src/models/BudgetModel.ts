import { Budget, BudgetProgress, DateRange, Transaction } from '../types';
import { filterTransactionsByDateRangeObject } from '../utils/dateRangeFilter';
import { parseDbDateOrNull } from '../utils/date';

export type { Budget };

const toIsoDate = (value: Date): string => value.toISOString().split('T')[0];

const getMonthBounds = (baseDate: Date): DateRange => {
	const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
	const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);

	return {
		startDate: toIsoDate(start),
		endDate: toIsoDate(end),
	};
};

const getLegacyBudgetRange = (doc: any): DateRange => {
	const createdAt =
		parseDbDateOrNull(doc.createdAt) ??
		parseDbDateOrNull(doc.updatedAt) ??
		new Date();

	return getMonthBounds(createdAt);
};

export const normalizeBudget = (doc: any): Budget => {
	const legacyRange = getLegacyBudgetRange(doc);
	const budget: Budget = {
		id: doc.id,
		userId: doc.userId,
		category: doc.category,
		amount: doc.amount ?? 0,
		period: doc.period ?? 'monthly',
		plannedStartDate: doc.plannedStartDate ?? legacyRange.startDate,
		plannedEndDate: doc.plannedEndDate ?? legacyRange.endDate,
		actualStartDate: doc.actualStartDate ?? undefined,
		actualEndDate: doc.actualEndDate ?? undefined,
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
	const started = Boolean(budget.actualStartDate && budget.actualEndDate);
	const actualRange: DateRange = {
		startDate: budget.actualStartDate ?? '',
		endDate: budget.actualEndDate ?? '',
	};

	const actualSpent = started
		? filterTransactionsByDateRangeObject(
				transactions.filter(
					(transaction) =>
						transaction.type === 'expense' && transaction.category === budget.category
					),
				actualRange
		  ).reduce((sum, transaction) => sum + transaction.amount, 0)
		: 0;

	const remaining = started ? Math.max(0, budget.amount - actualSpent) : budget.amount;
	const overBudget = started ? Math.max(0, actualSpent - budget.amount) : 0;
	const percent =
		started && budget.amount > 0
			? Math.min(100, (actualSpent / budget.amount) * 100)
			: 0;

	return {
		budget,
		plannedAmount: budget.amount,
		plannedStartDate: budget.plannedStartDate,
		plannedEndDate: budget.plannedEndDate,
		actualStartDate: budget.actualStartDate,
		actualEndDate: budget.actualEndDate,
		started,
		actualSpent,
		remaining,
		overBudget,
		percent,
	};
};
