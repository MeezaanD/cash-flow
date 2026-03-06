import React, { useState, useEffect } from 'react';
import { useBudgetsContext } from '../../context/BudgetsContext';
import { Budget } from '../../types';
import { Button } from '../../components/app/ui/button';
import { Input } from '../../components/app/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../components/app/ui/select';

interface BudgetFormProps {
	onClose: () => void;
	budget?: Budget;
}

const CATEGORIES = [
	{ value: 'personal', label: 'Personal' },
	{ value: 'food', label: 'Food' },
	{ value: 'travel', label: 'Travel' },
	{ value: 'entertainment', label: 'Entertainment' },
	{ value: 'debit_order', label: 'Debit Order' },
	{ value: 'housing', label: 'Housing' },
	{ value: 'transport', label: 'Transport' },
	{ value: 'health', label: 'Health' },
	{ value: 'education', label: 'Education' },
	{ value: 'other', label: 'Other' },
];

const BudgetForm: React.FC<BudgetFormProps> = ({ onClose, budget }) => {
	const { addBudget, updateBudget } = useBudgetsContext();

	const [category, setCategory] = useState('');
	const [amount, setAmount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (budget) {
			setCategory(budget.category);
			setAmount(budget.amount);
		}
	}, [budget]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!category) {
			setError('Please select a category.');
			return;
		}
		if (Number(amount) <= 0) {
			setError('Budget amount must be greater than zero.');
			return;
		}
		setError('');
		setLoading(true);
		try {
			const data = {
				category,
				amount: Number(amount),
				period: 'monthly' as const,
			};
			if (budget?.id) {
				await updateBudget(budget.id, data);
			} else {
				await addBudget(data);
			}
			onClose();
		} catch (err: any) {
			setError(err?.message || 'Failed to save budget. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl">
				<div className="mb-8 border-b pb-6">
					<h2 className="text-3xl font-bold tracking-tight">
						{budget ? 'Edit Budget' : 'New Budget'}
					</h2>
					<p className="mt-1.5 text-sm text-muted-foreground">
						{budget
							? 'Update your monthly spending limit'
							: 'Set a monthly spending limit for a category'}
					</p>
				</div>

				{error && (
					<div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="space-y-1.5">
						<label className="text-sm font-medium">Category</label>
						<Select value={category} onValueChange={setCategory}>
							<SelectTrigger className="h-11">
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								{CATEGORIES.map((c) => (
									<SelectItem key={c.value} value={c.value}>
										{c.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-1.5">
						<label className="text-sm font-medium">Monthly Limit (ZAR)</label>
						<Input
							type="number"
							step="0.01"
							min="0.01"
							value={amount}
							onChange={(e) => setAmount(Number(e.target.value))}
							placeholder="e.g. 2000"
							required
						/>
					</div>

					<div className="rounded-xl border bg-muted/30 p-3 text-sm text-muted-foreground">
						Budgets reset at the start of each calendar month.
					</div>

					<div className="flex gap-3 pt-2">
						<Button type="submit" className="flex-1 h-12" disabled={loading}>
							{loading
								? 'Saving...'
								: budget
									? 'Update Budget'
									: 'Create Budget'}
						</Button>
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default BudgetForm;
