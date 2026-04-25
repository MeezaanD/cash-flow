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

type BudgetDocForLegacy = {
	createdAt?: unknown;
	updatedAt?: unknown;
};

const getLegacyBudgetRange = (doc: BudgetDocForLegacy): DateRange => {
	const createdAt =
		parseDbDateOrNull(doc.createdAt) ??
		parseDbDateOrNull(doc.updatedAt) ??
		new Date();

	return getMonthBounds(createdAt);
};

type BudgetDoc = {
	id: string;
	userId?: string;
	category?: string;
	amount?: number;
	period?: Budget['period'];
	plannedStartDate?: string;
	plannedEndDate?: string;
	actualStartDate?: string;
	actualEndDate?: string;
	createdAt?: unknown;
	updatedAt?: unknown;
};

export const normalizeBudget = (doc: BudgetDoc): Budget => {
	const legacyRange = getLegacyBudgetRange(doc);
	const budget: Budget = {
		id: doc.id,
		userId: doc.userId,
		category: doc.category ?? '',
		amount: doc.amount ?? 0,
		period: doc.period ?? 'monthly',
		plannedStartDate: doc.plannedStartDate ?? legacyRange.startDate,
		plannedEndDate: doc.plannedEndDate ?? legacyRange.endDate,
		actualStartDate: doc.actualStartDate ?? undefined,
		actualEndDate: doc.actualEndDate ?? undefined,
	};

	const createdParsed = doc.createdAt != null ? parseDbDateOrNull(doc.createdAt) : null;
	if (createdParsed) {
		budget.createdAt = createdParsed;
	}

	return budget;
};

export const normalizeBudgets = (docs: BudgetDoc[]): Budget[] => docs.map(normalizeBudget);

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
