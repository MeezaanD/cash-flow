import React, { useState, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { useTransactionsContext } from '../../context/TransactionsContext';
import { useAccountsContext } from '../../context/AccountsContext';
import { Transaction } from '../../models/TransactionModel';
import { RecurringTransaction } from '../../models/RecurringTransactionModel';
import { Category, TransactionType } from '../../types';
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

interface TransactionFormProps {
	onClose: () => void;
	transaction?: Transaction;
	recurringTransaction?: RecurringTransaction;
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
	recurringTransaction: initialRecurringTransaction,
}) => {
	const { addTransaction, addTransfer, updateTransaction, recurringTransactions } = useTransactionsContext();
	const { accounts } = useAccountsContext();

	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState(0);
	const [type, setType] = useState<TransactionType>('expense');
	const [accountId, setAccountId] = useState('');
	const [transferAccountId, setTransferAccountId] = useState('');
	const [category, setCategory] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState<string>('');
	const [selectedRecurringId, setSelectedRecurringId] = useState<string | null>(
		initialRecurringTransaction?.id || null
	);

	// Default to first account
	useEffect(() => {
		if (!accountId && accounts.length > 0) {
			setAccountId(accounts[0].id!);
		}
	}, [accounts]);

	useEffect(() => {
		if (transaction) {
			setTitle(transaction.title);
			setAmount(transaction.amount);
			setType(transaction.type);
			setAccountId(transaction.accountId ?? '');
			setTransferAccountId(transaction.transferAccountId ?? '');
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

			setDate(transactionDate ? transactionDate.toISOString().split('T')[0] : '');
		} else if (initialRecurringTransaction) {
			setTitle(initialRecurringTransaction.title);
			setAmount(initialRecurringTransaction.amount);
			setType((initialRecurringTransaction.type as TransactionType) ?? 'expense');
			if (initialRecurringTransaction.accountId) setAccountId(initialRecurringTransaction.accountId);
			setCategory(initialRecurringTransaction.category ?? '');
			setDescription(initialRecurringTransaction.description ?? '');
			setDate(new Date().toISOString().split('T')[0]);
			setSelectedRecurringId(initialRecurringTransaction.id || null);
		} else {
			setTitle('');
			setAmount(0);
			setType('expense');
			setCategory('');
			setDescription('');
			setDate(new Date().toISOString().split('T')[0]);
			setSelectedRecurringId(null);
		}
	}, [transaction, initialRecurringTransaction]);

	useEffect(() => {
		if (selectedRecurringId && !transaction) {
			const selectedExpense = recurringTransactions.find((e) => e.id === selectedRecurringId);
			if (selectedExpense) {
				setTitle(selectedExpense.title);
				setAmount(selectedExpense.amount);
				setType((selectedExpense.type as TransactionType) ?? 'expense');
				if (selectedExpense.accountId) setAccountId(selectedExpense.accountId);
				setCategory(selectedExpense.category ?? '');
				setDescription(selectedExpense.description ?? '');
			}
		} else if (selectedRecurringId === null && !transaction && !initialRecurringTransaction) {
			setTitle('');
			setAmount(0);
			setCategory('');
			setDescription('');
		}
	}, [selectedRecurringId, recurringTransactions, transaction, initialRecurringTransaction]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (type === 'transfer' && !transferAccountId) return;
		try {
			if (transaction && transaction.id) {
				const data: any = {
					title,
					amount: Number(amount),
					type,
					accountId,
					category: type === 'transfer' ? 'transfer' : category,
					description,
					date: date ? new Date(date) : new Date(),
				};
				if (type === 'transfer' && transferAccountId) {
					data.transferAccountId = transferAccountId;
				}
				await updateTransaction(transaction.id, data);
			} else if (type === 'transfer') {
				await addTransfer({
					fromAccountId: accountId,
					toAccountId: transferAccountId,
					amount: Number(amount),
					title,
					description,
					date: date ? new Date(date) : new Date(),
				});
			} else {
				await addTransaction({
					title,
					amount: Number(amount),
					type,
					accountId,
					category,
					description,
					date: date ? new Date(date) : new Date(),
				});
			}
			onClose();
		} catch (error) {
			console.error('Failed to submit transaction:', error);
		}
	};

	const availableTransferAccounts = accounts.filter((a) => a.id !== accountId);

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
							: 'Add a new income, expense, or transfer'}
					</p>
				</div>

				{/* Recurring – Smart Autofill */}
				{!transaction && recurringTransactions.length > 0 && (
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
								{recurringTransactions.map((expense) => (
									<SelectItem key={expense.id} value={expense.id!}>
										<span className="font-medium">{expense.title}</span>
										<span className="text-muted-foreground"> • {formatCurrency(expense.amount)}</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Transaction Type — 3 buttons */}
					<div className="grid grid-cols-3 gap-3">
						{(['income', 'expense', 'transfer'] as TransactionType[]).map((t) => (
							<Button
								key={t}
								type="button"
								variant={type === t ? 'default' : 'outline'}
								onClick={() => setType(t)}
								className="h-14 rounded-xl capitalize"
							>
								{t}
							</Button>
						))}
					</div>

					{/* Account Selector */}
					{accounts.length > 0 && (
						<div className="space-y-1.5">
							<label className="text-sm font-medium">
								{type === 'transfer' ? 'From Account' : 'Account'} *
							</label>
							<Select value={accountId} onValueChange={setAccountId}>
								<SelectTrigger>
									<SelectValue placeholder="Select account" />
								</SelectTrigger>
								<SelectContent>
									{accounts.map((a) => (
										<SelectItem key={a.id} value={a.id!}>
											<span className="flex items-center gap-2">
												<span
													className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
													style={{ backgroundColor: a.color ?? '#6366f1' }}
												/>
												{a.name} ({formatCurrency(a.balance)})
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					{/* Transfer To Account */}
					{type === 'transfer' && (
						<div className="space-y-1.5">
							<label className="text-sm font-medium">To Account *</label>
							<Select value={transferAccountId} onValueChange={setTransferAccountId}>
								<SelectTrigger>
									<SelectValue placeholder="Select destination account" />
								</SelectTrigger>
								<SelectContent>
									{availableTransferAccounts.map((a) => (
										<SelectItem key={a.id} value={a.id!}>
											<span className="flex items-center gap-2">
												<span
													className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
													style={{ backgroundColor: a.color ?? '#6366f1' }}
												/>
												{a.name} ({formatCurrency(a.balance)})
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

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
							min="0.01"
							step="0.01"
							required
						/>
					</div>

					{/* Category + Date — hide category for transfers */}
					<div className="grid gap-6 md:grid-cols-2">
						{type !== 'transfer' && (
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
						)}
						<Input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className={type === 'transfer' ? 'col-span-1 md:col-span-2' : ''}
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
						<Button type="submit" className="flex-1 h-12" disabled={type === 'transfer' && !transferAccountId}>
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
