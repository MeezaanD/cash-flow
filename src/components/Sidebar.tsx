import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { FiSearch, FiPlus, FiX, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import "../styles/Sidebar.css";
import logo from "../assets/images/dark-transparent-image.png";

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
  onSelect: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  selectedId: string | null;
  collapsed: boolean;
}

const Sidebar = ({
  onCreate,
  onSelect,
  onDelete,
  transactions,
  selectedId,
  collapsed,
  toggleSidebar,
}: SidebarProps) => {
  const currentUser = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await signOut(auth);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const parseDbDate = (dateInput: unknown): Date => {
    if (typeof dateInput === "object" && dateInput !== null && "toDate" in dateInput) {
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
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <img className="logo" src={logo} alt="CashFlow Logo" />
        {!collapsed && (
          <button className="toggle-button" onClick={toggleSidebar}>
            ☰
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="search-container">
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
              className="clear-search"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <FiX size={14} />
            </button>
          )}
        </div>
      )}

      <div className="transaction-list">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className={`transaction-item ${selectedId === tx.id ? "selected" : ""}`}
              onClick={() => onSelect(tx)}
            >
              <div className="transaction-content">
                <span className="transaction-title">{tx.title}</span>
                <div className="transaction-meta">
                  <span className={`transaction-amount ${tx.type}`}>
                    {tx.type === "income" ? (
                      <FiArrowUp className="amount-icon income" />
                    ) : (
                      <FiArrowDown className="amount-icon expense" />
                    )}
                    R {tx.amount.toFixed(2)}
                  </span>
                  <span className="transaction-date">
                    {formatDisplayDate(tx.date ?? tx.createdAt)}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this transaction?")) {
                    onDelete(tx.id);
                  }
                }}
                className="delete-button"
                title="Delete transaction"
                aria-label="Delete transaction"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <div className="no-transactions">
            {searchTerm ? "No matching transactions" : "No transactions yet"}
          </div>
        )}
      </div>

      <div className="create-transaction">
        <button className="create-button" onClick={onCreate}>
          <FiPlus className="button-icon" />
          Create Transaction
        </button>
      </div>

      <div className="sidebar-bottom">
        {currentUser ? (
          <>
            <div className="user-avatar">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="User Avatar"
                  className="user-image"
                />
              ) : (
                <span className="user-initial">
                  {currentUser.email?.[0]?.toUpperCase() ?? '?'}
                </span>
              )}
            </div>
            <p className="user-email">{currentUser.email ?? 'No email'}</p>
            <button
              className="logout-button"
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="login-button"
            onClick={() => navigate("/login")}
            aria-label="Login"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;