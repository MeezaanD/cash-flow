import React, { createContext, useContext, ReactNode } from 'react';
import { useBudgetsController } from '../controllers/BudgetsController';
import { Budget, BudgetProgress, Transaction } from '../types';

interface BudgetsContextValue {
	budgets: Budget[];
	loading: boolean;
	addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
	updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
	deleteBudget: (id: string) => Promise<void>;
	getBudgetProgress: (budgetId: string, transactions: Transaction[]) => BudgetProgress | null;
	getAllBudgetProgress: (transactions: Transaction[]) => BudgetProgress[];
}

const BudgetsContext = createContext<BudgetsContextValue | undefined>(undefined);

export const BudgetsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const controller = useBudgetsController();

	return (
		<BudgetsContext.Provider value={controller}>
			{children}
		</BudgetsContext.Provider>
	);
};

export const useBudgetsContext = (): BudgetsContextValue => {
	const context = useContext(BudgetsContext);
	if (!context) {
		throw new Error('useBudgetsContext must be used within a BudgetsProvider');
	}
	return context;
};
