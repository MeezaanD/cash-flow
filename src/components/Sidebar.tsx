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
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import logoDark from "../assets/images/dark-transparent-image.png";
import logoLight from "../assets/images/white-transparent-image.png";
import "../styles/Sidebar.css";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date?: Date | { toDate: () => Date };
  createdAt?: Date | { toDate: () => Date };
}

interface SidebarProps {
  toggleSidebar: () => void;
  transactions: Transaction[];
  onCreate: () => void;
  isCreating: boolean;
  onSelect: (tx: Transaction | null) => void;
  onDelete: (id: string) => void;
  selectedId: string | null;
  collapsed: boolean;
  onShowPieChart: (show: boolean) => void;
  showPieChart: boolean;
}

const Sidebar = ({
  onCreate,
  isCreating,
  onSelect,
  onDelete,
  transactions,
  selectedId,
  collapsed,
  toggleSidebar,
  onShowPieChart,
  showPieChart,
}: SidebarProps) => {
  const currentUser = useAuth();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const logo = theme === "dark" ? logoLight : logoDark;

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await signOut(auth);
      localStorage.removeItem("token");
      navigate("/login");
    }
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
              className={`nav-btn ${
                !showPieChart && !selectedId && !isCreating ? "active" : ""
              }`}
              onClick={() => {
                onSelect(null);
                onShowPieChart(false);
              }}
            >
              <FiHome className="nav-icon" />
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-btn ${showPieChart ? "active" : ""}`}
              onClick={() => onShowPieChart(true)}
            >
              <FiPieChart className="nav-icon" />
              <span>Reports</span>
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
                  className={`transaction-card ${
                    selectedId === tx.id ? "selected" : ""
                  }`}
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
                      if (confirm("Delete this transaction?")) {
                        onDelete(tx.id);
                      }
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
              <button className="logout-btn" onClick={handleLogout}>
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
