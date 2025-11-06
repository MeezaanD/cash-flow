import { useTransactions } from '../hooks/useTransactions';
import {
	Transaction,
	filterExpenses,
	filterIncome,
	filterByCategory,
	filterByType,
	getUniqueCategories,
	calculateTotals,
	groupByCategory,
	sortByDateDesc,
} from '../models/TransactionModel';

interface TransactionsControllerReturn {
	// Data
	transactions: Transaction[];
	loading: boolean;

	// CRUD operations
	addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'createdAt'>) => Promise<void>;
	updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
	deleteTransaction: (id: string) => Promise<void>;

	// Query methods
	getExpenses: () => Transaction[];
	getIncome: () => Transaction[];
	getByCategory: (category: string) => Transaction[];
	getByType: (type: 'income' | 'expense') => Transaction[];
	getAll: () => Transaction[];
	getUniqueCategories: () => string[];

	// Utility methods
	calculateTotals: () => {
		totalAmount: number;
		totalIncome: number;
		totalExpense: number;
	};
	groupByCategory: () => Record<string, Transaction[]>;
	sortByDateDesc: () => Transaction[];
}

export const useTransactionsController = (): TransactionsControllerReturn => {
	const { transactions, addTransaction, updateTransaction, deleteTransaction, loading } =
		useTransactions();

	return {
		// Data
		transactions,
		loading,

		// CRUD operations
		addTransaction,
		updateTransaction,
		deleteTransaction,

		// Query methods
		getExpenses: () => filterExpenses(transactions),
		getIncome: () => filterIncome(transactions),
		getByCategory: (category: string) => filterByCategory(transactions, category),
		getByType: (type: 'income' | 'expense') => filterByType(transactions, type),
		getAll: () => transactions,
		getUniqueCategories: () => getUniqueCategories(transactions),

		// Utility methods
		calculateTotals: () => calculateTotals(transactions),
		groupByCategory: () => groupByCategory(transactions),
		sortByDateDesc: () => sortByDateDesc(transactions),
	};
};
