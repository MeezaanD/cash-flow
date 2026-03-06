import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { useBudgetsContext } from '../../context/BudgetsContext';
import { useTransactionsContext } from '../../context/TransactionsContext';
import { Budget, BudgetProgress } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../../components/app/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../../components/app/ui/dialog';
import BudgetForm from './BudgetForm';

const CATEGORY_LABELS: Record<string, string> = {
	personal: 'Personal',
	food: 'Food',
	travel: 'Travel',
	entertainment: 'Entertainment',
	debit_order: 'Debit Order',
	housing: 'Housing',
	transport: 'Transport',
	health: 'Health',
	education: 'Education',
	other: 'Other',
};

const getBarColour = (percent: number): string => {
	if (percent >= 90) return 'bg-red-500';
	if (percent >= 70) return 'bg-amber-500';
	return 'bg-green-500';
};

const BudgetsList: React.FC = () => {
	const { budgets, deleteBudget, getAllBudgetProgress } = useBudgetsContext();
	const { transactions } = useTransactionsContext();

	const [showForm, setShowForm] = useState(false);
	const [editingBudget, setEditingBudget] = useState<Budget | undefined>(undefined);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

	const allProgress: BudgetProgress[] = getAllBudgetProgress(transactions);

	const handleEdit = (budget: Budget) => {
		setEditingBudget(budget);
		setShowForm(true);
	};

	const handleDeleteClick = (id: string) => {
		setBudgetToDelete(id);
		setDeleteDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (budgetToDelete) await deleteBudget(budgetToDelete);
		setDeleteDialogOpen(false);
		setBudgetToDelete(null);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingBudget(undefined);
	};

	if (showForm) {
		return <BudgetForm onClose={handleCloseForm} budget={editingBudget} />;
	}

	const now = new Date();
	const monthLabel = now.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });

	const totalBudgeted = allProgress.reduce((sum, p) => sum + p.budget.amount, 0);
	const totalSpent = allProgress.reduce((sum, p) => sum + p.spent, 0);

	return (
		<div className="flex flex-col min-h-screen bg-background">
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent className="w-[90vw] md:w-full rounded-lg">
					<DialogHeader>
						<DialogTitle>Delete Budget</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this budget? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleConfirmDelete}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div className="flex-1 overflow-y-auto p-4 md:p-8">
				{/* Header */}
				<div className="mb-6 flex items-center justify-between">
					<div>
						<h1 className="text-2xl md:text-3xl font-bold tracking-tight">
							Budgets
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">{monthLabel}</p>
					</div>
					<Button onClick={() => setShowForm(true)}>
						<FiPlus className="mr-2 h-4 w-4" />
						New Budget
					</Button>
				</div>

				{/* Summary */}
				{allProgress.length > 0 && (
					<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div className="rounded-xl border bg-card p-5">
							<p className="text-sm text-muted-foreground">Total Budgeted</p>
							<p className="mt-1 text-xl font-bold">
								{formatCurrency(totalBudgeted)}
							</p>
						</div>
						<div className="rounded-xl border bg-card p-5">
							<p className="text-sm text-muted-foreground">Total Spent</p>
							<p className="mt-1 text-xl font-bold">
								{formatCurrency(totalSpent)}
							</p>
						</div>
						<div className="rounded-xl border bg-card p-5">
							<p className="text-sm text-muted-foreground">Remaining</p>
							<p
								className={`mt-1 text-xl font-bold ${
									totalBudgeted - totalSpent >= 0
										? 'text-green-600 dark:text-green-400'
										: 'text-red-600 dark:text-red-400'
								}`}
							>
								{formatCurrency(Math.max(0, totalBudgeted - totalSpent))}
							</p>
						</div>
					</div>
				)}

				{/* Budget list */}
				{budgets.length === 0 ? (
					<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
							<FiPlus className="h-6 w-6 text-primary" />
						</div>
						<h3 className="text-lg font-semibold">No budgets yet</h3>
						<p className="mt-1 text-sm text-muted-foreground">
							Create a budget to track your monthly spending by category
						</p>
						<Button className="mt-4" onClick={() => setShowForm(true)}>
							Create Budget
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						{allProgress.map((progress) => {
							const { budget, spent, remaining, percent } = progress;
							const isOverBudget = spent > budget.amount;
							const barColour = getBarColour(percent);
							const label =
								CATEGORY_LABELS[budget.category] ?? budget.category;

							return (
								<div
									key={budget.id}
									className="group rounded-2xl border bg-card p-5"
								>
									<div className="mb-3 flex items-start justify-between gap-3">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<h3 className="font-semibold truncate">
													{label}
												</h3>
												{isOverBudget && (
													<FiAlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
												)}
											</div>
											<p className="mt-0.5 text-xs text-muted-foreground">
												Monthly limit
											</p>
										</div>
										<div className="flex items-center gap-1 flex-shrink-0">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
												onClick={() => handleEdit(budget)}
												aria-label="Edit budget"
											>
												<FiEdit2 className="h-3.5 w-3.5" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
												onClick={() =>
													budget.id && handleDeleteClick(budget.id)
												}
												aria-label="Delete budget"
											>
												<FiTrash2 className="h-3.5 w-3.5" />
											</Button>
										</div>
									</div>

									{/* Progress bar */}
									<div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-muted">
										<div
											className={`h-full rounded-full transition-all ${barColour}`}
											style={{ width: `${Math.min(100, percent)}%` }}
										/>
									</div>

									{/* Amounts */}
									<div className="flex items-center justify-between text-sm">
										<span className="text-muted-foreground">
											{formatCurrency(spent)} spent
										</span>
										<span
											className={`font-medium ${
												isOverBudget
													? 'text-red-600 dark:text-red-400'
													: 'text-muted-foreground'
											}`}
										>
											{isOverBudget
												? `${formatCurrency(Math.abs(remaining))} over`
												: `${formatCurrency(remaining)} remaining`}{' '}
											of {formatCurrency(budget.amount)}
										</span>
									</div>

									{/* Percentage label */}
									<div className="mt-1 text-xs text-muted-foreground text-right">
										{percent.toFixed(0)}% used
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default BudgetsList;
