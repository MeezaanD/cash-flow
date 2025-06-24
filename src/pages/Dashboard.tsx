import React, { useState, useMemo } from "react";
import { FiDollarSign, FiPieChart, FiPlusCircle } from "react-icons/fi";
import { useTransactions } from "../hooks/useTransactions";
import { Transaction } from "../types";
import ThemeDropdown from "../components/ThemeDropdown";
import Sidebar from "../components/Sidebar";
import TransactionForm from "../components/TransactionForm";
import PieChart from "../components/PieChart";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions();

  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [isCreating, setIsCreating] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showPieChart, setShowPieChart] = useState(false);
  const [activeView, setActiveView] = useState<
    "dashboard" | "reports" | "transaction"
  >("dashboard");

  const handleCreate = () => {
    setSelectedTx(null);
    setSelectedTransactionId(null);
    setIsCreating(true);
    setActiveView("transaction");
  };

  const handleSelect = (tx: any | null) => {
    if (tx) {
      setSelectedTx(tx);
      setSelectedTransactionId(tx.id);
      setIsCreating(false);
      setActiveView("transaction");
    } else {
      setSelectedTx(null);
      setSelectedTransactionId(null);
      setIsCreating(false);
      setActiveView("dashboard");
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
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
    setActiveView("dashboard");
  };

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

  const handleShowPieChart = (show: boolean) => {
    setShowPieChart(show);
    setActiveView(show ? "reports" : "dashboard");
    if (show) {
      setSelectedTx(null);
      setSelectedTransactionId(null);
      setIsCreating(false);
    }
  };

  const pieChartData = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (tx.type === "expense") {
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
      }
    });

    const colors = [
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#A28DFF",
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
    ];

    return Object.entries(categoryMap).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [transactions]);

  return (
    <div className="dashboard-wrapper">
      <ThemeDropdown />
      <Sidebar
        collapsed={!sidebarVisible}
        toggleSidebar={toggleSidebar}
        transactions={transactions}
        onCreate={handleCreate}
        onSelect={handleSelect}
        onDelete={handleDeleteTransaction}
        selectedId={selectedTransactionId}
        onShowPieChart={handleShowPieChart}
        showPieChart={showPieChart}
        isCreating={isCreating}
      />

      <div
        className={`dashboard-content ${sidebarVisible ? "" : "full-width"}`}
      >
        {!sidebarVisible && (
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰ Open Sidebar
          </button>
        )}

        {activeView === "transaction" ? (
          isCreating ? (
            <TransactionForm
              onClose={handleCloseForm}
              onSubmit={addTransaction}
            />
          ) : selectedTx ? (
            <TransactionForm
              transaction={selectedTx}
              onClose={handleCloseForm}
              onSubmit={(
                data: Omit<Transaction, "id" | "date" | "createdAt">
              ) => updateTransaction(selectedTx.id, data)}
            />
          ) : null
        ) : activeView === "reports" ? (
          <PieChart
            data={pieChartData}
            onClose={() => handleShowPieChart(false)}
          />
        ) : (
          <div className="empty-state">
            <div className="welcome-card">
              <div className="welcome-header">
                <h2>Welcome to CashFlow</h2>
                <p className="subtitle">Your personal finance companion</p>
              </div>

              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-icon-container">
                    <FiDollarSign className="feature-icon" />
                  </div>
                  <div className="feature-content">
                    <h4>Track Expenses</h4>
                    <p>Log and categorize your spending</p>
                  </div>
                </div>
                <div
                  className="feature-card clickable-feature"
                  onClick={() => handleShowPieChart(true)}
                >
                  <div className="feature-icon-container">
                    <FiPieChart className="feature-icon" />
                  </div>
                  <div className="feature-content">
                    <h4>Visual Reports</h4>
                    <p>Beautiful charts of your data</p>
                  </div>
                </div>
              </div>

              <div className="cta-section">
                <button className="cta-button primary" onClick={handleCreate}>
                  <FiPlusCircle className="button-icon" />
                  Create Your First Transaction
                </button>

                {transactions.length > 0 && (
                  <button
                    className="cta-button secondary"
                    onClick={() => handleShowPieChart(true)}
                  >
                    <FiPieChart className="button-icon" />
                    View Expense Distribution
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
