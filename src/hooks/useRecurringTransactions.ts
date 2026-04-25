import { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import {
	collection,
	addDoc,
	deleteDoc,
	updateDoc,
	doc,
	query,
	onSnapshot,
	Timestamp,
	type UpdateData,
} from 'firebase/firestore';
import {
	normalizeRecurringTransactions,
	RecurringTransaction,
} from '../models/RecurringTransactionModel';

export const useRecurringTransactions = () => {
	const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
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
			setRecurringTransactions([]);
			setLoading(false);
			return;
		}

		setLoading(true);

		const col = collection(db, 'users', user.uid, 'recurringTransactions');
		const q = query(col);

		const unsubscribe = onSnapshot(
			q,
			(querySnapshot) => {
				const fetched = querySnapshot.docs.map((d) => ({
					id: d.id,
					...d.data(),
				}));
				const normalized = normalizeRecurringTransactions(fetched);
				setRecurringTransactions(normalized);
				setLoading(false);
			},
			(error) => {
				console.error('Error fetching recurring transactions:', error);
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, [user]);

	const addRecurringTransaction = async (
		transaction: Omit<RecurringTransaction, 'id' | 'createdAt' | 'userId'>
	) => {
		if (!user) throw new Error('User not authenticated');

		const col = collection(db, 'users', user.uid, 'recurringTransactions');
		await addDoc(col, {
			...transaction,
			createdAt: Timestamp.now(),
			userId: user.uid,
		});
	};

	const deleteRecurringTransaction = async (id: string) => {
		if (!user) throw new Error('User not authenticated');
		try {
			await deleteDoc(doc(db, 'users', user.uid, 'recurringTransactions', id));
		} catch (error) {
			console.error('Error deleting recurring transaction:', error);
			throw error;
		}
	};

	const updateRecurringTransaction = async (
		id: string,
		updates: Partial<RecurringTransaction>
	) => {
		if (!user) throw new Error('User not authenticated');
		try {
			const ref = doc(db, 'users', user.uid, 'recurringTransactions', id);
			await updateDoc(ref, updates as UpdateData<RecurringTransaction>);
		} catch (error) {
			console.error('Error updating recurring transaction:', error);
			throw error;
		}
	};

	return {
		recurringTransactions,
		addRecurringTransaction,
		deleteRecurringTransaction,
		updateRecurringTransaction,
		loading,
	};
};
