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
} from 'firebase/firestore';
import { normalizeRecurringExpenses, RecurringExpense } from '../models/RecurringExpenseModel';

export const useRecurringExpenses = () => {
	const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
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
			setRecurringExpenses([]);
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
				const normalized = normalizeRecurringExpenses(fetched);
				setRecurringExpenses(normalized);
				setLoading(false);
			},
			(error) => {
				console.error('Error fetching recurring transactions:', error);
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, [user]);

	const addRecurringExpense = async (expense: Omit<RecurringExpense, 'id' | 'createdAt' | 'userId'>) => {
		if (!user) throw new Error('User not authenticated');

		const col = collection(db, 'users', user.uid, 'recurringTransactions');
		await addDoc(col, {
			...expense,
			createdAt: Timestamp.now(),
			userId: user.uid,
		});
	};

	const deleteRecurringExpense = async (id: string) => {
		if (!user) throw new Error('User not authenticated');
		try {
			await deleteDoc(doc(db, 'users', user.uid, 'recurringTransactions', id));
		} catch (error) {
			console.error('Error deleting recurring transaction:', error);
			throw error;
		}
	};

	const updateRecurringExpense = async (id: string, updates: Partial<RecurringExpense>) => {
		if (!user) throw new Error('User not authenticated');
		try {
			const ref = doc(db, 'users', user.uid, 'recurringTransactions', id);
			await updateDoc(ref, updates as any);
		} catch (error) {
			console.error('Error updating recurring transaction:', error);
			throw error;
		}
	};

	return {
		recurringExpenses,
		addRecurringExpense,
		deleteRecurringExpense,
		updateRecurringExpense,
		loading,
	};
};
