import React, { useState, useMemo } from 'react';
import { FiDollarSign, FiPieChart, FiPlusCircle } from 'react-icons/fi';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Alert,
	Snackbar,
} from '@mui/material';
import { useTransactionsContext } from '../context/TransactionsContext';
import { ViewType, DateRange } from '../types';
import { useThemeVariant } from '@/hooks/useThemeVariant';
import { filterTransactionsByDateRangeObject } from '../utils/dateRangeFilter';
import PieChart from '../components/PieChart';
import Sidebar from '../components/Sidebar';
import SettingsModal from '../components/SettingsModal';
import TransactionForm from '../views/Transactions/TransactionForm';
import TransactionsTable from '../views/Transactions/TransactionsTable';
import TransactionsList from '../views/Transactions/TransactionsList';
import AuthModals from '../components/AuthModals';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
	const styles = useThemeVariant();
	const { transactions, addTransaction, deleteTransaction } = useTransactionsContext();

	const [selectedTx, setSelectedTx] = useState<any | null>(null);
	const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
	const [sidebarVisible, setSidebarVisible] = useState(true);
	const [activeView, setActiveView] = useState<ViewType>('dashboard');
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
	const [dateRange, setDateRange] = useState<DateRange>({
		startDate: '',
		endDate: '',
	});
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [importSuccess, setImportSuccess] = useState<string | null>(null);

	const [error, setError] = useState<string | null>(null);
	const [showError, setShowError] = useState(false);

	// Filter transactions by date range
	const filteredTransactions = useMemo(() => {
		return filterTransactionsByDateRangeObject(transactions, dateRange);
	}, [transactions, dateRange]);

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
			} catch (err: any) {
				setError('Failed to delete transaction. Please try again.');
				setShowError(true);
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

	const handleShowPieChart = (show: boolean) => {
		if (show) {
			setActiveView('reports');
		} else {
			setActiveView('dashboard');
		}
	};

	const handleCloseError = () => {
		setShowError(false);
		setError(null);
	};

	// Auth modal opener passed directly via onOpenLogin from Sidebar

	const handleAuthClose = () => {
		setAuthModalOpen(false);
	};

	const handleAuthModeChange = (newMode: 'login' | 'register') => {
		setAuthMode(newMode);
	};

	const pieChartData = useMemo(() => {
		const categoryMap: Record<string, number> = {};

		filteredTransactions.forEach((tx) => {
			if (tx.type === 'expense') {
				categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
			}
		});

		const colors = [
			'#0088FE',
			'#00C49F',
			'#FFBB28',
			'#FF8042',
			'#A28DFF',
			'#FF6B6B',
			'#4ECDC4',
			'#45B7D1',
			'#FFA07A',
			'#98D8C8',
		];

		return Object.entries(categoryMap).map(([name, value], index) => ({
			name,
			value,
			color: colors[index % colors.length],
		}));
	}, [filteredTransactions]);

	const handleDateRangeChange = (newRange: DateRange) => {
		setDateRange(newRange);
	};

	// kept helper removed (handled inline in SettingsModal props)

	// Export helpers provided inline to SettingsModal props below

	// Removed unused local import helper (handled inline in SettingsModal props)

	return (
		<div
			className="dashboard-wrapper"
			style={{ background: styles.cardBg, color: styles.textPrimary }}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 8,
					justifyContent: 'flex-end',
				}}
			></div>
			<Sidebar
				collapsed={!sidebarVisible}
				toggleSidebar={toggleSidebar}
				onCreate={handleCreate}
				onSelect={handleSelect}
				onDelete={handleDeleteClick}
				selectedId={selectedTransactionId}
				activeView={activeView}
				onViewChange={(view: string) => setActiveView(view as ViewType)}
				onOpenLogin={() => setAuthModalOpen(true)}
				onOpenSettings={() => setSettingsOpen(true)}
			/>

			<Snackbar
				open={showError}
				autoHideDuration={6000}
				onClose={handleCloseError}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
					{error}
				</Alert>
			</Snackbar>

			<Snackbar
				open={!!importSuccess}
				autoHideDuration={4000}
				onClose={() => setImportSuccess(null)}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert
					onClose={() => setImportSuccess(null)}
					severity="success"
					sx={{ width: '100%' }}
				>
					{importSuccess}
				</Alert>
			</Snackbar>

			<Dialog
				open={deleteDialogOpen}
				onClose={handleCancelDelete}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to delete this transaction? This action cannot be
						undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelDelete} color="primary">
						Cancel
					</Button>
					<Button onClick={handleConfirmDelete} color="error" autoFocus>
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			<SettingsModal
				open={settingsOpen}
				onClose={() => setSettingsOpen(false)}
				onImport={async (file) => {
					try {
						const text = await file.text();
						let records: any[] = [];
						if (file.name.toLowerCase().endsWith('.json')) {
							records = JSON.parse(text);
						} else if (file.name.toLowerCase().endsWith('.csv')) {
							const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
							const headers = headerLine
								.split(',')
								.map((h) => h.replace(/^\"|\"$/g, ''));
							const parseCSVValue = (cell: string) =>
								cell.replace(/^\"|\"$/g, '').replace(/\"\"/g, '"');
							records = lines.map((line) => {
								const cells = line.match(/\"(?:[^\"]|\"\")*\"|[^,]+/g) || [];
								const obj: any = {};
								headers.forEach((h, i) => {
									obj[h] = parseCSVValue(cells[i] ?? '');
								});
								return obj;
							});
						} else {
							throw new Error('Unsupported file type. Use CSV or JSON.');
						}

						const required = ['title', 'amount', 'type', 'category'];
						let imported = 0;
						let skippedDuplicates = 0;
						const errors: string[] = [];

						const existingSignatures = new Set(
							transactions.map(
								(t) =>
									`${t.title}|${t.amount}|${t.type}|${t.category}|${t.date && typeof t.date === 'object' && 'toDate' in t.date ? t.date.toDate().toISOString().slice(0, 10) : t.date ? new Date(t.date as any).toISOString().slice(0, 10) : ''}`
							)
						);

						for (const [index, r] of records.entries()) {
							const row = typeof r === 'object' ? r : {};
							const missing = required.filter((k) => !(k in row) || row[k] === '');
							if (missing.length) {
								errors.push(`Row ${index + 1}: Missing ${missing.join(', ')}`);
								continue;
							}
							const amountNum = Number(row.amount);
							if (!isFinite(amountNum)) {
								errors.push(`Row ${index + 1}: Invalid amount`);
								continue;
							}
							if (row.type !== 'income' && row.type !== 'expense') {
								errors.push(`Row ${index + 1}: Invalid type`);
								continue;
							}
							const dateISO = row.date
								? new Date(row.date).toISOString().slice(0, 10)
								: '';
							const signature = `${row.title}|${amountNum}|${row.type}|${row.category}|${dateISO}`;
							if (existingSignatures.has(signature)) {
								skippedDuplicates++;
								continue;
							}
							try {
								await addTransaction({
									title: row.title,
									amount: amountNum,
									type: row.type,
									category: row.category,
									description: row.description ?? '',
								});
								imported++;
								existingSignatures.add(signature);
							} catch (e) {
								errors.push(`Row ${index + 1}: Failed to save`);
							}
						}

						if (errors.length) {
							setError(
								`Imported ${imported}, skipped ${skippedDuplicates}. Errors: ${errors.slice(0, 3).join('; ')}${errors.length > 3 ? '...' : ''}`
							);
							setShowError(true);
						} else {
							setImportSuccess(`Imported ${imported}, skipped ${skippedDuplicates}.`);
						}
					} catch (e: any) {
						setError(e.message || 'Failed to import file.');
						setShowError(true);
					}
				}}
				onExportCSV={() => {
					const headers = [
						'title',
						'amount',
						'type',
						'category',
						'description',
						'date',
						'createdAt',
						'id',
					];
					const rows = transactions.map((t) => {
						const safe = (v: any) => {
							if (v == null) return '';
							const s = String(v).replace(/\"/g, '""');
							return `"${s}"`;
						};
						const date =
							t.date && typeof t.date === 'object' && 'toDate' in t.date
								? t.date.toDate().toISOString()
								: t.date
									? new Date(t.date as any).toISOString()
									: '';
						const createdAt =
							t.createdAt &&
							typeof t.createdAt === 'object' &&
							'toDate' in t.createdAt
								? t.createdAt.toDate().toISOString()
								: t.createdAt
									? new Date(t.createdAt as any).toISOString()
									: '';
						return [
							t.title,
							t.amount,
							t.type,
							t.category,
							t.description ?? '',
							date,
							createdAt,
							t.id ?? '',
						]
							.map(safe)
							.join(',');
					});
					const csv = [headers.join(','), ...rows].join('\n');
					const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = 'transactions.csv';
					document.body.appendChild(a);
					a.click();
					a.remove();
					URL.revokeObjectURL(url);
				}}
				onExportJSON={() => {
					const json = JSON.stringify(transactions, null, 2);
					const blob = new Blob([json], {
						type: 'application/json;charset=utf-8',
					});
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = 'transactions.json';
					document.body.appendChild(a);
					a.click();
					a.remove();
					URL.revokeObjectURL(url);
				}}
			/>

			<AuthModals
				open={authModalOpen}
				onClose={handleAuthClose}
				mode={authMode}
				onModeChange={handleAuthModeChange}
			/>

			<div
				className={`dashboard-content ${sidebarVisible ? '' : 'full-width'}`}
				style={{
					background: styles.cardBg,
					transition: 'all 0.3s ease',
				}}
			>
				{!sidebarVisible && (
					<button
						className="sidebar-toggle"
						onClick={toggleSidebar}
						style={{
							color: '#ffffff',
							borderColor: styles.cardBorder,
						}}
					>
						☰ Open Sidebar
					</button>
				)}

				{activeView === 'transaction' ? (
					<TransactionForm
						transaction={selectedTx || undefined}
						onClose={handleCloseForm}
					/>
				) : activeView === 'reports' ? (
					<PieChart
						data={pieChartData}
						onClose={() => handleShowPieChart(false)}
						dateRange={dateRange}
						onDateRangeChange={handleDateRangeChange}
					/>
				) : activeView === 'list' ? (
					<TransactionsList onSelect={handleSelect} selectedId={selectedTransactionId} />
				) : activeView === 'table' ? (
					<TransactionsTable
						onDelete={handleDeleteClick}
						onSelect={handleSelect}
						selectedId={selectedTransactionId}
					/>
				) : (
					<div className="empty-state" style={{ color: styles.textPrimary }}>
						<div
							className="welcome-card"
							style={{
								background: styles.cardBg,
								borderColor: styles.cardBorder,
							}}
						>
							<div className="welcome-header">
								<h2>Welcome to CashFlow</h2>
								<p className="subtitle" style={{ color: styles.textSecondary }}>
									Your personal finance companion
								</p>
							</div>

							<div className="feature-grid">
								<div className="feature-card">
									<div className="feature-icon-container">
										<FiDollarSign className="feature-icon" />
									</div>
									<div className="feature-content">
										<h4>Track Expenses</h4>
										<p>Log and categorize your spending</p>
									</div>
								</div>
								<div
									className="feature-card clickable-feature"
									onClick={() => handleShowPieChart(true)}
								>
									<div className="feature-icon-container">
										<FiPieChart className="feature-icon" />
									</div>
									<div className="feature-content">
										<h4>Visual Reports</h4>
										<p>Beautiful charts of your data</p>
									</div>
								</div>
							</div>

							<div className="cTa-section">
								<button
									className="cTa-button primary"
									onClick={handleCreate}
									style={{
										background: styles.accentPrimary,
										color: '#fff',
									}}
								>
									<FiPlusCircle className="button-icon" />
									Create Your First Transaction
								</button>

								{transactions.length > 0 && (
									<button
										className="cTa-button secondary"
										onClick={() => handleShowPieChart(true)}
										style={{
											border: `1px solid ${styles.accentPrimary}`,
											color: styles.accentPrimary,
										}}
									>
										<FiPieChart className="button-icon" />
										View Expense Distribution
									</button>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
