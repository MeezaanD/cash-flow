import { CategoryDefinition } from '../types';

export const TRANSFER_CATEGORY_VALUE = 'transfer';

export const DEFAULT_CATEGORY_TEMPLATES: Array<Pick<CategoryDefinition, 'value' | 'label'>> = [
	{ value: 'personal', label: 'Personal' },
	{ value: 'cash_withdrawal', label: 'Cash Withdrawal' },
	{ value: 'other', label: 'Other' },
	{ value: 'debit_order', label: 'Debit Order' },
	{ value: 'travel', label: 'Travel' },
	{ value: 'food', label: 'Food' },
	{ value: 'entertainment', label: 'Entertainment' },
];
