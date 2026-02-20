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

		const q = query(collection(db, 'recurringExpenses'), where('userId', '==', user.uid));

		const unsubscribe = onSnapshot(
			q,
			(querySnapshot) => {
				const fetchedExpenses = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				const normalized = normalizeRecurringExpenses(fetchedExpenses);
				setRecurringExpenses(normalized);
				setLoading(false);
			},
			(error) => {
				console.error('Error fetching recurring expenses:', error);
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, [user]);

	const addRecurringExpense = async (expense: {
		title: string;
		amount: number;
		category: string;
		description?: string;
		frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
	}) => {
		if (!user) throw new Error('User not authenticated');

		const expenseData: any = {
			...expense,
			createdAt: Timestamp.now(),
			userId: user.uid,
		};

		await addDoc(collection(db, 'recurringExpenses'), expenseData);
	};

	const deleteRecurringExpense = async (id: string) => {
		try {
			await deleteDoc(doc(db, 'recurringExpenses', id));
		} catch (error) {
			console.error('Error deleting recurring expense:', error);
			throw error;
		}
	};

	const updateRecurringExpense = async (id: string, updates: Partial<RecurringExpense>) => {
		try {
			const expenseRef = doc(db, 'recurringExpenses', id);
			await updateDoc(expenseRef, updates);
		} catch (error) {
			console.error('Error updating recurring expense:', error);
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

