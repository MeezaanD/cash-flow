import { Transaction } from '../types';
import { DateRange } from '../components/app/DateRangeFilter';

export const filterTransactionsByDateRange = (
	transactions: Transaction[],
	startDate?: string,
	endDate?: string
): Transaction[] => {
	// If no date range is provided, return all transactions
	if (!startDate && !endDate) {
		return transactions;
	}

	let start: Date | null = null;
	let end: Date | null = null;

	if (startDate) {
		start = new Date(startDate);
		start.setHours(0, 0, 0, 0);
	}

	if (endDate) {
		end = new Date(endDate);
		end.setHours(23, 59, 59, 999);
	}

	return transactions.filter((transaction) => {
		let transactionDate: Date | null = null;

		// Parse transaction date
		if (transaction.date) {
			if (typeof transaction.date === 'object' && 'toDate' in transaction.date) {
				transactionDate = transaction.date.toDate();
			} else if (transaction.date instanceof Date) {
				transactionDate = transaction.date;
			} else {
				transactionDate = new Date(transaction.date);
			}
		} else if (transaction.createdAt) {
			if (typeof transaction.createdAt === 'object' && 'toDate' in transaction.createdAt) {
				transactionDate = transaction.createdAt.toDate();
			} else if (transaction.createdAt instanceof Date) {
				transactionDate = transaction.createdAt;
			} else {
				transactionDate = new Date(transaction.createdAt);
			}
		}

		// Skip transactions without a valid date
		if (!transactionDate || isNaN(transactionDate.getTime())) {
			return false;
		}

		// Apply date range filters
		if (start && transactionDate < start) {
			return false;
		}
		if (end && transactionDate > end) {
			return false;
		}

		return true;
	});
};

export const filterTransactionsByDateRangeObject = (
	transactions: Transaction[],
	dateRange: DateRange
): Transaction[] => {
	return filterTransactionsByDateRange(transactions, dateRange.startDate, dateRange.endDate);
};

export const formatDateRange = (dateRange: DateRange): string => {
	if (!dateRange.startDate || !dateRange.endDate) {
		return 'All time';
	}

	const start = new Date(dateRange.startDate).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	});
	const end = new Date(dateRange.endDate).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});

	return `${start} - ${end}`;
};
