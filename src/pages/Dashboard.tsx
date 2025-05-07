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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleCreate = () => {
    setSelectedTx(null);
    setSelectedTransactionId(null);
    setIsCreating(true);
  };

  const handleSelect = (tx: any) => {
    setSelectedTx(tx);
    setSelectedTransactionId(tx.id);
    setIsCreating(false);
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

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        transactions={transactions}
        onCreate={handleCreate}
        onSelect={handleSelect}
        onDelete={handleDeleteTransaction}
        selectedId={selectedTransactionId}
      />

      <div className={`dashboard-content ${sidebarCollapsed ? "collapsed" : ""}`}>
        {sidebarCollapsed && (
          <button className="sidebar-toggle-button" onClick={toggleSidebar}>
            ☰
          </button>
        )}

        <div className="form-container">
          {isCreating ? (
            <TransactionForm onClose={handleCloseForm} onSubmit={addTransaction} />
          ) : selectedTx ? (
            <TransactionForm
              transaction={selectedTx}
              onClose={handleCloseForm}
              onSubmit={(data) => updateTransaction(selectedTx.id, data)}
            />
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <p style={{ color: "#4b5563" }}>Select or create a transaction to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;