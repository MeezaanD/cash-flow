import React, { useState, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { useTransactionsContext } from '../../context/TransactionsContext';
import { Transaction } from '../../models/TransactionModel';
import { RecurringExpense } from '../../models/RecurringExpenseModel';
import { Category } from '../../types';
import { Button } from '../../components/app/ui/button';
import { Input } from '../../components/app/ui/input';
import { Textarea } from '../../components/app/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../components/app/ui/select';
import { formatCurrency } from '../../utils/formatCurrency';
import { useTheme } from '../../context/ThemeContext';

interface TransactionFormProps {
	onClose: () => void;
	transaction?: Transaction;
	recurringExpense?: RecurringExpense;
}

const CATEGORIES: Category[] = [
	{ value: 'personal', label: 'Personal' },
	{ value: 'food', label: 'Food' },
	{ value: 'travel', label: 'Travel' },
	{ value: 'entertainment', label: 'Entertainment' },
	{ value: 'debit_order', label: 'Debit Order' },
	{ value: 'other', label: 'Other' },
];

const TransactionForm: React.FC<TransactionFormProps> = ({
	onClose,
	transaction,
	recurringExpense: initialRecurringExpense,
}) => {
	const { addTransaction, updateTransaction, recurringExpenses } = useTransactionsContext();
	const { currency } = useTheme();
	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState(0);
	const [type, setType] = useState<Transaction['type']>('expense');
	const [category, setCategory] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState<string>('');
	const [selectedRecurringId, setSelectedRecurringId] = useState<string | null>(
		initialRecurringExpense?.id || null
	);

	useEffect(() => {
		if (transaction) {
			setTitle(transaction.title);
			setAmount(transaction.amount);
			setType(transaction.type);
			setCategory(transaction.category ?? '');
			setDescription(transaction.description ?? '');
			setSelectedRecurringId(null);

			let transactionDate: Date | null = null;
			if (transaction.date) {
				if (typeof transaction.date === 'object' && 'toDate' in transaction.date) {
					transactionDate = transaction.date.toDate();
				} else if (transaction.date instanceof Date) {
					transactionDate = transaction.date;
				}
			}

			if (transactionDate) {
				setDate(transactionDate.toISOString().split('T')[0]);
			} else {
				setDate('');
			}
		} else if (initialRecurringExpense) {
			// Pre-fill from recurring expense
			setTitle(initialRecurringExpense.title);
			setAmount(initialRecurringExpense.amount);
			setType('expense'); // Recurring expenses are always expenses
			setCategory(initialRecurringExpense.category ?? '');
			setDescription(initialRecurringExpense.description ?? '');
			setDate(new Date().toISOString().split('T')[0]);
			setSelectedRecurringId(initialRecurringExpense.id || null);
		} else {
			setTitle('');
			setAmount(0);
			setType('expense');
			setCategory('');
			setDescription('');
			setDate(new Date().toISOString().split('T')[0]);
			setSelectedRecurringId(null);
		}
	}, [transaction, initialRecurringExpense]);

	// Handle recurring expense selection
	useEffect(() => {
		if (selectedRecurringId && !transaction) {
			const selectedExpense = recurringExpenses.find((e) => e.id === selectedRecurringId);
			if (selectedExpense) {
				setTitle(selectedExpense.title);
				setAmount(selectedExpense.amount);
				setType('expense');
				setCategory(selectedExpense.category ?? '');
				setDescription(selectedExpense.description ?? '');
			}
		} else if (selectedRecurringId === null && !transaction && !initialRecurringExpense) {
			// Clear form when "None" is selected
			setTitle('');
			setAmount(0);
			setCategory('');
			setDescription('');
		}
	}, [selectedRecurringId, recurringExpenses, transaction, initialRecurringExpense]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const data: any = {
				title,
				amount: Number(amount),
				type,
				category,
				description,
			};

			if (date) {
				data.date = new Date(date);
			} else {
				data.date = new Date();
			}

			if (transaction && transaction.id) {
				await updateTransaction(transaction.id, data);
			} else {
				await addTransaction(data);
			}
			onClose();
		} catch (error) {
			console.error('Failed to submit transaction:', error);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-2xl rounded-2xl border bg-card p-8 shadow-xl backdrop-blur-sm">
				{/* Header */}
				<div className="mb-8 border-b pb-6">
					<h2 className="text-3xl font-bold tracking-tight">
						{transaction ? 'Edit Transaction' : 'New Transaction'}
					</h2>
					<p className="mt-1.5 text-sm text-muted-foreground">
						{transaction
							? 'Update your transaction details'
							: 'Add a new income or expense to your records'}
					</p>
				</div>

				{/* Recurring Expense – Smart Autofill */}
				{!transaction && recurringExpenses.length > 0 && (
					<div className="mb-8 rounded-xl border border-dashed bg-muted/40 p-4">
						<div className="mb-3 flex items-center gap-2 text-sm font-medium">
							<FiRefreshCw className="h-4 w-4 text-primary" />
							Quick fill from a recurring expense
						</div>

						<Select
							value={selectedRecurringId || '__none__'}
							onValueChange={(value) =>
								setSelectedRecurringId(value === '__none__' ? null : value)
							}
						>
							<SelectTrigger className="h-11 rounded-lg">
								<SelectValue placeholder="Choose an expense to autofill" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="__none__">Start fresh</SelectItem>
								{recurringExpenses.map((expense) => (
									<SelectItem key={expense.id} value={expense.id!}>
										<span className="font-medium">{expense.title}</span>
										<span className="text-muted-foreground">
											{' '}
											• {formatCurrency(expense.amount, currency)}
										</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Transaction Type */}
					<div className="grid grid-cols-2 gap-3">
						<Button
							type="button"
							variant={type === 'income' ? 'default' : 'outline'}
							onClick={() => setType('income')}
							className="h-14 rounded-xl"
						>
							Income
						</Button>
						<Button
							type="button"
							variant={type === 'expense' ? 'default' : 'outline'}
							onClick={() => setType('expense')}
							className="h-14 rounded-xl"
						>
							Expense
						</Button>
					</div>

					{/* Title + Amount */}
					<div className="grid gap-6 md:grid-cols-2">
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Title"
							required
						/>
						<Input
							type="number"
							value={amount}
							onChange={(e) => setAmount(Number(e.target.value))}
							placeholder="Amount"
							required
						/>
					</div>

					{/* Category + Date */}
					<div className="grid gap-6 md:grid-cols-2">
						<Select value={category} onValueChange={setCategory}>
							<SelectTrigger>
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								{CATEGORIES.map((cat) => (
									<SelectItem key={cat.value} value={cat.value}>
										{cat.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							required
						/>
					</div>

					{/* Description */}
					<Textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Optional notes"
						rows={3}
					/>

					{/* Actions */}
					<div className="flex gap-3 pt-4">
						<Button type="submit" className="flex-1 h-12">
							{transaction ? 'Update Transaction' : 'Add Transaction'}
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

export default TransactionForm;
