import { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import {
	collection,
	addDoc,
	deleteDoc,
	updateDoc,
	doc,
	query,
	where,
	getDocs,
	Timestamp,
} from 'firebase/firestore';

export const useTransactions = () => {
	const [transactions, setTransactions] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(() => auth.currentUser);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
			setUser(firebaseUser);
		});

		return () => unsubscribe();
	}, []);

	const fetchTransactions = async () => {
		if (!user) {
			setTransactions([]);
			setLoading(false);
			return;
		}

		setLoading(true);

		const q = query(collection(db, 'transactions'), where('userId', '==', user.uid));

		const querySnapshot = await getDocs(q);
		const fetchedTransactions = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		setTransactions(fetchedTransactions);
		setLoading(false);
	};

	useEffect(() => {
		fetchTransactions();
	}, [user]);

	const addTransaction = async (transaction: {
		type: 'income' | 'expense';
		title: string;
		category: string;
		description?: string;
		amount: number;
		date?: Date;
	}) => {
		if (!user) throw new Error('User not authenticated');

		const transactionData: any = {
			...transaction,
			createdAt: Timestamp.now(),
			userId: user.uid,
		};

		if (transaction.date) {
			transactionData.date = Timestamp.fromDate(transaction.date);
		}

		await addDoc(collection(db, 'transactions'), transactionData);
		await fetchTransactions();
	};

	const updateTransaction = async (id: string, updates: any) => {
		try {
			const transactionRef = doc(db, 'transactions', id);
			const updateData: any = { ...updates };

			if (updates.date instanceof Date) {
				updateData.date = Timestamp.fromDate(updates.date);
			}

			await updateDoc(transactionRef, updateData);
			await fetchTransactions();
		} catch (error) {
			console.error('Error updating transaction:', error);
		}
	};

	const deleteTransaction = async (id: string) => {
		try {
			await deleteDoc(doc(db, 'transactions', id));
			await fetchTransactions();
		} catch (error) {
			console.error('Error deleting transaction:', error);
		}
	};

	const deleteAllTransactions = async () => {
		if (!user) throw new Error('User not authenticated');

		try {
			const q = query(
				collection(db, 'transactions'),
				where('userId', '==', user.uid)
			);

			const querySnapshot = await getDocs(q);

			// Delete all documents in parallel
			const deletePromises = querySnapshot.docs.map((document) =>
				deleteDoc(doc(db, 'transactions', document.id))
			);

			await Promise.all(deletePromises);
			await fetchTransactions();
		} catch (error) {
			console.error('Error deleting all transactions:', error);
			throw error;
		}
	};

	return {
		transactions,
		addTransaction,
		updateTransaction,
		deleteTransaction,
		deleteAllTransactions,
		loading,
	};
};