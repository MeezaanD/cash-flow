import React, { useState, useMemo } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiDollarSign, FiRefreshCw, FiX } from 'react-icons/fi';
import { useTransactionsContext } from '../../context/TransactionsContext';
import { RecurringExpense } from '../../models/RecurringExpenseModel';
import { Button } from '../../components/app/ui/button';
import { Badge } from '../../components/app/ui/badge';
import RecurringExpenseForm from './RecurringExpenseForm';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../../components/app/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../components/app/ui/select';
import { formatCurrency } from '../../utils/formatCurrency';

const FREQUENCY_OPTIONS = [
	{ value: 'all', label: 'All Frequencies' },
	{ value: 'daily', label: 'Daily' },
	{ value: 'weekly', label: 'Weekly' },
	{ value: 'monthly', label: 'Monthly' },
	{ value: 'yearly', label: 'Yearly' },
];

const CATEGORY_OPTIONS = [
	{ value: 'all', label: 'All Categories' },
	{ value: 'personal', label: 'Personal' },
	{ value: 'food', label: 'Food' },
	{ value: 'travel', label: 'Travel' },
	{ value: 'entertainment', label: 'Entertainment' },
	{ value: 'debit_order', label: 'Debit Order' },
	{ value: 'other', label: 'Other' },
];

const TYPE_OPTIONS = [
	{ value: 'all', label: 'All Types' },
	{ value: 'expense', label: 'Expense' },
	{ value: 'income', label: 'Income' },
];

const getFrequencyLabel = (frequency?: string) => {
	switch (frequency) {
		case 'daily':
			return 'Daily';
		case 'weekly':
			return 'Weekly';
		case 'monthly':
			return 'Monthly';
		case 'yearly':
			return 'Yearly';
		default:
			return 'Monthly';
	}
};

const buildFilterLabel = (
	frequencyFilter: string,
	categoryFilter: string,
	typeFilter: string
): string => {
	const parts: string[] = [];
	if (frequencyFilter !== 'all') parts.push(getFrequencyLabel(frequencyFilter));
	if (categoryFilter !== 'all') {
		const opt = CATEGORY_OPTIONS.find((o) => o.value === categoryFilter);
		if (opt) parts.push(opt.label);
	}
	if (typeFilter !== 'all') {
		parts.push(typeFilter === 'expense' ? 'Expenses' : 'Income');
	}
	return parts.length > 0 ? parts.join(' · ') : 'All recurring';
};

