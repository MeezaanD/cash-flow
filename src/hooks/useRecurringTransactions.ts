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
	deleteField,
	type UpdateData,
} from 'firebase/firestore';
import {
	normalizeRecurringTransactions,
	RecurringTransaction,
} from '../models/RecurringTransactionModel';

const sanitizeRecurringPayload = (
	payload: Partial<RecurringTransaction>,
	allowExpectedDateDelete: boolean,
) => {
	const sanitized: Record<string, unknown> = Object.fromEntries(
		Object.entries(payload).filter(([, value]) => value !== undefined)
	);

	if (payload.expectedDate !== undefined) {
		if (
			Number.isInteger(payload.expectedDate) &&
			payload.expectedDate >= 1 &&
			payload.expectedDate <= 31
		) {
			sanitized.expectedDate = payload.expectedDate;
		} else {
			delete sanitized.expectedDate;
		}
	}

	if (
		allowExpectedDateDelete &&
		Object.prototype.hasOwnProperty.call(payload, 'expectedDate') &&
		payload.expectedDate === undefined
	) {
		sanitized.expectedDate = deleteField();
	}

	return sanitized;
};

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
		const sanitizedTransaction = sanitizeRecurringPayload(transaction, false);
		await addDoc(col, {
			...sanitizedTransaction,
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
			const sanitizedUpdates = sanitizeRecurringPayload(updates, true);
			await updateDoc(ref, sanitizedUpdates as UpdateData<RecurringTransaction>);
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
