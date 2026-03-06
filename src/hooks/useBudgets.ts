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
import { Budget } from '../types';
import { normalizeBudget } from '../models/BudgetModel';

export const useBudgets = () => {
	const [budgets, setBudgets] = useState<Budget[]>([]);
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
			setBudgets([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		const col = collection(db, 'users', user.uid, 'budgets');
		const q = query(col);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const fetched = snapshot.docs.map((d) =>
				normalizeBudget({ id: d.id, ...d.data() })
			);
			setBudgets(fetched);
			setLoading(false);
		}, (error) => {
			console.error('Error fetching budgets:', error);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [user]);

	const addBudget = async (budget: Omit<Budget, 'id' | 'createdAt' | 'userId'>) => {
		if (!user) throw new Error('User not authenticated');

		const col = collection(db, 'users', user.uid, 'budgets');
		await addDoc(col, {
			...budget,
			userId: user.uid,
			createdAt: Timestamp.now(),
		});
	};

	const updateBudget = async (id: string, updates: Partial<Budget>) => {
		if (!user) throw new Error('User not authenticated');
		const ref = doc(db, 'users', user.uid, 'budgets', id);
		await updateDoc(ref, updates as any);
	};

	const deleteBudget = async (id: string) => {
		if (!user) throw new Error('User not authenticated');
		const ref = doc(db, 'users', user.uid, 'budgets', id);
		await deleteDoc(ref);
	};

	return {
		budgets,
		addBudget,
		updateBudget,
		deleteBudget,
		loading,
	};
};