const RecurringExpensesView: React.FC = () => {
	const { recurringExpenses, deleteRecurringExpense, recurringExpensesLoading } =
		useTransactionsContext();

	const [frequencyFilter, setFrequencyFilter] = useState('all');
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [typeFilter, setTypeFilter] = useState('all');
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingExpense, setEditingExpense] = useState<RecurringExpense | undefined>(undefined);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

	const hasActiveFilters =
		frequencyFilter !== 'all' || categoryFilter !== 'all' || typeFilter !== 'all';

	const filteredExpenses = useMemo(() => {
		return recurringExpenses.filter((expense) => {
			if (frequencyFilter !== 'all' && expense.frequency !== frequencyFilter) return false;
			if (categoryFilter !== 'all' && expense.category !== categoryFilter) return false;
			if (typeFilter !== 'all') {
				const expenseType = expense.type ?? 'expense';
				if (expenseType !== typeFilter) return false;
			}
			return true;
		});
	}, [recurringExpenses, frequencyFilter, categoryFilter, typeFilter]);

	const filteredTotal = useMemo(
		() => filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
		[filteredExpenses]
	);

	const filterLabel = useMemo(
		() => buildFilterLabel(frequencyFilter, categoryFilter, typeFilter),
		[frequencyFilter, categoryFilter, typeFilter]
	);

	const handleEdit = (expense: RecurringExpense) => {
		setEditingExpense(expense);
		setIsFormOpen(true);
	};

	const handleDeleteClick = (id: string) => {
		setExpenseToDelete(id);
		setDeleteDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (expenseToDelete) {
			try {
				await deleteRecurringExpense(expenseToDelete);
				setDeleteDialogOpen(false);
				setExpenseToDelete(null);
			} catch (error) {
				console.error('Error deleting recurring transaction:', error);
			}
		}
	};

	const handleAddNew = () => {
		setEditingExpense(undefined);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingExpense(undefined);
	};

	const handleResetFilters = () => {
		setFrequencyFilter('all');
		setCategoryFilter('all');
		setTypeFilter('all');
	};

	if (recurringExpensesLoading) {
		return (
			<div className="flex flex-1 items-center justify-center" aria-live="polite">
				<div className="text-sm text-muted-foreground">Loading recurring transactions...</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col overflow-y-auto p-4 md:p-6 lg:p-8">
			{/* Header */}
			<div className="mb-6 flex items-start justify-between gap-4">
				<div>
					<div className="flex items-center gap-2">
						<FiRefreshCw className="h-6 w-6 text-primary" />
						<h1 className="text-2xl font-bold tracking-tight">Recurring Transactions</h1>
					</div>
					<p className="mt-1 text-sm text-muted-foreground">
						Manage your subscriptions, debit orders, salary, and other recurring transactions.
					</p>
				</div>
				<Button onClick={handleAddNew} className="flex-shrink-0">
					<FiPlus className="mr-2 h-4 w-4" />
					Add New
				</Button>
			</div>

			{/* Filter Bar */}
			<div className="mb-4 flex flex-wrap items-center gap-3">
				<Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
					<SelectTrigger className="h-9 w-44 text-sm">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{FREQUENCY_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={categoryFilter} onValueChange={setCategoryFilter}>
					<SelectTrigger className="h-9 w-44 text-sm">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{CATEGORY_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={typeFilter} onValueChange={setTypeFilter}>
					<SelectTrigger className="h-9 w-36 text-sm">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{TYPE_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleResetFilters}
						className="h-9 gap-1 text-muted-foreground hover:text-foreground"
					>
						<FiX className="h-4 w-4" />
						Reset
					</Button>
				)}
			</div>

			{/* Total Summary Card */}
			<div className="mb-6 rounded-xl border bg-card p-4 shadow-sm">
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
							<FiDollarSign className="h-5 w-5 text-primary" />
						</div>
						<div>
							<p className="text-xs text-muted-foreground">{filterLabel}</p>
							<p className="text-2xl font-bold tracking-tight">
								{formatCurrency(filteredTotal)}
							</p>
						</div>
					</div>
					<Badge variant="secondary" className="text-sm">
						{filteredExpenses.length}{' '}
						{filteredExpenses.length === 1 ? 'item' : 'items'}
					</Badge>
				</div>
			</div>

			{/* Transaction List */}
			{filteredExpenses.length === 0 ? (
				<div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
					<FiDollarSign className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
					<p className="font-medium text-muted-foreground">
						{hasActiveFilters
							? 'No transactions match the current filters'
							: 'No recurring transactions yet'}
					</p>
					{!hasActiveFilters && (
						<p className="mt-1 text-sm text-muted-foreground">
							Add one to track your subscriptions, debit orders, and income.
						</p>
					)}
					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleResetFilters}
							className="mt-3"
						>
							Clear filters
						</Button>
					)}
				</div>
			) : (
				<div role="list" className="space-y-3">
					{filteredExpenses.map((expense) => (
						<div
							key={expense.id}
							role="listitem"
							className="flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
						>
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-center gap-2">
									<h4 className="font-medium">{expense.title}</h4>
									<Badge variant="outline" className="text-xs">
										{getFrequencyLabel(expense.frequency)}
									</Badge>
									{(expense.type === 'income') ? (
										<Badge variant="secondary" className="text-xs text-green-600 dark:text-green-400">
											Income
										</Badge>
									) : (
										<Badge variant="secondary" className="text-xs text-red-600 dark:text-red-400">
											Expense
										</Badge>
									)}
								</div>
								<div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
									<span className="font-medium text-foreground">
										{formatCurrency(expense.amount)}
									</span>
									<span>•</span>
									<span>{expense.category}</span>
									{expense.description && (
										<>
											<span>•</span>
											<span className="truncate">{expense.description}</span>
										</>
									)}
								</div>
							</div>
							<div className="flex items-center gap-2 sm:justify-end">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleEdit(expense)}
									className="h-9 w-9"
									aria-label="Edit recurring transaction"
								>
									<FiEdit className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleDeleteClick(expense.id!)}
									className="h-9 w-9 text-destructive hover:text-destructive"
									aria-label="Delete recurring transaction"
								>
									<FiTrash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Add / Edit Form Dialog */}
			<Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
				<DialogContent className="sm:max-w-lg">
					<RecurringExpenseForm expense={editingExpense} onClose={handleCloseForm} />
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this recurring transaction? This action
							cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleConfirmDelete}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default RecurringExpensesView;
