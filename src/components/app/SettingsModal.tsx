import React, { useState, useEffect } from 'react';
import { FiSettings, FiDatabase } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../app/ui/dialog';
import { Button } from '../app/ui/button';
import { Switch } from '../app/ui/switch';
import { Label } from '../app/ui/label';
import { useTransactionsContext } from '@/context/TransactionsContext';

interface SettingsModalProps {
	open: boolean;
	onClose: () => void;
	onImport?: (file: File) => Promise<void> | void;
	onExportCSV?: () => void;
	onExportJSON?: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
	open,
	onClose,
	onImport,
	onExportCSV,
	onExportJSON,
}) => {
	const { deleteAllTransactions } = useTransactionsContext();
	const { theme, setTheme } = useTheme();
	const [localTheme, setLocalTheme] = useState(theme);
	const { currentUser } = useAuth();
	const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
	const [deleteAllConfirmOpen, setDeleteAllConfirmOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<'general' | 'data'>('general');

	useEffect(() => {
		setLocalTheme(theme);
	}, [theme]);

	const handleApply = () => {
		if (localTheme !== theme) setTheme(localTheme);
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
				<DialogContent className="sm:max-w-3xl max-h-modal overflow-hidden flex flex-col">
					<DialogHeader>
						<DialogTitle>Settings</DialogTitle>
						<DialogDescription>Manage your app preferences and data</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-4 sm:flex-row overflow-y-auto flex-1 min-h-0">
						<div className="w-full sm:w-56">
							<div
								role="tablist"
								aria-label="Settings sections"
								className="flex gap-1 rounded-lg border p-1 sm:flex-col"
							>
								<button
									role="tab"
									aria-selected={activeTab === 'general'}
									aria-controls="settings-tab-general"
									onClick={() => setActiveTab('general')}
									className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'general'
										? 'bg-accent text-accent-foreground'
										: 'text-muted-foreground hover:bg-muted'
										}`}
								>
									<FiSettings className="h-4 w-4" />
									General
								</button>
								<button
									role="tab"
									aria-selected={activeTab === 'data'}
									aria-controls="settings-tab-data"
									onClick={() => setActiveTab('data')}
									className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'data'
										? 'bg-accent text-accent-foreground'
										: 'text-muted-foreground hover:bg-muted'
										}`}
								>
									<FiDatabase className="h-4 w-4" />
									Data
								</button>
							</div>
						</div>

						<div className="flex-1 space-y-4">
							{activeTab === 'general' && (
								<div className="space-y-4" id="settings-tab-general" role="tabpanel">
									<div>
										<h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
											General
										</h3>
										<div className="space-y-4 rounded-lg border p-4 sm:p-5">
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
										</div>
									</div>
								</div>
							)}

							{activeTab === 'data' && (
								<div className="space-y-4" id="settings-tab-data" role="tabpanel">
									<div>
										<h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
											Data
										</h3>
										<div className="space-y-4 rounded-lg border p-4 sm:p-5">
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
												Delete all transactions from your account. This
												action cannot be undone.
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
