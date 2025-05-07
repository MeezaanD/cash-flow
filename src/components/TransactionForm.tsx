import React, { useState } from "react";
import '../styles/TransactionForm.css';

type TransactionFormProps = {
  onSubmit: (data: any) => void;
  onClose: () => void;
  transaction?: any;
};

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onClose, transaction }) => {
  const [title, setTitle] = useState(transaction?.title || "");
  const [amount, setAmount] = useState(transaction?.amount || 0);
  const [type, setType] = useState(transaction?.type || "income");
  const [category, setCategory] = useState(transaction?.category || "");
  const [description, setDescription] = useState(transaction?.description || ""); // Optional field

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, amount, type, category, description });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h2>{transaction ? "Edit" : "Create"} Transaction</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(+e.target.value)}
        placeholder="Amount"
        required
      />

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={3}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <div className="button-group">
        <button type="submit">
          {transaction ? "Update" : "Add"}
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
