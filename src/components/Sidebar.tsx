import { useState } from "react";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiX,
  FiArrowUp,
  FiArrowDown,
  FiPieChart,
  FiHome,
} from "react-icons/fi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { useThemeVariant } from "../hooks/useThemeVariant";
import { useTheme } from "../context/ThemeContext";
import { SidebarProps } from "../types";
import logoDark from "../assets/images/dark-transparent-image.png";
import logoLight from "../assets/images/white-transparent-image.png";
import "../styles/Sidebar.css";

const Sidebar = ({
  onCreate,
  onSelect,
  onDelete,
  transactions,
  selectedId,
  collapsed,
  toggleSidebar,
  onViewChange,
  activeView,
}: SidebarProps & {
  onViewChange: (view: string) => void;
  activeView: string;
}) => {
  const currentUser = useAuth();
  const { theme } = useTheme();
  const styles = useThemeVariant();
  const themeVariant = useThemeVariant();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"logout" | "delete">("logout");
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );

  const logo = theme === "dark" ? logoLight : logoDark;

  const handleLogoutClick = () => {
    setDialogType("logout");
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDialogType("delete");
    setTransactionToDelete(id);
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (dialogType === "logout") {
      await signOut(auth);
      localStorage.removeItem("token");
      navigate("/login");
    } else if (dialogType === "delete" && transactionToDelete) {
      onDelete(transactionToDelete);
    }
    setDialogOpen(false);
  };

  const handleCancelAction = () => {
    setDialogOpen(false);
    setTransactionToDelete(null);
  };

  const parseDbDate = (dateInput: unknown): Date => {
    if (
      typeof dateInput === "object" &&
      dateInput !== null &&
      "toDate" in dateInput
    ) {
      return (dateInput as { toDate: () => Date }).toDate();
    }
    if (dateInput instanceof Date) return dateInput;
    if (typeof dateInput === "string") {
      const dateOnly = dateInput.split(" at ")[0];
      return new Date(dateOnly);
    }
    return new Date();
  };

  const formatDisplayDate = (dateInput: unknown) => {
    try {
      const date = parseDbDate(dateInput);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", dateInput, e);
      return "N/A";
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = parseDbDate(a.date ?? a.createdAt);
    const dateB = parseDbDate(b.date ?? b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  const filteredTransactions = sortedTransactions.filter((tx) =>
    tx.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      style={{
        background: styles.sidebarBg,
        borderRight: `1px solid ${styles.sidebarBorder}`,
        color: styles.textPrimary,
      }}
    >
      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCancelAction}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogType === "logout" ? "Confirm Logout" : "Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogType === "logout"
              ? "Are you sure you want to logout?"
              : "Are you sure you want to delete this transaction?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAction} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            color={dialogType === "logout" ? "primary" : "error"}
            autoFocus
          >
            {dialogType === "logout" ? "Logout" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <div className="sidebar-header">
        <img className="logo" src={logo} alt="CashFlow Logo" />
        {!collapsed && (
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            {collapsed ? "☰" : "✕"}
          </button>
        )}
      </div>

      {/* Navigation & Search */}
      {!collapsed && (
        <>
          <div className="sidebar-nav">
            {["dashboard", "reports", "table"].map((view) => {
              const isActive = activeView === view;
              const isDark = theme === "dark";
              const activeColor = isDark ? "#ffffff" : "#1a202c";
              const inactiveColor = themeVariant.textSecondary;

              const iconMap: Record<string, IconType> = {
                dashboard: FiHome,
                reports: FiPieChart,
                table: FiSearch,
              };

              const IconComponent = iconMap[view];

              return (
                <button
                  key={view}
                  className={`nav-btn ${isActive ? "active" : ""}`}
                  onClick={() => onViewChange(view)}
                >
                  <IconComponent
                    className="nav-icon"
                    style={{ color: isActive ? activeColor : inactiveColor }}
                  />
                  <span
                    style={{ color: isActive ? activeColor : inactiveColor }}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{
                background: styles.cardBg,
                color: styles.textPrimary,
                border: `1px solid ${styles.cardBorder}`,
              }}
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                style={{ color: styles.textSecondary }}
              >
                <FiX />
              </button>
            )}
          </div>
        </>
      )}

      {/* Transactions */}
      <div className="sidebar-content">
        <div className="transactions-container">
          {filteredTransactions.length > 0 ? (
            <div className="transactions-list">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`transaction-card ${selectedId === tx.id ? "selected" : ""}`}
                  onClick={() => onSelect(tx)}
                  style={{
                    background:
                      selectedId === tx.id ? styles.activeBg : "transparent",
                    borderColor:
                      selectedId === tx.id
                        ? styles.accentPrimary
                        : "transparent",
                  }}
                >
                  <div className="transaction-content">
                    <h4
                      className="transaction-title"
                      style={{ color: styles.textPrimary }}
                    >
                      {tx.title}
                    </h4>
                    <div className="transaction-details">
                      <span
                        className="amount"
                        style={{
                          color:
                            tx.type === "income"
                              ? styles.incomeColor
                              : styles.expenseColor,
                        }}
                      >
                        {tx.type === "income" ? (
                          <FiArrowUp className="amount-icon" />
                        ) : (
                          <FiArrowDown className="amount-icon" />
                        )}
                        R{tx.amount.toFixed(2)}
                      </span>
                      <span
                        className="transaction-date"
                        style={{ color: styles.textSecondary }}
                      >
                        {formatDisplayDate(tx.date ?? tx.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (tx.id) handleDeleteClick(tx.id);
                    }}
                    aria-label="Delete transaction"
                    style={{ color: styles.textSecondary }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="empty-state"
              style={{ color: styles.textSecondary }}
            >
              {searchTerm ? "No matching transactions" : "No transactions yet"}
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            className="new-transaction-btn"
            onClick={onCreate}
            style={{
              background: styles.accentPrimary,
              color: "#fff",
            }}
          >
            <FiPlus className="btn-icon" />
            New Transaction
          </button>
        )}
      </div>

      {/* User */}
      <div
        className="user-section"
        style={{ borderTopColor: styles.sidebarBorder }}
      >
        {currentUser ? (
          <div className="user-info">
            <div
              className="user-avatar"
              style={{ background: styles.accentPrimary }}
            >
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="User" />
              ) : (
                <span>{currentUser.email?.[0]?.toUpperCase() ?? "?"}</span>
              )}
            </div>
            <div className="user-details">
              <p className="user-email" style={{ color: styles.textSecondary }}>
                {currentUser.email ?? "User"}
              </p>
              <button
                className="logout-btn"
                onClick={handleLogoutClick}
                style={{
                  color: styles.textSecondary,
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
            style={{
              background: styles.accentPrimary,
              color: "#fff",
            }}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
