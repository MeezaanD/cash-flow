import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTag, FiInfo, FiSave, FiX, FiRefreshCw, FiArrowUpCircle, FiArrowDownCircle } from 'react-icons/fi';
import { useTransactionsContext } from '../../context/TransactionsContext';
import { RecurringExpense } from '../../models/RecurringExpenseModel';
import { Category } from '../../types';
import { Button } from '../../components/app/ui/button';
import { Input } from '../../components/app/ui/input';
import { Label } from '../../components/app/ui/label';
import { Textarea } from '../../components/app/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../components/app/ui/select';
import { Loader2 } from 'lucide-react';

interface RecurringExpenseFormProps {
	onClose: () => void;
	expense?: RecurringExpense;
}

const CATEGORIES: Category[] = [
	{ value: 'personal', label: 'Personal' },
	{ value: 'food', label: 'Food' },
	{ value: 'travel', label: 'Travel' },
	{ value: 'entertainment', label: 'Entertainment' },
	{ value: 'debit_order', label: 'Debit Order' },
	{ value: 'other', label: 'Other' },
];

const FREQUENCIES = [
	{ value: 'daily', label: 'Daily' },
	{ value: 'weekly', label: 'Weekly' },
	{ value: 'monthly', label: 'Monthly' },
	{ value: 'yearly', label: 'Yearly' },
];

const RecurringExpenseForm: React.FC<RecurringExpenseFormProps> = ({ onClose, expense }) => {
	const { addRecurringExpense, updateRecurringExpense } = useTransactionsContext();
	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState(0);
	const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
	const [category, setCategory] = useState('');
	const [description, setDescription] = useState('');
	const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>(
		'monthly'
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (expense) {
			setTitle(expense.title);
			setAmount(expense.amount);
			setTransactionType(expense.type ?? 'expense');
			setCategory(expense.category ?? '');
			setDescription(expense.description ?? '');
			setFrequency(expense.frequency ?? 'monthly');
		} else {
			setTitle('');
			setAmount(0);
			setTransactionType('expense');
			setCategory('');
			setDescription('');
			setFrequency('monthly');
		}
	}, [expense]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const data: any = {
				title,
				amount: Number(amount),
				type: transactionType,
				category,
				description,
				frequency,
			};

			if (expense && expense.id) {
				await updateRecurringExpense(expense.id, data);
			} else {
				await addRecurringExpense(data);
			}
			onClose();
		} catch (error) {
			console.error('Error saving recurring transaction:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between border-b pb-4">
				<div>
					<h3 className="text-xl font-bold tracking-tight">
						{expense ? 'Edit Recurring Transaction' : 'New Recurring Transaction'}
					</h3>
					<p className="mt-1 text-xs text-muted-foreground">
						{expense
							? 'Update your recurring transaction details'
							: 'Set up a transaction that repeats automatically'}
					</p>
				</div>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={onClose}
					className="h-8 w-8 rounded-lg"
				>
					<FiX className="h-4 w-4" />
				</Button>
			</div>

			<form onSubmit={handleSubmit} className="space-y-5">
				{/* Type selector */}
				<div className="space-y-2">
					<Label className="flex items-center gap-2 text-sm font-medium">
						Transaction Type
					</Label>
					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => setTransactionType('expense')}
							className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
								transactionType === 'expense'
									? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
									: 'border-border bg-background text-muted-foreground hover:border-muted-foreground'
							}`}
						>
							<FiArrowDownCircle className="h-4 w-4" />
							Expense
						</button>
						<button
							type="button"
							onClick={() => setTransactionType('income')}
							className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
								transactionType === 'income'
									? 'border-green-500 bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400'
									: 'border-border bg-background text-muted-foreground hover:border-muted-foreground'
							}`}
						>
							<FiArrowUpCircle className="h-4 w-4" />
							Income
						</button>
					</div>
				</div>

				{/* Title and Amount */}
				<div className="grid gap-5 md:grid-cols-2">
					<div className="space-y-2">
						<Label
							htmlFor="re-title"
							className="flex items-center gap-2 text-sm font-medium"
						>
							<FiTag className="h-4 w-4 text-muted-foreground" />
							Title
						</Label>
						<Input
							id="re-title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. Netflix Subscription"
							required
							className="h-10 rounded-lg border-2 transition-all focus:border-primary"
						/>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="re-amount"
							className="flex items-center gap-2 text-sm font-medium"
						>
							<FiDollarSign className="h-4 w-4 text-muted-foreground" />
							Amount
						</Label>
						<Input
							id="re-amount"
							type="number"
							value={amount}
							onChange={(e) => setAmount(Number(e.target.value))}
							placeholder="0.00"
							required
							step="0.01"
							min="0"
							className="h-10 rounded-lg border-2 transition-all focus:border-primary"
						/>
					</div>
				</div>

				{/* Category and Frequency */}
				<div className="grid gap-5 md:grid-cols-2">
					<div className="space-y-2">
						<Label
							htmlFor="re-category"
							className="flex items-center gap-2 text-sm font-medium"
						>
							<FiTag className="h-4 w-4 text-muted-foreground" />
							Category
						</Label>
						<Select value={category} onValueChange={setCategory}>
							<SelectTrigger
								id="re-category"
								className="h-10 rounded-lg border-2 transition-all focus:border-primary"
							>
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								{CATEGORIES.map((cat) => (
									<SelectItem key={cat.value} value={cat.value}>
										{cat.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="re-frequency"
							className="flex items-center gap-2 text-sm font-medium"
						>
							<FiRefreshCw className="h-4 w-4 text-muted-foreground" />
							Frequency
						</Label>
						<Select
							value={frequency}
							onValueChange={(value) => setFrequency(value as any)}
						>
							<SelectTrigger
								id="re-frequency"
								className="h-10 rounded-lg border-2 transition-all focus:border-primary"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{FREQUENCIES.map((freq) => (
									<SelectItem key={freq.value} value={freq.value}>
										{freq.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Description */}
				<div className="space-y-2">
					<Label
						htmlFor="re-description"
						className="flex items-center gap-2 text-sm font-medium"
					>
						<FiInfo className="h-4 w-4 text-muted-foreground" />
						Description{' '}
						<span className="text-xs text-muted-foreground">(Optional)</span>
					</Label>
					<Textarea
						id="re-description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Add any additional details or notes..."
						rows={3}
						className="rounded-lg border-2 transition-all focus:border-primary resize-none"
					/>
				</div>

				{/* Actions */}
				<div className="flex gap-3 pt-2">
					<Button
						type="submit"
						className="flex-1 h-11 rounded-lg bg-gradient-to-r from-primary to-primary/90 text-sm font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Processing...
							</>
						) : (
							<>
								<FiSave className="mr-2 h-4 w-4" />
								{expense ? 'Update Transaction' : 'Add Transaction'}
							</>
						)}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						disabled={isSubmitting}
						className="h-11 rounded-lg px-5"
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
};

export default RecurringExpenseForm;
