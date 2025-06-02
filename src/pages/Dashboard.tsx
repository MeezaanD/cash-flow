import React, { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import Sidebar from "../components/Sidebar";
import TransactionForm from "../components/TransactionForm";
import "../styles/Dashboard.css";
import { FiDollarSign, FiTrendingUp, FiPieChart, FiPlusCircle } from "react-icons/fi";

// Dashboard component: main page for managing transactions
const Dashboard: React.FC = () => {
  // Custom hook for transaction CRUD operations
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions();

  // State for currently selected transaction (for editing)
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  // State for selected transaction ID (for highlighting in sidebar)
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  // State to control if the transaction form is in "create" mode
  const [isCreating, setIsCreating] = useState(false);
  // State to control sidebar visibility
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Handler to start creating a new transaction
  const handleCreate = () => {
    setSelectedTx(null);
    setSelectedTransactionId(null);
    setIsCreating(true);
  };

  // Handler to select a transaction for editing
  const handleSelect = (tx: any) => {
    setSelectedTx(tx);
    setSelectedTransactionId(tx.id);
    setIsCreating(false);
  };

  // Handler to delete a transaction (with confirmation)
  const handleDeleteTransaction = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (confirmed) {
      deleteTransaction(id);
      // Clear selection if the deleted transaction was selected
      if (selectedTransactionId === id) {
        setSelectedTx(null);
        setSelectedTransactionId(null);
      }
    }
  };

  // Handler to close the transaction form
  const handleCloseForm = () => {
    setSelectedTx(null);
    setIsCreating(false);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar for navigation and transaction list */}
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

      <div
        className={`dashboard-content ${sidebarVisible ? "" : "full-width"}`}
      >
        {/* Button to open sidebar when hidden */}
        {!sidebarVisible && (
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰ Open Sidebar
          </button>
        )}

        {/* Show transaction form for create or edit, otherwise show welcome/empty state */}
        {isCreating ? (
          <TransactionForm
            onClose={handleCloseForm}
            onSubmit={addTransaction}
          />
        ) : selectedTx ? (
          <TransactionForm
            transaction={selectedTx}
            onClose={handleCloseForm}
            onSubmit={(data) => updateTransaction(selectedTx.id, data)}
          />
        ) : (
          // Empty state: welcome message and feature highlights
          <div className="empty-state">
            <div className="welcome-card">
              <h2>Welcome to CashFlow</h2>
              <p className="subtitle">Your personal finance companion</p>

              <div className="feature-grid">
                <div className="feature-card">
                  <FiDollarSign className="feature-icon" />
                  <h4>Track Expenses</h4>
                  <p>Log and categorize your spending</p>
                </div>
                <div className="feature-card">
                  <FiTrendingUp className="feature-icon" />
                  <h4>View Trends</h4>
                  <p>Analyze your financial patterns</p>
                </div>
                <div className="feature-card">
                  <FiPieChart className="feature-icon" />
                  <h4>Visual Reports</h4>
                  <p>Beautiful charts of your data</p>
                </div>
              </div>

              <button className="cta-button" onClick={handleCreate}>
                <FiPlusCircle className="button-icon" />
                Create Your First Transaction
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
