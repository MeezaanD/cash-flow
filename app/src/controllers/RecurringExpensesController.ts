import { useRecurringExpenses } from '../hooks/useRecurringExpenses';
import { RecurringExpense } from '../models/RecurringExpenseModel';

interface RecurringExpensesControllerReturn {
	// Data
	recurringExpenses: RecurringExpense[];
	loading: boolean;

	// CRUD operations
	addRecurringExpense: (expense: Omit<RecurringExpense, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
	updateRecurringExpense: (id: string, updates: Partial<RecurringExpense>) => Promise<void>;
	deleteRecurringExpense: (id: string) => Promise<void>;
}

export const useRecurringExpensesController = (): RecurringExpensesControllerReturn => {
	const {
		recurringExpenses,
		addRecurringExpense,
		updateRecurringExpense,
		deleteRecurringExpense,
		loading,
	} = useRecurringExpenses();

	return {
		// Data
		recurringExpenses,
		loading,

		// CRUD operations
		addRecurringExpense,
		updateRecurringExpense,
		deleteRecurringExpense,
	};
};

