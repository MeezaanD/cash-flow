import { useState } from "react";
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
    if (dateInput instanceof Date) {
      return dateInput;
    }
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
    <div className={`sidebar ${collapsed ? "collapsed" : ""} theme-${theme}`}>
      {/* Confirmation Dialog */}
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

      <div className="sidebar-header">
        <img className="logo" src={logo} alt="CashFlow Logo" />
        {!collapsed && (
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            {collapsed ? "☰" : "✕"}
          </button>
        )}
      </div>

      {!collapsed && (
        <>
          <div className="sidebar-nav">
            <button
              className={`nav-btn ${activeView === "dashboard" ? "active" : ""}`}
              onClick={() => onViewChange("dashboard")}
            >
              <FiHome className="nav-icon" />
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-btn ${activeView === "reports" ? "active" : ""}`}
              onClick={() => onViewChange("reports")}
            >
              <FiPieChart className="nav-icon" />
              <span>Reports</span>
            </button>
            <button
              className={`nav-btn ${activeView === "table" ? "active" : ""}`}
              onClick={() => onViewChange("table")}
            >
              <FiSearch className="nav-icon" />
              <span>Transactions</span>
            </button>
          </div>

          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>
        </>
      )}

      <div className="sidebar-content">
        <div className="transactions-container">
          {filteredTransactions.length > 0 ? (
            <div className="transactions-list">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`transaction-card ${selectedId === tx.id ? "selected" : ""}`}
                  onClick={() => onSelect(tx)}
                >
                  <div className="transaction-content">
                    <h4 className="transaction-title">{tx.title}</h4>
                    <div className="transaction-details">
                      <span className={`amount ${tx.type}`}>
                        {tx.type === "income" ? (
                          <FiArrowUp className="amount-icon" />
                        ) : (
                          <FiArrowDown className="amount-icon" />
                        )}
                        R{tx.amount.toFixed(2)}
                      </span>
                      <span className="transaction-date">
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
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              {searchTerm ? "No matching transactions" : "No transactions yet"}
            </div>
          )}
        </div>

        {!collapsed && (
          <button className="new-transaction-btn" onClick={onCreate}>
            <FiPlus className="btn-icon" />
            New Transaction
          </button>
        )}
      </div>

      <div className="user-section">
        {currentUser ? (
          <div className="user-info">
            <div className="user-avatar">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="User" />
              ) : (
                <span>{currentUser.email?.[0]?.toUpperCase() ?? "?"}</span>
              )}
            </div>
            <div className="user-details">
              <p className="user-email">{currentUser.email ?? "User"}</p>
              <button className="logout-btn" onClick={handleLogoutClick}>
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
