import { useBudgets } from '../hooks/useBudgets';
import { Budget, BudgetProgress, Transaction } from '../types';
import { calculateBudgetUsage } from '../models/BudgetModel';

interface BudgetsControllerReturn {
	budgets: Budget[];
	loading: boolean;
	addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
	updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
	deleteBudget: (id: string) => Promise<void>;
	getBudgetProgress: (budgetId: string, transactions: Transaction[]) => BudgetProgress | null;
	getAllBudgetProgress: (transactions: Transaction[]) => BudgetProgress[];
}

export const useBudgetsController = (): BudgetsControllerReturn => {
	const { budgets, addBudget, updateBudget, deleteBudget, loading } = useBudgets();

	return {
		budgets,
		loading,
		addBudget,
		updateBudget,
		deleteBudget,
		getBudgetProgress: (budgetId, transactions) => {
			const budget = budgets.find((b) => b.id === budgetId);
			if (!budget) return null;
			return calculateBudgetUsage(budget, transactions);
		},
		getAllBudgetProgress: (transactions) =>
			budgets.map((b) => calculateBudgetUsage(b, transactions)),
	};
};
