import React, { useState, useMemo } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useTransactionsContext } from '../../context/TransactionsContext';
import DateRangeFilter, { DateRange } from '../../components/app/DateRangeFilter';
import { filterTransactionsByDateRangeObject } from '../../utils/dateRangeFilter';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatCurrency';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../components/app/ui/table';
import { Input } from '../../components/app/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../components/app/ui/select';
import { Button } from '../../components/app/ui/button';
import { Badge } from '../../components/app/ui/badge';

interface TransactionsTableProps {
	onDelete: (id: string) => void;
	onSelect: (tx: any) => void;
	selectedId: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
	debit_order: '#FFBB28',
	entertainment: '#FF6B6B',
	food: '#A28DFF',
	other: '#FF8042',
	personal: '#00C49F',
	travel: '#0088FE',
	uncategorized: '#9CA3AF',
};

const MONTHS = [
	{ value: 'all', label: 'All Months' },
	{ value: '0', label: 'January' },
	{ value: '1', label: 'February' },
	{ value: '2', label: 'March' },
	{ value: '3', label: 'April' },
	{ value: '4', label: 'May' },
	{ value: '5', label: 'June' },
	{ value: '6', label: 'July' },
	{ value: '7', label: 'August' },
	{ value: '8', label: 'September' },
	{ value: '9', label: 'October' },
	{ value: '10', label: 'November' },
	{ value: '11', label: 'December' },
];

const INITIAL_VISIBLE_COUNT = 15;
const LOAD_MORE_COUNT = 15;

