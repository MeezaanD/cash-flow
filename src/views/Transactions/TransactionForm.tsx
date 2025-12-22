import React, { useState, useEffect } from 'react';
import {
	FiDollarSign,
	FiTag,
	FiType,
	FiInfo,
	FiSave,
	FiX,
	FiCalendar,
	FiRefreshCw,
} from 'react-icons/fi';
import { useTransactionsContext } from '../../context/TransactionsContext';
import { Transaction } from '../../models/TransactionModel';
import { RecurringExpense } from '../../models/RecurringExpenseModel';
import { Category } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../components/ui/select';
import { Loader2 } from 'lucide-react';
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
	const [isSubmitting, setIsSubmitting] = useState(false);
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
		setIsSubmitting(true);
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
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-2xl rounded-2xl border bg-card p-8 shadow-xl backdrop-blur-sm">
				{/* Header */}
				<div className="mb-8 flex items-center justify-between border-b pb-6">
					<div>
						<h2 className="text-3xl font-bold tracking-tight">
							{transaction ? 'Edit Transaction' : 'New Transaction'}
						</h2>
						<p className="mt-1.5 text-sm text-muted-foreground">
							{transaction
								? 'Update your transaction details'
								: 'Add a new income or expense to your records'}
						</p>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="h-9 w-9 rounded-lg"
					>
						<FiX className="h-5 w-5" />
					</Button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Quick Fill from Recurring Expense */}
					{!transaction && recurringExpenses.length > 0 && (
						<div className="rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 p-4">
							<div className="mb-2 flex items-center gap-2">
								<FiRefreshCw className="h-4 w-4 text-primary" />
								<Label className="text-sm font-semibold text-primary">
									Quick Fill
								</Label>
							</div>
							<Select
								value={selectedRecurringId || '__none__'}
								onValueChange={(value) => {
									setSelectedRecurringId(value === '__none__' ? null : value);
								}}
							>
								<SelectTrigger className="h-10 rounded-lg border-2 bg-background">
									<SelectValue placeholder="Select recurring expense" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__none__">None - Start Fresh</SelectItem>
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

					{/* Type Selection - Prominent */}
					<div className="space-y-3">
						<Label className="text-base font-medium">Transaction Type</Label>
						<div className="grid grid-cols-2 gap-3">
							<Button
								type="button"
								variant={type === 'income' ? 'default' : 'outline'}
								className={`h-14 flex-col gap-2 rounded-xl transition-all ${
									type === 'income'
										? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
										: 'hover:bg-muted/50'
								}`}
								onClick={() => setType('income')}
							>
								<span className="text-lg font-semibold">Income</span>
								<span className="text-xs opacity-90">Money coming in</span>
							</Button>
							<Button
								type="button"
								variant={type === 'expense' ? 'default' : 'outline'}
								className={`h-14 flex-col gap-2 rounded-xl transition-all ${
									type === 'expense'
										? 'bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-lg shadow-red-500/25'
										: 'hover:bg-muted/50'
								}`}
								onClick={() => setType('expense')}
							>
								<span className="text-lg font-semibold">Expense</span>
								<span className="text-xs opacity-90">Money going out</span>
							</Button>
						</div>
					</div>

					{/* Title and Amount - Side by side on larger screens */}
					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-2">
							<Label
								htmlFor="title"
								className="flex items-center gap-2 text-sm font-medium"
							>
								<FiType className="h-4 w-4 text-muted-foreground" />
								Title
							</Label>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="e.g. Salary, Groceries"
								required
								className="h-11 rounded-lg border-2 transition-all focus:border-primary"
							/>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="amount"
								className="flex items-center gap-2 text-sm font-medium"
							>
								<FiDollarSign className="h-4 w-4 text-muted-foreground" />
								Amount
							</Label>
							<Input
								id="amount"
								type="number"
								value={amount}
								onChange={(e) => setAmount(Number(e.target.value))}
								placeholder="0.00"
								required
								step="0.01"
								min="0"
								className="h-11 rounded-lg border-2 transition-all focus:border-primary"
							/>
						</div>
					</div>

					{/* Category and Date */}
					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-2">
							<Label
								htmlFor="category"
								className="flex items-center gap-2 text-sm font-medium"
							>
								<FiTag className="h-4 w-4 text-muted-foreground" />
								Category
							</Label>
							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger
									id="category"
									className="h-11 rounded-lg border-2 transition-all focus:border-primary"
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
								htmlFor="date"
								className="flex items-center gap-2 text-sm font-medium"
							>
								<FiCalendar className="h-4 w-4 text-muted-foreground" />
								Date
							</Label>
							<Input
								id="date"
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								required
								className="h-11 rounded-lg border-2 transition-all focus:border-primary"
							/>
						</div>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label
							htmlFor="description"
							className="flex items-center gap-2 text-sm font-medium"
						>
							<FiInfo className="h-4 w-4 text-muted-foreground" />
							Description{' '}
							<span className="text-xs text-muted-foreground">(Optional)</span>
						</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Add any additional details or notes..."
							rows={4}
							className="rounded-lg border-2 transition-all focus:border-primary resize-none"
						/>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-4">
						<Button
							type="submit"
							className="flex-1 h-12 rounded-lg bg-gradient-to-r from-primary to-primary/90 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-5 w-5 animate-spin" />
									Processing...
								</>
							) : (
								<>
									<FiSave className="mr-2 h-5 w-5" />
									{transaction ? 'Update Transaction' : 'Add Transaction'}
								</>
							)}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isSubmitting}
							className="h-12 rounded-lg px-6"
						>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default TransactionForm;
