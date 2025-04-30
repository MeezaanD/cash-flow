import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import '..styles/TransactionList.css';

const TransactionList = () => {
  const { transactions, deleteTransaction, updateTransaction } = useTransactions();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await deleteTransaction(id);
    }
  };

  const handleEdit = (txId: string, currentTitle: string) => {
    setEditingId(txId);
    setEditedTitle(currentTitle);
  };

  const handleSave = async (id: string) => {
    if (editedTitle.trim() === "") {
      alert("Title cannot be empty");
      return;
    }
    await updateTransaction(id, { title: editedTitle });
    setEditingId(null);
    setEditedTitle("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedTitle("");
  };

  return (
    <div className="transaction-list">
      <h2>Transactions</h2>
      <div>
        {transactions.map((tx) => (
          <div key={tx.id} className="transaction-item">
            <div className="transaction-info">
              {editingId === tx.id ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="transaction-edit-input"
                />
              ) : (
                <>
                  <h3 className="transaction-title">{tx.title}</h3>
                  <p className="transaction-category">
                    {tx.category} - {formatDate(new Date(tx.createdAt?.seconds * 1000).toISOString())}
                  </p>
                </>
              )}
            </div>

            <div className="transaction-actions">
              <div
                className={`transaction-amount ${tx.type}`}
              >
                {tx.type === "income" ? "+" : "-"}
                {formatCurrency(tx.amount)}
              </div>

              {editingId === tx.id ? (
                <>
                  <button onClick={() => handleSave(tx.id)} className="save">Save</button>
                  <button onClick={handleCancel} className="cancel">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(tx.id, tx.title)} className="edit">Edit</button>
                  <button onClick={() => handleDelete(tx.id)} className="delete">Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