const TransactionsTable: React.FC<TransactionsTableProps> = ({
	onDelete,
	onSelect,
	selectedId,
}) => {
	const { transactions } = useTransactionsContext();
	const { currency } = useTheme();
	const [search, setSearch] = useState('');
	const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
	const [filterCategory, setFilterCategory] = useState('all');
	const [filterMonth, setFilterMonth] = useState('all');
	const [dateRange, setDateRange] = useState<DateRange>({
		startDate: '',
		endDate: '',
	});
	const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

	const { filtered, totals } = useMemo(() => {
		const dateFiltered = filterTransactionsByDateRangeObject(transactions, dateRange);

		const filtered = dateFiltered
			.filter((tx) => {
				const matchesSearch = tx.title.toLowerCase().includes(search.toLowerCase());
				const matchesType = filterType === 'all' || tx.type === filterType;
				const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;
				const dateValue = tx.date ?? tx.createdAt;
				const month = dateValue
					? new Date(
							typeof dateValue === 'object' && 'toDate' in dateValue
								? dateValue.toDate()
								: dateValue
						).getMonth()
					: -1;
				const matchesMonth = filterMonth === 'all' || month === parseInt(filterMonth);

				return matchesSearch && matchesType && matchesCategory && matchesMonth;
			})
			.sort((a, b) => {
				const getValidDate = (value: any) => {
					if (!value) return new Date(0);
					if (typeof value === 'object' && 'toDate' in value) return value.toDate();
					return new Date(value);
				};
				const dateA = getValidDate(a.date ?? a.createdAt).getTime();
				const dateB = getValidDate(b.date ?? b.createdAt).getTime();
				return dateB - dateA;
			});

		const totalAmount = filtered.reduce((sum, tx) => sum + tx.amount, 0);
		const totalIncome = filtered
			.filter((tx) => tx.type === 'income')
			.reduce((sum, tx) => sum + tx.amount, 0);
		const totalExpense = filtered
			.filter((tx) => tx.type === 'expense')
			.reduce((sum, tx) => sum + tx.amount, 0);

		return { filtered, totals: { totalAmount, totalIncome, totalExpense } };
	}, [transactions, dateRange, search, filterType, filterCategory, filterMonth]);

	const allCategories = useMemo(
		() =>
			Array.from(
				new Set(transactions.map((tx) => tx.category?.trim() || 'Uncategorized'))
			).sort(),
		[transactions]
	);

	const visibleTransactions = filtered.slice(0, visibleCount);

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
		if (scrollHeight - scrollTop <= clientHeight + 50 && visibleCount < filtered.length) {
			setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, filtered.length));
		}
	};

	const resetVisibleCount = () => setVisibleCount(INITIAL_VISIBLE_COUNT);

	const amountHeader =
		filterType === 'all'
			? `Amount (Total: ${formatCurrency(totals.totalAmount, currency)}, Income: ${formatCurrency(totals.totalIncome, currency)}, Expense: ${formatCurrency(totals.totalExpense, currency)})`
			: filterType === 'income'
				? `Amount (Total Income: ${formatCurrency(totals.totalIncome, currency)})`
				: `Amount (Total Expense: ${formatCurrency(totals.totalExpense, currency)})`;

	return (
		<div className="flex flex-col gap-6 p-4 md:p-6">
			{/* Prompt-style Header */}
			<div className="flex flex-col gap-1">
				<h2 className="text-xl font-semibold tracking-tight">Transaction history</h2>
				<p className="text-sm text-muted-foreground">
					Search, filter, and review your activity.
				</p>
			</div>

			{/* Control Bar */}
			<div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card p-3">
				<Input
					placeholder="Search transactions…"
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						resetVisibleCount();
					}}
					className="h-10 flex-1 min-w-[220px] border-none focus-visible:ring-0"
				/>

				<Select
					value={filterType}
					onValueChange={(value: string) => {
						setFilterType(value as 'all' | 'income' | 'expense');
						resetVisibleCount();
					}}
				>
					<SelectTrigger className="h-10 w-[120px] rounded-xl">
						<SelectValue placeholder="Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="income">Income</SelectItem>
						<SelectItem value="expense">Expense</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={filterCategory}
					onValueChange={(value: string) => {
						setFilterCategory(value);
						resetVisibleCount();
					}}
				>
					<SelectTrigger className="h-10 w-[150px] rounded-xl">
						<SelectValue placeholder="Category" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All categories</SelectItem>
						{allCategories.map((category) => (
							<SelectItem key={category} value={category}>
								<div className="flex items-center gap-2">
									<span
										className="h-2.5 w-2.5 rounded-full"
										style={{
											backgroundColor: CATEGORY_COLORS[category] || '#9CA3AF',
										}}
									/>
									{category}
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={filterMonth}
					onValueChange={(value: string) => {
						setFilterMonth(value);
						resetVisibleCount();
					}}
				>
					<SelectTrigger className="h-10 w-[130px] rounded-xl">
						<SelectValue placeholder="Month" />
					</SelectTrigger>
					<SelectContent>
						{MONTHS.map((month) => (
							<SelectItem key={month.value} value={month.value}>
								{month.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<DateRangeFilter
					dateRange={dateRange}
					onDateRangeChange={(newRange) => {
						setDateRange(newRange);
						resetVisibleCount();
					}}
					onClear={() => {
						setDateRange({ startDate: '', endDate: '' });
						resetVisibleCount();
					}}
				/>
			</div>

			{/* Table Surface */}
			<div className="rounded-2xl border bg-card">
				<div
					className="relative max-h-[calc(100vh-220px)] overflow-auto"
					onScroll={handleScroll}
				>
					<Table>
						<TableHeader className="sticky top-0 z-10 bg-card/80 backdrop-blur">
							<TableRow className="hover:bg-transparent">
								<TableHead>Description</TableHead>
								<TableHead className="text-right">{amountHeader}</TableHead>
								<TableHead className="text-right">Date</TableHead>
								<TableHead className="text-right">Category</TableHead>
								<TableHead className="text-right"></TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{visibleTransactions.map((tx) => (
								<TableRow
									key={tx.id}
									onClick={() => onSelect(tx)}
									className={`cursor-pointer transition-colors ${
										tx.id === selectedId ? 'bg-muted' : 'hover:bg-muted/40'
									}`}
								>
									<TableCell>
										<div className="font-medium">{tx.title}</div>
										<div className="text-xs text-muted-foreground">
											{tx.type}
										</div>
									</TableCell>

									<TableCell
										className={`text-right font-medium ${
											tx.type === 'income'
												? 'text-green-600 dark:text-green-400'
												: 'text-red-600 dark:text-red-400'
										}`}
									>
										{formatCurrency(tx.amount, currency)}
									</TableCell>

									<TableCell className="text-right text-sm text-muted-foreground">
										{(() => {
											const dateValue = tx.date ?? tx.createdAt;
											const date =
												typeof dateValue === 'object' &&
												'toDate' in dateValue
													? dateValue.toDate()
													: new Date(dateValue || new Date());
											return date.toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
												year: 'numeric',
											});
										})()}
									</TableCell>

									<TableCell className="text-right">
										<Badge
											className="text-white"
											style={{
												backgroundColor:
													CATEGORY_COLORS[tx.category] || '#9CA3AF',
											}}
										>
											{tx.category}
										</Badge>
									</TableCell>

									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="icon"
											onClick={(e) => {
												e.stopPropagation();
												tx.id && onDelete(tx.id);
											}}
										>
											<FiTrash2 className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))}

							{filtered.length === 0 && (
								<TableRow>
									<TableCell colSpan={5} className="py-16 text-center">
										<div className="space-y-1">
											<div className="text-sm font-medium">
												Nothing to show
											</div>
											<div className="text-sm text-muted-foreground">
												Try adjusting your filters or search.
											</div>
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default TransactionsTable;
