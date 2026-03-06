import { Account, AccountType, NetWorthData } from '../types';

export type { Account };

export const normalizeAccount = (doc: any): Account => {
	const account: Account = {
		id: doc.id,
		userId: doc.userId,
		name: doc.name,
		bank: doc.bank,
		type: doc.type as AccountType,
		currency: doc.currency ?? 'ZAR',
		balance: doc.balance ?? 0,
		color: doc.color,
		icon: doc.icon,
	};

	if (doc.createdAt) {
		if (typeof doc.createdAt === 'object' && 'toDate' in doc.createdAt) {
			account.createdAt = doc.createdAt.toDate();
		} else if (doc.createdAt instanceof Date) {
			account.createdAt = doc.createdAt;
		} else {
			account.createdAt = new Date(doc.createdAt);
		}
	}

	return account;
};

export const normalizeAccounts = (docs: any[]): Account[] => docs.map(normalizeAccount);

export const calculateNetWorth = (accounts: Account[]): NetWorthData => {
	const assets = accounts
		.filter((a) => a.type !== 'credit')
		.reduce((sum, a) => sum + a.balance, 0);

	const liabilities = accounts
		.filter((a) => a.type === 'credit')
		.reduce((sum, a) => sum + Math.abs(a.balance), 0);

	return {
		assets,
		liabilities,
		netWorth: assets - liabilities,
	};
};

export const ACCOUNT_COLORS = [
	'#6366f1',
	'#8b5cf6',
	'#ec4899',
	'#ef4444',
	'#f97316',
	'#eab308',
	'#22c55e',
	'#14b8a6',
	'#0ea5e9',
	'#3b82f6',
];

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
	debit: 'Debit',
	credit: 'Credit',
	savings: 'Savings',
	cash: 'Cash',
};
