import React, { useMemo, useState } from 'react';
import { FiArrowUp, FiArrowDown, FiSearch, FiCalendar } from 'react-icons/fi';
import { useTransactionsContext } from '../../context/TransactionsContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Card } from '../../components/ui/card';

interface TransactionsListProps {
	onSelect?: (tx: any) => void;
	selectedId?: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
	debit_order: '#FFBB28',
	entertainment: '#FF6B6B',
	food: '#A28DFF',
	other: '#FF8042',
	personal: '#00C49F',
	travel: '#0088FE',
};

const TransactionsList: React.FC<TransactionsListProps> = ({ onSelect, selectedId }) => {
	const { transactions } = useTransactionsContext();
	const { currency } = useTheme();
	const [search, setSearch] = useState('');

	const sorted = useMemo(() => {
		return [...transactions].sort((a, b) => {
			const getValidDate = (val: any) => {
				if (!val) return new Date(0);
				if (typeof val === 'object' && 'toDate' in val) return val.toDate();
				return new Date(val);
			};
			return (
				getValidDate(b.date ?? b.createdAt).getTime() -
				getValidDate(a.date ?? a.createdAt).getTime()
			);
		});
	}, [transactions]);

	const filtered = useMemo(() => {
		return sorted.filter((tx) => tx.title.toLowerCase().includes(search.toLowerCase()));
	}, [sorted, search]);

	const grouped = useMemo(() => {
		return filtered.reduce((acc: Record<string, any[]>, tx) => {
			const dateVal = tx.date ?? tx.createdAt;
			let dateObj: Date;
			if (!dateVal) dateObj = new Date(0);
			else if (typeof dateVal === 'object' && 'toDate' in dateVal) dateObj = dateVal.toDate();
			else dateObj = new Date(dateVal);

			const dateKey = dateObj.toLocaleDateString('en-GB', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			});
			if (!acc[dateKey]) acc[dateKey] = [];
			acc[dateKey].push(tx);
			return acc;
		}, {});
	}, [filtered]);

	const getInitials = (name: string) => {
		const parts = name.split(' ');
		return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
	};

	return (
		<div className="flex min-h-full w-full items-start justify-center p-4 md:p-6">
			<div className="w-full max-w-3xl space-y-6">
				{/* Search Bar */}
				<Card className="p-4">
					<div className="relative">
						<FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search transactions..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pl-10 h-11 text-base"
						/>
					</div>
				</Card>

				{/* Transactions List */}
				<div className="max-h-[calc(100vh-200px)] space-y-6 overflow-y-auto scroll-smooth pr-2">
					{Object.entries(grouped).map(([date, txs], idx) => (
						<div key={date} className="space-y-3">
							{/* Date Header */}
							<div className="flex items-center gap-2 px-2">
								<FiCalendar className="h-4 w-4 text-muted-foreground" />
								<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
									{date}
								</h3>
								<div className="flex-1 h-px bg-border"></div>
								<span className="text-xs text-muted-foreground font-medium">
									{txs.length} {txs.length === 1 ? 'transaction' : 'transactions'}
								</span>
							</div>

							{/* Transaction Cards */}
							<div className="space-y-2">
								{txs.map((tx, i) => (
									<Card
										key={tx.id || i}
										className={`group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20 ${
											tx.id === selectedId
												? 'border-primary bg-accent shadow-sm'
												: 'border-border bg-card'
										}`}
										onClick={() => onSelect && onSelect(tx)}
									>
										<div className="p-4">
											<div className="flex items-start gap-4">
												{/* Avatar */}
												<Avatar
													className={`h-12 w-12 shrink-0 transition-transform group-hover:scale-105 ${
														tx.type === 'income'
															? 'bg-gradient-to-br from-green-500 to-green-600'
															: 'bg-gradient-to-br from-red-500 to-red-600'
													}`}
												>
													<AvatarFallback className="text-white font-semibold text-sm">
														{getInitials(tx.title)}
													</AvatarFallback>
												</Avatar>

												{/* Content */}
												<div className="flex-1 min-w-0">
													<div className="flex items-start justify-between gap-4">
														<div className="flex-1 min-w-0">
															<h4 className="font-semibold text-base mb-1.5 truncate">
																{tx.title}
															</h4>
															<div className="flex items-center gap-2 flex-wrap">
																<Badge
																	variant="outline"
																	className="text-xs font-medium border-2"
																	style={{
																		borderColor: CATEGORY_COLORS[tx.category] || '#9CA3AF',
																		color: CATEGORY_COLORS[tx.category] || '#9CA3AF',
																		backgroundColor: `${CATEGORY_COLORS[tx.category] || '#9CA3AF'}15`,
																	}}
																>
																	{tx.category}
																</Badge>
																<span className="text-xs text-muted-foreground font-medium">
																	{tx.type}
																</span>
															</div>
														</div>

														{/* Amount */}
														<div
															className={`flex items-center gap-1.5 font-bold text-lg shrink-0 ${
																tx.type === 'income'
																	? 'text-green-600 dark:text-green-400'
																	: 'text-red-600 dark:text-red-400'
															}`}
														>
															<div
																className={`p-1.5 rounded-full ${
																	tx.type === 'income'
																		? 'bg-green-100 dark:bg-green-900/30'
																		: 'bg-red-100 dark:bg-red-900/30'
																}`}
															>
																{tx.type === 'income' ? (
																	<FiArrowUp className="h-4 w-4" />
																) : (
																	<FiArrowDown className="h-4 w-4" />
																)}
															</div>
															<span>{formatCurrency(tx.amount, currency)}</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</Card>
								))}
							</div>
						</div>
					))}

					{/* Empty State */}
					{transactions.length === 0 && (
						<Card className="p-12">
							<div className="text-center space-y-3">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
									<FiSearch className="h-8 w-8 text-muted-foreground" />
								</div>
								<h3 className="text-lg font-semibold">No transactions found</h3>
								<p className="text-sm text-muted-foreground max-w-sm mx-auto">
									{search
										? 'Try adjusting your search terms to find what you\'re looking for.'
										: 'Start by adding your first transaction to track your finances.'}
								</p>
							</div>
						</Card>
					)}

					{filtered.length === 0 && transactions.length > 0 && (
						<Card className="p-12">
							<div className="text-center space-y-3">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
									<FiSearch className="h-8 w-8 text-muted-foreground" />
								</div>
								<h3 className="text-lg font-semibold">No matching transactions</h3>
								<p className="text-sm text-muted-foreground max-w-sm mx-auto">
									Try adjusting your search terms to find what you're looking for.
								</p>
							</div>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
};

export default TransactionsList;
