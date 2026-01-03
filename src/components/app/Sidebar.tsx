import React, { useState, useEffect } from 'react';
import {
	FiPlus,
	FiPieChart,
	FiList,
	FiSettings,
	FiSearch,
	FiX,
	FiArrowUp,
	FiArrowDown,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { Transaction } from '../../types';
import logoDark from '@/assets/images/logos/dark-transparent-image.png';
import logoLight from '@/assets/images/logos/white-transparent-image.png';
import { useTheme } from '../../context/ThemeContext';
import { useTransactionsContext } from '../../context/TransactionsContext';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../app/ui/dialog';
import { Button } from '../app/ui/button';
import { Input } from '../app/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../app/ui/avatar';

interface SidebarProps {
	onCreate: () => void;
	onSelect: (tx: Transaction | null) => void;
	onDelete: (id: string) => void;
	selectedId: string | null;
	collapsed: boolean;
	toggleSidebar: () => void;
	onOpenSettings?: () => void;
	onOpenLogin?: () => void;
}

const Sidebar = ({
	onCreate,
	onSelect,
	onDelete,
	selectedId,
	collapsed,
	toggleSidebar,
	onOpenSettings,
	onOpenLogin,
	onViewChange,
	activeView,
}: SidebarProps & {
	onViewChange: (view: string) => void;
	activeView: string;
}) => {
	const { currentUser } = useAuth();
	const { theme } = useTheme();
	const { transactions } = useTransactionsContext();
	const [searchTerm, setSearchTerm] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const logo = theme === 'dark' ? logoLight : logoDark;

	const handleCreateTransaction = () => {
		onCreate();
		if (window.innerWidth < 768) {
			toggleSidebar();
		}
	};

	const handleDeleteClick = (id: string) => {
		setTransactionToDelete(id);
		setDialogOpen(true);
	};

	const handleConfirmAction = async () => {
		if (transactionToDelete) {
			onDelete(transactionToDelete);
		}
		setDialogOpen(false);
		setTransactionToDelete(null);
	};

	const handleCancelAction = () => {
		setDialogOpen(false);
		setTransactionToDelete(null);
	};

	const parseDbDate = (dateInput: unknown): Date => {
		if (typeof dateInput === 'object' && dateInput !== null && 'toDate' in dateInput) {
			return (dateInput as { toDate: () => Date }).toDate();
		}
		if (dateInput instanceof Date) return dateInput;
		if (typeof dateInput === 'string') {
			const dateOnly = dateInput.split(' at ')[0];
			return new Date(dateOnly);
		}
		return new Date();
	};

	const formatDisplayDate = (dateInput: unknown) => {
		try {
			const date = parseDbDate(dateInput);
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			});
		} catch (e) {
			console.error('Error formatting date:', dateInput, e);
			return 'N/A';
		}
	};

	const sortedTransactions = [...transactions].sort((a, b) => {
		const dateA = parseDbDate(a.date ?? a.createdAt);
		const dateB = parseDbDate(b.date ?? b.createdAt);
		return dateB.getTime() - dateA.getTime();
	});

	const filteredTransactions = sortedTransactions.filter((tx) =>
		tx.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const views = ['dashboard', 'reports', 'list', ...(isMobile ? [] : ['table'])];

	const iconMap: Record<string, React.ElementType> = {
		dashboard: FiList,
		reports: FiPieChart,
		table: FiSearch,
		list: FiList,
	};

	return (
		<>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="w-[90vw] md:w-full rounded-lg">
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this transaction?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={handleCancelAction}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleConfirmAction}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<aside
				className={`fixed left-0 top-0 z-40 h-screen w-64 md:w-64 border-r bg-card transition-all duration-300 ease-in-out ${
					collapsed
						? 'w-0 overflow-hidden opacity-0 md:relative md:w-0 md:opacity-0'
						: 'opacity-100 md:relative md:w-64'
				}`}
			>
				<div
					className={`flex h-full flex-col transition-all duration-300 ${
						collapsed
							? 'opacity-0 pointer-events-none scale-95'
							: 'opacity-100 scale-100'
					}`}
				>
					{/* Header */}
					<div className="flex items-center justify-between border-b p-3 md:p-4">
						<img
							src={logo}
							alt="CashFlow Logo"
							className="h-7 md:h-8 transition-opacity duration-300"
						/>
						{!collapsed && (
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleSidebar}
								className="md:hidden"
							>
								<FiX className="h-5 w-5" />
							</Button>
						)}
					</div>

					{/* Navigation & Search */}
					{!collapsed && (
						<>
							<div className="border-b p-2">
								<div className="space-y-1">
									{views.map((view) => {
										const isActive = activeView === view;
										const IconComponent = iconMap[view];

										return (
											<button
												key={view}
												onClick={() => {
													onViewChange(view);
													if (window.innerWidth < 768) {
														toggleSidebar();
													}
												}}
												className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
													isActive
														? 'bg-accent text-accent-foreground'
														: 'text-muted-foreground hover:bg-muted hover:text-foreground'
												}`}
											>
												<IconComponent className="h-4 w-4" />
												<span className="hidden sm:inline">
													{view.charAt(0).toUpperCase() + view.slice(1)}
												</span>
											</button>
										);
									})}
								</div>
							</div>

							<div className="border-b p-2">
								<div className="relative">
									<FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										type="text"
										placeholder="Search..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-9 pr-9 text-sm"
									/>
									{searchTerm && (
										<button
											onClick={() => setSearchTerm('')}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
											aria-label="Clear search"
										>
											<FiX className="h-4 w-4" />
										</button>
									)}
								</div>
							</div>
						</>
					)}

					{/* Transactions */}
					<div className="flex-1 overflow-y-auto p-2 scroll-smooth">
						{filteredTransactions.length > 0 ? (
							<div className="space-y-2">
								{filteredTransactions.map((tx) => (
									<div
										key={tx.id}
										onClick={() => {
											onSelect(tx);
											if (window.innerWidth < 768) {
												toggleSidebar();
											}
										}}
										className={`group flex cursor-pointer items-center justify-between rounded-lg border p-2 md:p-3 transition-colors ${
											selectedId === tx.id
												? 'border-primary bg-accent'
												: 'border-border bg-background hover:bg-muted'
										}`}
									>
										<div className="flex-1 min-w-0">
											<h4 className="truncate font-medium text-sm md:text-base">
												{tx.title}
											</h4>
											<div className="mt-1 flex items-center gap-2 text-xs">
												<span
													className={`font-medium ${
														tx.type === 'income'
															? 'text-green-600 dark:text-green-400'
															: 'text-red-600 dark:text-red-400'
													}`}
												>
													{tx.type === 'income' ? (
														<FiArrowUp className="inline h-3 w-3" />
													) : (
														<FiArrowDown className="inline h-3 w-3" />
													)}
													R{tx.amount.toFixed(2)}
												</span>
												<span className="text-muted-foreground hidden sm:inline">
													{formatDisplayDate(tx.date ?? tx.createdAt)}
												</span>
											</div>
										</div>
										<button
											onClick={(e) => {
												e.stopPropagation();
												if (tx.id) handleDeleteClick(tx.id);
											}}
											className="ml-2 opacity-0 transition-opacity group-hover:opacity-100"
											aria-label="Delete transaction"
										>
											<FiX className="h-4 w-4 text-muted-foreground hover:text-destructive" />
										</button>
									</div>
								))}
							</div>
						) : (
							<div className="py-8 text-center text-xs md:text-sm text-muted-foreground">
								{searchTerm ? 'No matching transactions' : 'No transactions yet'}
							</div>
						)}
					</div>

					{/* New Transaction Button */}
					{!collapsed && (
						<div className="border-t p-2">
							<Button
								onClick={handleCreateTransaction}
								className="w-full text-sm md:text-base h-9 md:h-10"
							>
								<FiPlus className="mr-2 h-4 w-4" />
								New
							</Button>
						</div>
					)}

					{/* User Section */}
					<div className="border-t p-2">
						{currentUser ? (
							<button
								onClick={() => {
									onOpenSettings?.();
									if (window.innerWidth < 768) {
										toggleSidebar();
									}
								}}
								className="flex w-full items-center gap-3 rounded-lg border bg-background p-2 text-left transition-colors hover:bg-muted"
							>
								<Avatar className="h-8 w-8 flex-shrink-0">
									{currentUser.photoURL && (
										<AvatarImage src={currentUser.photoURL} alt="User" />
									)}
									<AvatarFallback className="bg-primary text-primary-foreground text-xs">
										{currentUser.email?.[0]?.toUpperCase() ?? '?'}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0 hidden sm:block">
									<p className="truncate text-sm font-medium">
										{currentUser.displayName || currentUser.email || 'User'}
									</p>
								</div>
								<FiSettings className="h-4 w-4 text-muted-foreground flex-shrink-0" />
							</button>
						) : (
							<Button
								onClick={() => onOpenLogin?.()}
								className="w-full text-sm md:text-base h-9 md:h-10"
							>
								Login
							</Button>
						)}
					</div>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
