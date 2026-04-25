export interface RecurringTransaction {
	id?: string;
	userId?: string;
	accountId?: string;
	title: string;
	amount: number;
	type?: 'income' | 'expense';
	category: string;
	description?: string;
	frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
	createdAt?: Date | { toDate: () => Date };
}

type RecurringDoc = {
	id?: string;
	userId?: string;
	accountId?: string;
	title?: string;
	amount?: number;
	type?: string;
	category?: string;
	description?: string;
	frequency?: string;
	createdAt?: unknown;
};

export const normalizeRecurringTransaction = (doc: RecurringDoc): RecurringTransaction => {
	const recurringTransaction: RecurringTransaction = {
		id: doc.id,
		userId: doc.userId,
		accountId: doc.accountId,
		title: doc.title ?? '',
		amount: doc.amount ?? 0,
		type: (doc.type as RecurringTransaction['type']) ?? 'expense',
		category: doc.category ?? '',
		description: doc.description,
		frequency: doc.frequency as RecurringTransaction['frequency'],
	};

	if (doc.createdAt) {
		if (typeof doc.createdAt === 'object' && 'toDate' in doc.createdAt) {
			recurringTransaction.createdAt = (doc.createdAt as { toDate: () => Date }).toDate();
		} else if (doc.createdAt instanceof Date) {
			recurringTransaction.createdAt = doc.createdAt;
		} else {
			recurringTransaction.createdAt = new Date(doc.createdAt as string | number);
		}
	}

	return recurringTransaction;
};

export const normalizeRecurringTransactions = (docs: RecurringDoc[]): RecurringTransaction[] =>
	docs.map(normalizeRecurringTransaction);

export const validateRecurringTransaction = (transaction: Partial<RecurringTransaction>): string[] => {
	const errors: string[] = [];

	if (!transaction.title || transaction.title.trim() === '') {
		errors.push('Title is required');
	}

	if (transaction.amount === undefined || transaction.amount === null || transaction.amount <= 0) {
		errors.push('Amount must be greater than 0');
	}

	if (!transaction.category || transaction.category.trim() === '') {
		errors.push('Category is required');
	}

	if (
		transaction.frequency &&
		!['daily', 'weekly', 'monthly', 'yearly'].includes(transaction.frequency)
	) {
		errors.push('Frequency must be daily, weekly, monthly, or yearly');
	}

	return errors;
};
