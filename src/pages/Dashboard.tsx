import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { useTransactionsContext } from '../context/TransactionsContext';
import { useAccountsContext } from '../context/AccountsContext';
import { ViewType } from '../types';
import Sidebar from '../components/app/Sidebar';
import SettingsModal from '../components/app/SettingsModal';
import TransactionForm from '../views/Transactions/TransactionForm';
import TransactionsTable from '../views/Transactions/TransactionsTable';
import TransactionsList from '../views/Transactions/TransactionsList';
import AccountsList from '../views/Accounts/AccountsList';
import TransferForm from '../views/Accounts/TransferForm';
import ReconcileForm from '../views/Accounts/ReconcileForm';
import BudgetsList from '../views/Budgets/BudgetsList';
import ReportsView from '../views/Reports/ReportsView';
import RecurringTransactionsView from '../views/RecurringTransactions/RecurringTransactionsView';
import AuthModals from '../components/app/AuthModals';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../components/app/ui/dialog';
import { Button } from '../components/app/ui/button';
import { useToast } from '../components/app/ui/use-toast';
import { Toaster } from '../components/app/ui/toaster';
import {
	exportTransactionsToCsv,
	exportTransactionsToJson,
	importTransactionsFromFile,
} from '../utils/transactionImportExport';

const Dashboard: React.FC = () => {
	const { transactions, addTransaction, deleteTransaction } = useTransactionsContext();
	const { accounts } = useAccountsContext();
	const { toast } = useToast();

	const [selectedTx, setSelectedTx] = useState<any | null>(null);
	const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
	const [sidebarVisible, setSidebarVisible] = useState(true);
	const [activeView, setActiveView] = useState<ViewType>('dashboard');
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	React.useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout> | undefined;
		const handleResize = () => {
			if (timeoutId !== undefined) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => setIsMobile(window.innerWidth < 768), 150);
		};
		window.addEventListener('resize', handleResize);
		return () => {
			if (timeoutId !== undefined) clearTimeout(timeoutId);
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const handleCreate = () => {
		setSelectedTx(null);
		setSelectedTransactionId(null);
		setActiveView('transaction');
	};

	const handleSelect = (tx: any | null) => {
		if (tx) {
			setSelectedTx(tx);
			setSelectedTransactionId(tx.id);
			setActiveView('transaction');
		} else {
			setSelectedTx(null);
			setSelectedTransactionId(null);
			setActiveView('dashboard');
		}
	};

	const handleDeleteClick = (id: string) => {
		setTransactionToDelete(id);
		setDeleteDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (transactionToDelete) {
			try {
				await deleteTransaction(transactionToDelete);
				if (selectedTransactionId === transactionToDelete) {
					setSelectedTx(null);
					setSelectedTransactionId(null);
				}
				toast({ title: 'Success', description: 'Transaction deleted successfully' });
			} catch (err: any) {
				toast({
					title: 'Error',
					description: 'Failed to delete transaction. Please try again.',
					variant: 'destructive',
				});
			}
		}
		setDeleteDialogOpen(false);
		setTransactionToDelete(null);
	};

	const handleCancelDelete = () => {
		setDeleteDialogOpen(false);
		setTransactionToDelete(null);
	};

	const handleCloseForm = () => {
		setSelectedTx(null);
		setSelectedTransactionId(null);
		setActiveView('dashboard');
	};

	const toggleSidebar = () => setSidebarVisible((prev) => !prev);

	const handleViewChange = (view: string) => {
		// If switching away from transaction detail, clear selection
		if (view !== 'transaction') {
			setSelectedTx(null);
			setSelectedTransactionId(null);
		}
		setActiveView(view as ViewType);
	};

	const renderMainContent = () => {
		switch (activeView) {
			case 'transaction':
				return (
					<TransactionForm
						transaction={selectedTx || undefined}
						onClose={handleCloseForm}
					/>
				);
			case 'table':
				return (
					<TransactionsTable
						onDelete={handleDeleteClick}
						onSelect={handleSelect}
						selectedId={selectedTransactionId}
					/>
				);
			case 'list':
				return (
					<TransactionsList
						onSelect={handleSelect}
						selectedId={selectedTransactionId}
					/>
				);
			case 'accounts':
				return <AccountsList />;
			case 'transfer':
				return <TransferForm onClose={() => setActiveView('accounts')} />;
			case 'reconcile':
				return <ReconcileForm onClose={() => setActiveView('accounts')} />;
			case 'budgets':
				return <BudgetsList />;
			case 'recurring':
				return <RecurringTransactionsView />;
			case 'reports':
				return <ReportsView />;
			default:
				return (
					<div className="flex flex-1 items-center justify-center px-6">
						<div className="w-full max-w-5xl text-center">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<span className="text-primary text-lg">&#10022;</span>
							</div>
							<h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
								CashFlow
							</h1>
							<p className="text-muted-foreground mb-10">
								What would you like to do?
							</p>
							<div className="mb-6">
								<Button
									size="lg"
									onClick={handleCreate}
									className="w-full h-14 rounded-2xl px-6 text-left flex items-center justify-between"
								>
									<div>
										<div className="font-medium">New transaction</div>
										<div className="text-sm text-primary-foreground/80">
											Track income or expense
										</div>
									</div>
									<span className="text-lg">&#8594;</span>
								</Button>
							</div>
							{transactions.length > 0 && (
								<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
									<button
										onClick={() => setActiveView('accounts')}
										className="rounded-2xl border bg-background p-4 text-left transition-colors hover:bg-muted/50"
									>
										<div className="flex items-center gap-2 mb-1">
											<span className="text-sm">&#9783;</span>
											<span className="font-medium">Accounts</span>
										</div>
										<p className="text-sm text-muted-foreground">
											Manage balances
										</p>
									</button>
									<button
										onClick={() => setActiveView('budgets')}
										className="rounded-2xl border bg-background p-4 text-left transition-colors hover:bg-muted/50"
									>
										<div className="flex items-center gap-2 mb-1">
											<span className="text-sm">&#9673;</span>
											<span className="font-medium">Budgets</span>
										</div>
										<p className="text-sm text-muted-foreground">
											Track spending limits
										</p>
									</button>
									<button
										onClick={() =>
											setActiveView(isMobile ? 'list' : 'table')
										}
										className="rounded-2xl border bg-background p-4 text-left transition-colors hover:bg-muted/50"
									>
										<div className="flex items-center gap-2 mb-1">
											<span className="text-sm">&#9776;</span>
											<span className="font-medium">History</span>
										</div>
										<p className="text-sm text-muted-foreground">
											All transactions
										</p>
									</button>
									<button
										onClick={() => setActiveView('recurring')}
										className="rounded-2xl border bg-background p-4 text-left transition-colors hover:bg-muted/50"
									>
										<div className="flex items-center gap-2 mb-1">
											<span className="text-sm">&#8635;</span>
											<span className="font-medium">Recurring</span>
										</div>
										<p className="text-sm text-muted-foreground">
											Manage recurring transactions
										</p>
									</button>
								</div>
							)}
						</div>
					</div>
				);
		}
	};

	return (
		<div className="flex h-screen-safe flex-col md:flex-row bg-background">
			<Toaster />
			<Sidebar
				collapsed={!sidebarVisible}
				toggleSidebar={toggleSidebar}
				onCreate={handleCreate}
				onSelect={handleSelect}
				onDelete={handleDeleteClick}
				selectedId={selectedTransactionId}
				activeView={activeView}
				onViewChange={handleViewChange}
				onOpenLogin={() => setAuthModalOpen(true)}
				onOpenSettings={() => setSettingsOpen(true)}
			/>

			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent className="w-[90vw] md:w-full rounded-lg">
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this transaction? This action cannot
							be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={handleCancelDelete}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleConfirmDelete}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<SettingsModal
				open={settingsOpen}
				onClose={() => setSettingsOpen(false)}
				onImport={async (file) => {
					try {
						const result = await importTransactionsFromFile(
							file,
							transactions,
							addTransaction,
							accounts[0]?.id ?? ""
						);
						if (result.errors.length) {
							toast({
								title: 'Import completed with errors',
								description: `Imported ${result.importedCount}, skipped ${result.skippedDuplicates}. Errors: ${result.errors
									.slice(0, 3)
									.join('; ')}${result.errors.length > 3 ? '...' : ''}`,
								variant: 'destructive',
							});
						} else {
							toast({
								title: 'Import successful',
								description: `Imported ${result.importedCount}, skipped ${result.skippedDuplicates}.`,
							});
						}
					} catch (e: any) {
						toast({
							title: 'Import failed',
							description: e.message || 'Failed to import file.',
							variant: 'destructive',
						});
					}
				}}
				onExportCSV={() => {
					const csv = exportTransactionsToCsv(transactions);
					const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = 'transactions.csv';
					document.body.appendChild(a);
					a.click();
					a.remove();
					URL.revokeObjectURL(url);
					toast({ title: 'Export successful', description: 'Transactions exported to CSV' });
				}}
				onExportJSON={() => {
					const json = exportTransactionsToJson(transactions);
					const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = 'transactions.json';
					document.body.appendChild(a);
					a.click();
					a.remove();
					URL.revokeObjectURL(url);
					toast({
						title: 'Export successful',
						description: 'Transactions exported to JSON',
					});
				}}
			/>

			<AuthModals
				open={authModalOpen}
				onClose={() => setAuthModalOpen(false)}
				mode={authMode}
				onModeChange={setAuthMode}
			/>

			<div
				className={`flex-1 flex flex-col h-screen-safe md:h-auto overflow-y-auto transition-all duration-300 ease-in-out ${sidebarVisible ? 'md:ml-8' : 'md:ml-0'
					}`}
			>
				{!sidebarVisible && (
					<Button
						variant="outline"
						className="absolute left-4 top-4 z-50"
						onClick={toggleSidebar}
						aria-label="Open menu"
					>
						<FiMenu className="mr-2 h-4 w-4" />
						Menu
					</Button>
				)}

				{renderMainContent()}
			</div>
		</div>
	);
};

export default Dashboard;
