import React, { useState, useMemo } from 'react';
import { FiArrowUp, FiArrowDown, FiTrash2 } from 'react-icons/fi';
import { useTransactionsContext } from '../../context/TransactionsContext';
import DateRangeFilter, { DateRange } from '../../components/DateRangeFilter';
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
} from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

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
		<div className="w-full space-y-4 p-4">
			<div className="flex flex-wrap items-center gap-2">
				<Input
					placeholder="Search transactions"
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						resetVisibleCount();
					}}
					className="flex-1 min-w-[200px]"
				/>

				<Select
					value={filterType}
					onValueChange={(value: string) => {
						setFilterType(value as 'all' | 'income' | 'expense');
						resetVisibleCount();
					}}
				>
					<SelectTrigger className="w-[120px]">
						<SelectValue placeholder="Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Types</SelectItem>
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
					<SelectTrigger className="w-[140px]">
						<SelectValue placeholder="Category" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Categories</SelectItem>
						{allCategories.map((category) => (
							<SelectItem key={category} value={category}>
								<div className="flex items-center gap-2">
									<div
										className="h-3 w-3 rounded-full"
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
					<SelectTrigger className="w-[140px]">
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

			<div className="rounded-md border bg-card">
				<div
					className="relative max-h-[calc(100vh-180px)] w-full overflow-auto scroll-smooth"
					onScroll={handleScroll}
				>
					<Table>
						<TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
							<TableRow className="hover:bg-transparent">
								<TableHead className="font-semibold">Description</TableHead>
								<TableHead className="text-right font-semibold">
									{amountHeader}
								</TableHead>
								<TableHead className="text-right font-semibold">Date</TableHead>
								<TableHead className="text-right font-semibold">Category</TableHead>
								<TableHead className="text-right font-semibold">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{visibleTransactions.map((tx) => (
								<TableRow
									key={tx.id}
									className={`cursor-pointer transition-colors ${
										tx.id === selectedId ? 'bg-accent' : 'hover:bg-muted/50'
									}`}
									onClick={() => onSelect(tx)}
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
										<div className="flex items-center justify-end gap-1">
											{tx.type === 'income' ? (
												<FiArrowUp className="h-3.5 w-3.5" />
											) : (
												<FiArrowDown className="h-3.5 w-3.5" />
											)}
											<span>{formatCurrency(tx.amount, currency)}</span>
										</div>
									</TableCell>
									<TableCell className="text-right">
										{(() => {
											const dateValue = tx.date ?? tx.createdAt;
											let dateObj: Date;
											if (!dateValue) {
												dateObj = new Date(0);
											} else if (
												typeof dateValue === 'object' &&
												'toDate' in dateValue
											) {
												dateObj = dateValue.toDate();
											} else {
												dateObj = new Date(dateValue);
											}
											return dateObj.toLocaleDateString('en-US', {
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
									<TableCell colSpan={5} className="text-center py-12">
										<div className="text-sm text-muted-foreground">
											{search
												? 'No matching transactions found'
												: 'No transactions available'}
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
