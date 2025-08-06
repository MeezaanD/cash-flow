import React, { useState, useMemo } from "react";
import { FiDollarSign, FiPieChart, FiPlusCircle } from "react-icons/fi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { useTransactions } from "../hooks/useTransactions";
import { Transaction, ViewType, DateRange } from "../types";
import { useThemeVariant } from "@/hooks/useThemeVariant";
import { filterTransactionsByDateRangeObject } from "../utils/dateRangeFilter";
import PieChart from "../components/PieChart";
import Sidebar from "../components/Sidebar";
import ThemeDropdown from "../components/ThemeDropdown";
import TransactionForm from "../components/TransactionForm";
import TransactionsTable from "../components/TransactionsTable";
import AuthModals from "../components/AuthModals";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const styles = useThemeVariant();
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions();

  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [isCreating, setIsCreating] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    return filterTransactionsByDateRangeObject(transactions, dateRange);
  }, [transactions, dateRange]);

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

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete);
        if (selectedTransactionId === transactionToDelete) {
          setSelectedTx(null);
          setSelectedTransactionId(null);
        }
      } catch (err: any) {
        setError("Failed to delete transaction. Please try again.");
        setShowError(true);
      }
    }
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const handleCloseForm = () => {
    setSelectedTx(null);
    setSelectedTransactionId(null);
    setIsCreating(false);
    setActiveView("dashboard");
  };

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

  const handleShowPieChart = (show: boolean) => {
    if (show) {
      setActiveView("reports");
    } else {
      setActiveView("dashboard");
    }
  };

  const handleFormSubmit = async (
    data: Omit<Transaction, "id" | "date" | "createdAt">
  ) => {
    try {
      await addTransaction(data);
      handleCloseForm();
    } catch (err: any) {
      setError("Failed to create transaction. Please try again.");
      setShowError(true);
    }
  };

  const handleFormUpdate = async (
    data: Omit<Transaction, "id" | "date" | "createdAt">
  ) => {
    if (selectedTx?.id) {
      try {
        await updateTransaction(selectedTx.id, data);
        handleCloseForm();
      } catch (err: any) {
        setError("Failed to update transaction. Please try again.");
        setShowError(true);
      }
    }
  };

  const handleCloseError = () => {
    setShowError(false);
    setError(null);
  };

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthClose = () => {
    setAuthModalOpen(false);
  };

  const handleAuthModeChange = (newMode: "login" | "register") => {
    setAuthMode(newMode);
  };

  const pieChartData = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    filteredTransactions.forEach((tx) => {
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
  }, [filteredTransactions]);

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

  return (
    <div
      className="dashboard-wrapper"
      style={{ background: styles.cardBg, color: styles.textPrimary }}
    >
      <ThemeDropdown />
      <Sidebar
        collapsed={!sidebarVisible}
        toggleSidebar={toggleSidebar}
        transactions={transactions}
        onCreate={handleCreate}
        onSelect={handleSelect}
        onDelete={handleDeleteClick}
        selectedId={selectedTransactionId}
        activeView={activeView}
        onViewChange={(view: string) => setActiveView(view as ViewType)}
        onAuthClick={handleAuthClick}
      />

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <AuthModals
        open={authModalOpen}
        onClose={handleAuthClose}
        mode={authMode}
        onModeChange={handleAuthModeChange}
      />

      <div
        className={`dashboard-content ${sidebarVisible ? "" : "full-width"}`}
        style={{
          background: styles.cardBg,
          transition: "all 0.3s ease",
        }}
      >
        {!sidebarVisible && (
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            style={{
              color: "#ffffff",
              borderColor: styles.cardBorder,
            }}
          >
            ☰ Open Sidebar
          </button>
        )}

        {activeView === "transaction" ? (
          isCreating ? (
            <TransactionForm
              onClose={handleCloseForm}
              onSubmit={handleFormSubmit}
            />
          ) : selectedTx ? (
            <TransactionForm
              transaction={selectedTx}
              onClose={handleCloseForm}
              onSubmit={handleFormUpdate}
            />
          ) : null
        ) : activeView === "reports" ? (
          <PieChart
            data={pieChartData}
            onClose={() => handleShowPieChart(false)}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        ) : activeView === "table" ? (
          <TransactionsTable
            transactions={filteredTransactions}
            onDelete={handleDeleteClick}
            onSelect={handleSelect}
            selectedId={selectedTransactionId}
          />
        ) : (
          <div className="empty-state" style={{ color: styles.textPrimary }}>
            <div
              className="welcome-card"
              style={{
                background: styles.cardBg,
                borderColor: styles.cardBorder,
              }}
            >
              <div className="welcome-header">
                <h2>Welcome to CashFlow</h2>
                <p className="subtitle" style={{ color: styles.textSecondary }}>
                  Your personal finance companion
                </p>
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

              <div className="cTa-section">
                <button
                  className="cTa-button primary"
                  onClick={handleCreate}
                  style={{
                    background: styles.accentPrimary,
                    color: "#fff",
                  }}
                >
                  <FiPlusCircle className="button-icon" />
                  Create Your First Transaction
                </button>

                {transactions.length > 0 && (
                  <button
                    className="cTa-button secondary"
                    onClick={() => handleShowPieChart(true)}
                    style={{
                      border: `1px solid ${styles.accentPrimary}`,
                      color: styles.accentPrimary,
                    }}
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
