import React, { createContext, useContext, ReactNode } from 'react';
import { useTransactionsController } from '../controllers/TransactionsController';
import { useRecurringExpensesController } from '../controllers/RecurringExpensesController';
import { Transaction } from '../models/TransactionModel';
import { RecurringExpense } from '../models/RecurringExpenseModel';
import { TransactionType } from '../types';

interface AddTransactionData {
	type: 'income' | 'expense' | 'transfer';
	accountId: string;
	title: string;
	category: string;
	description?: string;
	amount: number;
	date?: Date;
	transferAccountId?: string;
}

interface AddTransferData {
	fromAccountId: string;
	toAccountId: string;
	amount: number;
	title: string;
	description?: string;
	date?: Date;
}

interface TransactionsContextValue {
	transactions: Transaction[];
	loading: boolean;
	addTransaction: (data: AddTransactionData) => Promise<void>;
	addTransfer: (data: AddTransferData) => Promise<void>;
	updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
	deleteTransaction: (id: string) => Promise<void>;
	deleteAllTransactions: () => Promise<void>;
	getExpenses: () => Transaction[];
	getIncome: () => Transaction[];
	getTransfers: () => Transaction[];
	getByCategory: (category: string) => Transaction[];
	getByType: (type: TransactionType) => Transaction[];
	getByAccount: (accountId: string) => Transaction[];
	getAll: () => Transaction[];
	getUniqueCategories: () => string[];
	calculateTotals: () => {
		totalAmount: number;
		totalIncome: number;
		totalExpense: number;
	};
	groupByCategory: () => Record<string, Transaction[]>;
	sortByDateDesc: () => Transaction[];
	recurringExpenses: RecurringExpense[];
	recurringExpensesLoading: boolean;
	addRecurringExpense: (expense: Omit<RecurringExpense, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
	updateRecurringExpense: (id: string, updates: Partial<RecurringExpense>) => Promise<void>;
	deleteRecurringExpense: (id: string) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

export const TransactionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const transactionsController = useTransactionsController();
	const recurringExpensesController = useRecurringExpensesController();

	return (
		<TransactionsContext.Provider
			value={{
				...transactionsController,
				...recurringExpensesController,
				recurringExpensesLoading: recurringExpensesController.loading,
			}}
		>
			{children}
		</TransactionsContext.Provider>
	);
};

export const useTransactionsContext = (): TransactionsContextValue => {
	const context = useContext(TransactionsContext);
	if (!context) {
		throw new Error('useTransactionsContext must be used within a TransactionsProvider');
	}
	return context;
};
