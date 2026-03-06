import { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import {
	collection,
	updateDoc,
	doc,
	query,
	onSnapshot,
	Timestamp,
	writeBatch,
	getDocs,
	increment,
} from 'firebase/firestore';
import { Transaction } from '../types';
import { normalizeTransaction } from '../models/TransactionModel';

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

export const useTransactions = () => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(() => auth.currentUser);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
			setUser(firebaseUser);
		});
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (!user) {
			setTransactions([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		const txCol = collection(db, 'users', user.uid, 'transactions');
		const q = query(txCol);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const fetched = snapshot.docs.map((d) =>
				normalizeTransaction({ id: d.id, ...d.data() })
			);
			setTransactions(fetched);
			setLoading(false);
		}, (error) => {
			console.error('Error fetching transactions:', error);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [user]);

	const addTransaction = async (data: AddTransactionData) => {
		if (!user) throw new Error('User not authenticated');

		const batch = writeBatch(db);

		const txCol = collection(db, 'users', user.uid, 'transactions');
		const txRef = doc(txCol);

		const txData: any = {
			...data,
			createdAt: Timestamp.now(),
			userId: user.uid,
		};

		if (data.date) {
			txData.date = Timestamp.fromDate(data.date);
		}

		batch.set(txRef, txData);

		// Update account balance
		const accountRef = doc(db, 'users', user.uid, 'accounts', data.accountId);
		const balanceDelta = data.type === 'income' ? data.amount : -data.amount;
		batch.update(accountRef, { balance: increment(balanceDelta) });

		await batch.commit();
	};

	const addTransfer = async (data: AddTransferData) => {
		if (!user) throw new Error('User not authenticated');

		const batch = writeBatch(db);
		const txCol = collection(db, 'users', user.uid, 'transactions');
		const now = Timestamp.now();
		const txDate = data.date ? Timestamp.fromDate(data.date) : now;

		// Expense on source account
		const expenseRef = doc(txCol);
		batch.set(expenseRef, {
			userId: user.uid,
			accountId: data.fromAccountId,
			transferAccountId: data.toAccountId,
			title: data.title,
			amount: data.amount,
			type: 'transfer',
			category: 'transfer',
			description: data.description ?? '',
			date: txDate,
			createdAt: now,
		});

		// Income on destination account
		const incomeRef = doc(txCol);
		batch.set(incomeRef, {
			userId: user.uid,
			accountId: data.toAccountId,
			transferAccountId: data.fromAccountId,
			title: data.title,
			amount: data.amount,
			type: 'transfer',
			category: 'transfer',
			description: data.description ?? '',
			date: txDate,
			createdAt: now,
		});

		// Debit source account balance
		const fromRef = doc(db, 'users', user.uid, 'accounts', data.fromAccountId);
		batch.update(fromRef, { balance: increment(-data.amount) });

		// Credit destination account balance
		const toRef = doc(db, 'users', user.uid, 'accounts', data.toAccountId);
		batch.update(toRef, { balance: increment(data.amount) });

		await batch.commit();
	};

	const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
		if (!user) throw new Error('User not authenticated');
		try {
			const txRef = doc(db, 'users', user.uid, 'transactions', id);
			const updateData: any = { ...updates };

			if (updates.date instanceof Date) {
				updateData.date = Timestamp.fromDate(updates.date);
			}

			await updateDoc(txRef, updateData);
		} catch (error) {
			console.error('Error updating transaction:', error);
			throw error;
		}
	};

	const deleteTransaction = async (id: string) => {
		if (!user) throw new Error('User not authenticated');
		try {
			// Find the transaction to reverse balance
			const tx = transactions.find((t) => t.id === id);
			const batch = writeBatch(db);

			const txRef = doc(db, 'users', user.uid, 'transactions', id);
			batch.delete(txRef);

			if (tx && tx.accountId) {
				const accountRef = doc(db, 'users', user.uid, 'accounts', tx.accountId);
				// Reverse the balance effect
				if (tx.type === 'income') {
					batch.update(accountRef, { balance: increment(-tx.amount) });
				} else if (tx.type === 'expense') {
					batch.update(accountRef, { balance: increment(tx.amount) });
				} else if (tx.type === 'transfer') {
					// For transfer records, reverse the debit on source or credit on dest
					batch.update(accountRef, { balance: increment(tx.amount) });
				}
			}

			await batch.commit();
		} catch (error) {
			console.error('Error deleting transaction:', error);
			throw error;
		}
	};

	const deleteAllTransactions = async () => {
		if (!user) throw new Error('User not authenticated');

		try {
			const txCol = collection(db, 'users', user.uid, 'transactions');
			const snapshot = await getDocs(query(txCol));

			const batch = writeBatch(db);
			snapshot.docs.forEach((d) => batch.delete(d.ref));
			await batch.commit();
		} catch (error) {
			console.error('Error deleting all transactions:', error);
			throw error;
		}
	};

	return {
		transactions,
		addTransaction,
		addTransfer,
		updateTransaction,
		deleteTransaction,
		deleteAllTransactions,
		loading,
	};
};
