import React, { useMemo, useState } from 'react';
import {
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Typography,
	Divider,
	Box,
	TextField,
	ListItemButton,
	InputAdornment,
} from '@mui/material';
import { FiArrowUp, FiArrowDown, FiSearch } from 'react-icons/fi';
import { useTransactionsContext } from '../../context/TransactionsContext';
import { useTheme } from '../../context/ThemeContext';
import { useThemeVariant } from '../../hooks/useThemeVariant';
import { formatCurrency } from '../../utils/formatCurrency';
import '../../styles/TransactionList.css';

interface TransactionsListProps {
	onSelect?: (tx: any) => void;
	selectedId?: string | null;
}

// Category colors matching TransactionsTable
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
	const themeVariant = useThemeVariant();
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
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'flex-start',
				minHeight: '100%',
				width: '100%',
				p: { xs: 1, sm: 2 },
			}}
		>
			<Box
				className="transaction-list-container"
				sx={{
					p: 2,
					borderRadius: 3,
					bgcolor: themeVariant.cardBg,
					border: `1px solid ${themeVariant.cardBorder}`,
					color: themeVariant.textPrimary,
					overflowY: 'auto',
					maxHeight: 'calc(100vh - 150px)',
					transition: 'background-color 0.3s ease, color 0.3s ease',
					width: '100%',
					maxWidth: { xs: '100%', sm: 600 },
					scrollbarWidth: 'thin',
					scrollbarColor: `${themeVariant.cardBorder} ${themeVariant.cardBg}`,
					'&::-webkit-scrollbar': {
						width: '8px',
					},
					'&::-webkit-scrollbar-track': {
						background: themeVariant.cardBg,
					},
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: themeVariant.cardBorder,
						borderRadius: '4px',
					},
				}}
			>
				{/* Search Bar */}
				<TextField
					variant="outlined"
					placeholder="Search transactions..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					fullWidth
					size="small"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<FiSearch
									size={18}
									style={{ opacity: 0.6, color: themeVariant.textSecondary }}
								/>
							</InputAdornment>
						),
					}}
					sx={{
						mb: 2,
						'& .MuiOutlinedInput-root': {
							borderRadius: 2,
							backgroundColor: themeVariant.sidebarBg,
							'& fieldset': { borderColor: themeVariant.sidebarBorder },
							'&:hover fieldset': { borderColor: themeVariant.accentPrimary },
						},
						'& input': {
							color: themeVariant.textPrimary,
						},
					}}
				/>

				{Object.entries(grouped).map(([date, txs], idx) => (
					<Box key={date} sx={{ mb: 3 }}>
						<Typography
							variant="subtitle2"
							sx={{
								mb: 1,
								color: themeVariant.textSecondary,
								fontWeight: 600,
								fontSize: '0.9rem',
							}}
						>
							{date}
						</Typography>

						<List disablePadding>
							{txs.map((tx, i) => (
								<React.Fragment key={tx.id || i}>
									<ListItem disablePadding sx={{ mb: 0.5 }}>
										<ListItemButton
											onClick={() => onSelect && onSelect(tx)}
											selected={tx.id === selectedId}
											sx={{
												borderRadius: 2,
												py: 1,
												px: 1.5,
												backgroundColor:
													tx.id === selectedId
														? themeVariant.activeBg
														: 'transparent',
												'&:hover': {
													backgroundColor: themeVariant.hoverBg,
												},
												transition: 'all 0.2s ease-in-out',
											}}
										>
											<ListItemAvatar>
												<Avatar
													sx={{
														bgcolor:
															tx.type === 'income'
																? themeVariant.incomeColor
																: themeVariant.expenseColor,
														fontSize: '0.8rem',
														color: '#fff',
													}}
												>
													{getInitials(tx.title)}
												</Avatar>
											</ListItemAvatar>

											<ListItemText
												primary={
													<Box
														display="flex"
														justifyContent="space-between"
														alignItems="center"
													>
														<Typography
															sx={{
																fontWeight: 600,
																fontSize: '0.9rem',
																color: themeVariant.textPrimary,
															}}
															component="span"
														>
															{tx.title}
														</Typography>
														<Box
															sx={{
																display: 'flex',
																alignItems: 'center',
																color:
																	tx.type === 'income'
																		? themeVariant.incomeColor
																		: themeVariant.expenseColor,
																fontWeight: 600,
															}}
														>
															{tx.type === 'income' ? (
																<FiArrowUp size={14} />
															) : (
																<FiArrowDown size={14} />
															)}
															<Typography
																sx={{
																	ml: 0.5,
																	color: themeVariant.textPrimary,
																}}
																component="span"
															>
																{formatCurrency(
																	tx.amount,
																	currency
																)}
															</Typography>
														</Box>
													</Box>
												}
												secondary={
													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															gap: 0.5,
															mt: 0.5,
														}}
													>
														<Box
															sx={{
																backgroundColor:
																	CATEGORY_COLORS[tx.category] ||
																	'#9CA3AF',
																color: 'white',
																px: 1,
																py: 0.25,
																borderRadius: '12px',
																fontSize: '0.7rem',
																fontWeight: 500,
																display: 'inline-block',
															}}
														>
															{tx.category}
														</Box>
														<Typography
															variant="body2"
															sx={{
																fontSize: '0.75rem',
																color: themeVariant.textSecondary,
															}}
															component="span"
														>
															• {tx.type}
														</Typography>
													</Box>
												}
											/>
										</ListItemButton>
									</ListItem>

									{i < txs.length - 1 && (
										<Divider sx={{ borderColor: themeVariant.cardBorder }} />
									)}
								</React.Fragment>
							))}
						</List>

						{idx < Object.keys(grouped).length - 1 && (
							<Divider sx={{ my: 1.5, borderColor: themeVariant.cardBorder }} />
						)}
					</Box>
				))}

				{transactions.length === 0 && (
					<Typography
						variant="body2"
						align="center"
						sx={{ py: 4, color: themeVariant.textSecondary }}
					>
						No transactions found
					</Typography>
				)}
			</Box>
		</Box>
	);
};

export default TransactionsList;
