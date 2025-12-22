export interface RecurringExpense {
	id?: string;
	userId?: string;
	title: string;
	amount: number;
	category: string;
	description?: string;
	frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
	createdAt?: Date | { toDate: () => Date };
}

// Normalize Firestore data (converts Timestamp to Date)
export const normalizeRecurringExpense = (doc: any): RecurringExpense => {
	const recurringExpense: RecurringExpense = {
		id: doc.id,
		userId: doc.userId,
		title: doc.title,
		amount: doc.amount,
		category: doc.category,
		description: doc.description,
		frequency: doc.frequency,
	};

	// Normalize createdAt field
	if (doc.createdAt) {
		if (typeof doc.createdAt === 'object' && 'toDate' in doc.createdAt) {
			recurringExpense.createdAt = doc.createdAt.toDate();
		} else if (doc.createdAt instanceof Date) {
			recurringExpense.createdAt = doc.createdAt;
		} else {
			recurringExpense.createdAt = new Date(doc.createdAt);
		}
	}

	return recurringExpense;
};

// Batch normalize an array of Firestore documents
export const normalizeRecurringExpenses = (docs: any[]): RecurringExpense[] => {
	return docs.map(normalizeRecurringExpense);
};

// Validation helpers
export const validateRecurringExpense = (expense: Partial<RecurringExpense>): string[] => {
	const errors: string[] = [];

	if (!expense.title || expense.title.trim() === '') {
		errors.push('Title is required');
	}

	if (expense.amount === undefined || expense.amount === null || expense.amount <= 0) {
		errors.push('Amount must be greater than 0');
	}

	if (!expense.category || expense.category.trim() === '') {
		errors.push('Category is required');
	}

	if (expense.frequency && !['daily', 'weekly', 'monthly', 'yearly'].includes(expense.frequency)) {
		errors.push('Frequency must be daily, weekly, monthly, or yearly');
	}

	return errors;
};

