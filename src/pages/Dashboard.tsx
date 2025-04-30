import React, { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import Sidebar from "../components/Sidebar";
import TransactionForm from "../components/TransactionForm";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleCreate = () => {
    setSelectedTx(null);
    setSelectedTransactionId(null);
    setIsCreating(true);
  };

  const handleSelect = (tx: any) => {
    setSelectedTx(tx); // Set selected transaction to state
    setSelectedTransactionId(tx.id); // Set selected transaction id
    setIsCreating(false); // If we're editing, it's no longer "creating"
  };

  const handleDeleteTransaction = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (confirmed) {
      deleteTransaction(id);
      if (selectedTransactionId === id) {
        setSelectedTx(null);
        setSelectedTransactionId(null);
      }
    }
  };

  const handleCloseForm = () => {
    setSelectedTx(null);
    setIsCreating(false);
  };

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

  return (
    <div className="dashboard-wrapper">
      {sidebarVisible && (
        <Sidebar
          collapsed={!sidebarVisible}
          toggleSidebar={toggleSidebar}
          transactions={transactions}
          onCreate={handleCreate}
          onSelect={handleSelect}
          onDelete={handleDeleteTransaction}
          selectedId={selectedTransactionId}
        />
      )}

      <div className={`dashboard-content ${sidebarVisible ? "" : "full-screen"}`}>
        {!sidebarVisible && (
          <button className="local-toggle-button" onClick={toggleSidebar}>☰ Open Sidebar</button>
        )}

        {isCreating ? (
          <TransactionForm onClose={handleCloseForm} onSubmit={addTransaction} />
        ) : selectedTx ? (
          <TransactionForm
            transaction={selectedTx} // Pass the selected transaction to the form
            onClose={handleCloseForm}
            onSubmit={(data) => updateTransaction(selectedTx.id, data)}
          />
        ) : (
          <p style={{ color: "#4b5563" }}>Select or create a transaction to get started.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
