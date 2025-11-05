import React, { useState, useEffect } from 'react';
import {
	FiDollarSign,
	FiTag,
	FiType,
	FiInfo,
	FiSave,
	FiX,
	FiChevronDown,
	FiCalendar,
} from 'react-icons/fi';
import { useTransactionsContext } from '../../context/TransactionsContext';
import { Transaction } from '../../models/TransactionModel';
import { Category } from '../../types';
import '../../styles/TransactionForm.css';

interface TransactionFormProps {
	onClose: () => void;
	transaction?: Transaction;
}

const CATEGORIES: Category[] = [
	{ value: 'personal', label: 'Personal' },
	{ value: 'food', label: 'Food' },
	{ value: 'travel', label: 'Travel' },
	{ value: 'entertainment', label: 'Entertainment' },
	{ value: 'debit_order', label: 'Debit Order' },
	{ value: 'other', label: 'Other' },
];

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, transaction }) => {
	const { addTransaction, updateTransaction } = useTransactionsContext();
	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState(0);
	const [type, setType] = useState<Transaction['type']>('expense');
	const [category, setCategory] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState<string>('');
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (transaction) {
			setTitle(transaction.title);
			setAmount(transaction.amount);
			setType(transaction.type);
			setCategory(transaction.category ?? '');
			setDescription(transaction.description ?? '');

			// Parse date from transaction
			let transactionDate: Date | null = null;
			if (transaction.date) {
				if (typeof transaction.date === 'object' && 'toDate' in transaction.date) {
					transactionDate = transaction.date.toDate();
				} else if (transaction.date instanceof Date) {
					transactionDate = transaction.date;
				}
			}

			// Set date in YYYY-MM-DD format for date input
			if (transactionDate) {
				setDate(transactionDate.toISOString().split('T')[0]);
			} else {
				setDate('');
			}
		} else {
			// Reset form for new transaction (default to today's date)
			setTitle('');
			setAmount(0);
			setType('expense');
			setCategory('');
			setDescription('');
			setDate(new Date().toISOString().split('T')[0]);
		}
	}, [transaction]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const data: any = {
				title,
				amount: Number(amount),
				type,
				category,
				description,
			};

			// Include date if provided (convert to Date object, otherwise use current date)
			if (date) {
				data.date = new Date(date);
			} else {
				data.date = new Date(); // Use current date if not specified
			}

			if (transaction && transaction.id) {
				await updateTransaction(transaction.id, data);
			} else {
				await addTransaction(data);
			}
			onClose();
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCategorySelect = (selectedCategory: string) => {
		setCategory(selectedCategory);
		setIsCategoryOpen(false);
	};

	return (
		<div className="form-container">
			<form onSubmit={handleSubmit} className="transaction-form">
				<div className="form-header">
					<h2>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
					<button type="button" onClick={onClose} className="close-button">
						<FiX size={20} />
					</button>
				</div>

				<div className="input-group">
					<label>
						<FiType className="input-icon" />
						<span>Title</span>
					</label>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="e.g. Salary, Groceries"
						required
					/>
				</div>

				<div className="input-group">
					<label>
						<FiDollarSign className="input-icon" />
						<span>Amount</span>
					</label>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(Number(e.target.value))}
						placeholder="0.00"
						required
						step="0.01"
						min="0"
					/>
				</div>

				<div className="input-group">
					<label>
						<FiTag className="input-icon" />
						<span>Category</span>
					</label>
					<div className="category-dropdown">
						<button
							type="button"
							className={`dropdown-toggle ${isCategoryOpen ? 'open' : ''}`}
							onClick={() => setIsCategoryOpen(!isCategoryOpen)}
						>
							{category
								? CATEGORIES.find((c) => c.value === category)?.label || category
								: 'Select a category'}
							<FiChevronDown className="dropdown-arrow" />
						</button>
						{isCategoryOpen && (
							<div className="dropdown-menu">
								{CATEGORIES.map((cat) => (
									<button
										key={cat.value}
										type="button"
										className={`dropdown-item ${
											category === cat.value ? 'selected' : ''
										}`}
										onClick={() => handleCategorySelect(cat.value)}
									>
										{cat.label}
									</button>
								))}
							</div>
						)}
					</div>
				</div>

				<div className="input-group">
					<label>
						<FiInfo className="input-icon" />
						<span>Description (Optional)</span>
					</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Add any additional details"
						rows={3}
					/>
				</div>

				<div className="input-group">
					<label>
						<FiCalendar className="input-icon" />
						<span>Date</span>
					</label>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						required
					/>
				</div>

				<div className="input-group">
					<label>
						<span>Type</span>
					</label>
					<div className="type-toggle">
						<button
							type="button"
							className={`type-option ${type === 'income' ? 'active' : ''}`}
							onClick={() => setType('income')}
						>
							Income
						</button>
						<button
							type="button"
							className={`type-option ${type === 'expense' ? 'active' : ''}`}
							onClick={() => setType('expense')}
						>
							Expense
						</button>
					</div>
				</div>

				<div className="button-group">
					<button type="submit" className="submit-button" disabled={isSubmitting}>
						<FiSave className="button-icon" />
						{isSubmitting
							? 'Processing...'
							: transaction
								? 'Update Transaction'
								: 'Add Transaction'}
					</button>
					<button
						type="button"
						onClick={onClose}
						className="cancel-button"
						disabled={isSubmitting}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default TransactionForm;
