import React, { useState, useEffect } from 'react';
import { FiSettings, FiDatabase, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { CurrencyCode } from '../types';
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useTransactionsContext } from '@/context/TransactionsContext';
import RecurringExpensesList from '../views/RecurringExpenses/RecurringExpensesList';

interface SettingsModalProps {
	open: boolean;
	onClose: () => void;
	onImport?: (file: File) => Promise<void> | void;
	onExportCSV?: () => void;
	onExportJSON?: () => void;
}

const currencyOptions: CurrencyCode[] = ['ZAR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

const SettingsModal: React.FC<SettingsModalProps> = ({
	open,
	onClose,
	onImport,
	onExportCSV,
	onExportJSON,
}) => {
	const { deleteAllTransactions } = useTransactionsContext();
	const { theme, setTheme, currency, setCurrency } = useTheme();
	const [localTheme, setLocalTheme] = useState(theme);
	const [localCurrency, setLocalCurrency] = useState<CurrencyCode>(currency);
	const { currentUser } = useAuth();
	const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
	const [deleteAllConfirmOpen, setDeleteAllConfirmOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<'general' | 'data' | 'recurring'>('general');

	useEffect(() => {
		setLocalTheme(theme);
	}, [theme]);

	useEffect(() => {
		setLocalCurrency(currency);
	}, [currency]);

	const handleApply = () => {
		if (localTheme !== theme) setTheme(localTheme);
		if (localCurrency !== currency) setCurrency(localCurrency);
		onClose();
	};

	const handleSignOut = async () => {
		setLogoutConfirmOpen(true);
	};

	const confirmLogout = async () => {
		await signOut(auth);
		localStorage.removeItem('token');
		setLogoutConfirmOpen(false);
		onClose();
	};

	const handleDeleteAllClick = () => {
		setDeleteAllConfirmOpen(true);
	};

	const confirmDeleteAllTransactions = async () => {
		await deleteAllTransactions();
		setDeleteAllConfirmOpen(false);
		onClose();
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onClose}>
				<DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Settings</DialogTitle>
						<DialogDescription>Manage your app preferences and data</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="w-full sm:w-56">
							<div className="space-y-1 rounded-lg border p-1">
								<button
									onClick={() => setActiveTab('general')}
									className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
										activeTab === 'general'
											? 'bg-accent text-accent-foreground'
											: 'text-muted-foreground hover:bg-muted'
									}`}
								>
									<FiSettings className="h-4 w-4" />
									General
								</button>
								<button
									onClick={() => setActiveTab('data')}
									className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
										activeTab === 'data'
											? 'bg-accent text-accent-foreground'
											: 'text-muted-foreground hover:bg-muted'
									}`}
								>
									<FiDatabase className="h-4 w-4" />
									Data
								</button>
								<button
									onClick={() => setActiveTab('recurring')}
									className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
										activeTab === 'recurring'
											? 'bg-accent text-accent-foreground'
											: 'text-muted-foreground hover:bg-muted'
									}`}
								>
									<FiRefreshCw className="h-4 w-4" />
									Recurring Expenses
								</button>
							</div>
						</div>

						<div className="flex-1 space-y-4">
							{activeTab === 'general' && (
								<div className="space-y-4">
									<div>
										<h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
											General
										</h3>
										<div className="space-y-4 rounded-lg border p-4">
											<div className="flex items-center justify-between">
												<Label
													htmlFor="dark-mode"
													className="cursor-pointer"
												>
													Dark Mode
												</Label>
												<Switch
													id="dark-mode"
													checked={localTheme === 'dark'}
													onCheckedChange={(checked: boolean) =>
														setLocalTheme(checked ? 'dark' : 'light')
													}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="currency">Currency</Label>
												<Select
													value={localCurrency}
													onValueChange={(value: string) =>
														setLocalCurrency(value as CurrencyCode)
													}
												>
													<SelectTrigger id="currency">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{currencyOptions.map((c) => (
															<SelectItem key={c} value={c}>
																{c}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										</div>
									</div>
								</div>
							)}

							{activeTab === 'data' && (
								<div className="space-y-4">
									<div>
										<h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
											Data
										</h3>
										<div className="space-y-4 rounded-lg border p-4">
											<p className="text-sm text-muted-foreground">
												Import transactions from CSV/JSON. Duplicates are
												automatically skipped.
											</p>
											<div className="flex flex-col gap-2 sm:flex-row">
												<input
													type="file"
													accept=".csv,.json,application/json,text/csv"
													id="settings-import-input"
													className="hidden"
													onChange={async (e) => {
														const file = e.target.files?.[0];
														if (file && onImport) await onImport(file);
														e.currentTarget.value = '';
													}}
												/>
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														document
															.getElementById('settings-import-input')
															?.click()
													}
													className="w-full sm:w-auto"
												>
													Import
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={onExportCSV}
													className="w-full sm:w-auto"
												>
													Export CSV
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={onExportJSON}
													className="w-full sm:w-auto"
												>
													Export JSON
												</Button>
											</div>
											<p className="text-sm text-muted-foreground">
												Delete all transactions from your account. This action cannot be
												undone.
											</p>
											<Button
												variant="outline"
												size="sm"
												onClick={handleDeleteAllClick}
												className="w-full sm:w-auto"
											>
												Delete All Transactions
											</Button>
										</div>
									</div>
								</div>
							)}

							{activeTab === 'recurring' && (
								<div className="space-y-4">
									<div>
										<h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
											Recurring Expenses
										</h3>
										<div className="rounded-lg border bg-card p-6">
											<RecurringExpensesList />
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					<DialogFooter className="flex-col gap-2 sm:flex-row">
						<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
							{currentUser ? (
								<Button
									variant="outline"
									onClick={handleSignOut}
									className="w-full sm:w-auto"
								>
									Sign Out
								</Button>
							) : (
								<Button
									variant="outline"
									onClick={onClose}
									className="w-full sm:w-auto"
								>
									Sign In
								</Button>
							)}
							<Button
								variant="outline"
								onClick={onClose}
								className="w-full sm:w-auto"
							>
								Close
							</Button>
						</div>
						<Button onClick={handleApply} className="w-full sm:w-auto">
							Apply
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Logout</DialogTitle>
						<DialogDescription>Are you sure you want to log out?</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setLogoutConfirmOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={confirmLogout}>
							Logout
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={deleteAllConfirmOpen} onOpenChange={setDeleteAllConfirmOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Delete All Transactions</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete all transactions? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteAllConfirmOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={confirmDeleteAllTransactions}>
							Delete All
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default SettingsModal;
