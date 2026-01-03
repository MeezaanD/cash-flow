import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiDollarSign } from 'react-icons/fi';
import { useTransactionsContext } from '../../context/TransactionsContext';
import { RecurringExpense } from '../../models/RecurringExpenseModel';
import { Button } from '../../components/app/ui/button';
import RecurringExpenseForm from './RecurringExpenseForm';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../../components/app/ui/dialog';
import { formatCurrency } from '../../utils/formatCurrency';
import { useTheme } from '../../context/ThemeContext';

const RecurringExpensesList: React.FC = () => {
	const { recurringExpenses, deleteRecurringExpense, recurringExpensesLoading } =
		useTransactionsContext();
	const { currency } = useTheme();
	const [editingExpense, setEditingExpense] = useState<RecurringExpense | undefined>(undefined);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

	const handleEdit = (expense: RecurringExpense) => {
		setEditingExpense(expense);
		setIsFormOpen(true);
	};

	const handleDelete = (id: string) => {
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
				console.error('Error deleting recurring expense:', error);
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

	if (recurringExpensesLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-sm text-muted-foreground">Loading recurring expenses...</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">Recurring Expenses</h3>
				<Button onClick={handleAddNew} size="sm">
					<FiPlus className="mr-2 h-4 w-4" />
					Add New
				</Button>
			</div>

			{isFormOpen && (
				<div className="rounded-xl border-2 bg-card p-6 shadow-sm">
					<RecurringExpenseForm expense={editingExpense} onClose={handleCloseForm} />
				</div>
			)}

			{recurringExpenses.length === 0 ? (
				<div className="rounded-lg border border-dashed p-8 text-center">
					<FiDollarSign className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
					<p className="text-sm text-muted-foreground">
						No recurring expenses yet. Add one to get started.
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{recurringExpenses.map((expense) => (
						<div
							key={expense.id}
							className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
						>
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<h4 className="font-medium">{expense.title}</h4>
									<span className="text-xs text-muted-foreground">
										({getFrequencyLabel(expense.frequency)})
									</span>
								</div>
								<div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
									<span>{formatCurrency(expense.amount, currency)}</span>
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
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleEdit(expense)}
									className="h-8 w-8"
								>
									<FiEdit className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleDelete(expense.id!)}
									className="h-8 w-8 text-destructive hover:text-destructive"
								>
									<FiTrash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}
				</div>
			)}

			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this recurring expense? This action
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

export default RecurringExpensesList;
