import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTag, FiType, FiInfo, FiSave, FiX, FiCalendar } from 'react-icons/fi';
import { useTransactionsContext } from '../../context/TransactionsContext';
import { Transaction } from '../../models/TransactionModel';
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

interface TransactionFormProps {
	onClose: () => void;
	transaction?: Transaction;
}

const CATEGORIES: Category[] = [
	{ value: 'personal', label: 'Personal' },
	{ value: 'food', label: 'Food' },
	{ value: 'travel', label: 'Travel' },
	{ value: 'entertainment', label: 'Entertainment' },
	{ value: 'debit_order', label: 'Debit Order' },
	{ value: 'other', label: 'Other' },
];

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, transaction }) => {
	const { addTransaction, updateTransaction } = useTransactionsContext();
	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState(0);
	const [type, setType] = useState<Transaction['type']>('expense');
	const [category, setCategory] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (transaction) {
			setTitle(transaction.title);
			setAmount(transaction.amount);
			setType(transaction.type);
			setCategory(transaction.category ?? '');
			setDescription(transaction.description ?? '');

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
		} else {
			setTitle('');
			setAmount(0);
			setType('expense');
			setCategory('');
			setDescription('');
			setDate(new Date().toISOString().split('T')[0]);
		}
	}, [transaction]);

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
			<div className="w-full max-w-2xl rounded-lg border bg-card p-6 shadow-lg">
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-2xl font-semibold">
						{transaction ? 'Edit Transaction' : 'Add New Transaction'}
					</h2>
					<Button type="button" variant="ghost" size="icon" onClick={onClose}>
						<FiX className="h-5 w-5" />
					</Button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="title" className="flex items-center gap-2">
							<FiType className="h-4 w-4" />
							Title
						</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. Salary, Groceries"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="amount" className="flex items-center gap-2">
							<FiDollarSign className="h-4 w-4" />
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
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="category" className="flex items-center gap-2">
							<FiTag className="h-4 w-4" />
							Category
						</Label>
						<Select value={category} onValueChange={setCategory}>
							<SelectTrigger id="category">
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
						<Label htmlFor="description" className="flex items-center gap-2">
							<FiInfo className="h-4 w-4" />
							Description (Optional)
						</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Add any additional details"
							rows={3}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="date" className="flex items-center gap-2">
							<FiCalendar className="h-4 w-4" />
							Date
						</Label>
						<Input
							id="date"
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label>Type</Label>
						<div className="flex gap-2">
							<Button
								type="button"
								variant={type === 'income' ? 'default' : 'outline'}
								className="flex-1"
								onClick={() => setType('income')}
							>
								Income
							</Button>
							<Button
								type="button"
								variant={type === 'expense' ? 'default' : 'outline'}
								className="flex-1"
								onClick={() => setType('expense')}
							>
								Expense
							</Button>
						</div>
					</div>

					<div className="flex gap-3">
						<Button type="submit" className="flex-1" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processing...
								</>
							) : (
								<>
									<FiSave className="mr-2 h-4 w-4" />
									{transaction ? 'Update Transaction' : 'Add Transaction'}
								</>
							)}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isSubmitting}
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
