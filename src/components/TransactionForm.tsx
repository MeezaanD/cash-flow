import React, { useState } from "react";
import { FiDollarSign, FiTag, FiType, FiInfo, FiSave, FiX } from "react-icons/fi";
import '../styles/TransactionForm.css';

// Props type for the TransactionForm component
type TransactionFormProps = {
  onSubmit: (data: any) => void; // Callback when form is submitted
  onClose: () => void;           // Callback to close the form/modal
  transaction?: any;             // Optional transaction to edit
};

// TransactionForm component for adding/editing a transaction
const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onClose, transaction }) => {
  // State hooks for form fields, pre-filled if editing
  const [title, setTitle] = useState(transaction?.title || "");
  const [amount, setAmount] = useState(transaction?.amount || 0);
  const [type, setType] = useState(transaction?.type || "income");
  const [category, setCategory] = useState(transaction?.category || "");
  const [description, setDescription] = useState(transaction?.description || "");

  // Handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, amount, type, category, description }); // Pass form data to parent
    onClose(); // Close the form/modal
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="transaction-form">
        {/* Header with title and close button */}
        <div className="form-header">
          <h2>{transaction ? "Edit Transaction" : "Add New Transaction"}</h2>
          <button type="button" onClick={onClose} className="close-button">
            <FiX size={20} />
          </button>
        </div>

        {/* Title input */}
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

        {/* Amount input */}
        <div className="input-group">
          <label>
            <FiDollarSign className="input-icon" />
            <span>Amount</span>
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            placeholder="0.00"
            required
            step="0.01"
          />
        </div>

        {/* Category input */}
        <div className="input-group">
          <label>
            <FiTag className="input-icon" />
            <span>Category</span>
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Food, Utilities"
            required
          />
        </div>

        {/* Description textarea (optional) */}
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

        {/* Type toggle (income/expense) */}
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

        {/* Submit and Cancel buttons */}
        <div className="button-group">
          <button type="submit" className="submit-button">
            <FiSave className="button-icon" />
            {transaction ? "Update Transaction" : "Add Transaction"}
          </button>
          <button type="button" onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;