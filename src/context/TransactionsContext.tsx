import React, { createContext, useContext, ReactNode } from 'react';
import { useTransactionsController } from '../controllers/TransactionsController';
import { Transaction } from '../models/TransactionModel';

interface TransactionsContextValue {
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

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

interface TransactionsProviderProps {
	children: ReactNode;
}

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({ children }) => {
	const controller = useTransactionsController();

	return (
		<TransactionsContext.Provider value={controller}>{children}</TransactionsContext.Provider>
	);
};

export const useTransactionsContext = (): TransactionsContextValue => {
	const context = useContext(TransactionsContext);
	if (!context) {
		throw new Error('useTransactionsContext must be used within a TransactionsProvider');
	}
	return context;
};
