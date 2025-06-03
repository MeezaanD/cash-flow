import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import "../styles/Sidebar.css";
import logo from "../assets/images/dark-transparent-image.png";

interface SidebarProps {
  toggleSidebar: () => void;
  transactions: any[];
  onCreate: () => void;
  onSelect: (tx: any) => void;
  onDelete: (id: string) => void;
  selectedId: string | null;
  collapsed: boolean;
}

/**
 * Sidebar component for displaying and managing transactions and user authentication state.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {() => void} props.onCreate - Callback invoked when the "Create Transaction" button is clicked.
 * @param {(transaction: Transaction) => void} props.onSelect - Callback invoked when a transaction is selected.
 * @param {(id: string) => void} props.onDelete - Callback invoked when a transaction is deleted.
 * @param {Transaction[]} props.transactions - Array of transaction objects to display in the sidebar.
 * @param {string | null} props.selectedId - ID of the currently selected transaction.
 * @param {boolean} props.collapsed - Whether the sidebar is collapsed.
 * @param {() => void} props.toggleSidebar - Callback to toggle the sidebar's collapsed state.
 *
 * @returns {JSX.Element} The rendered sidebar component.
 *
 * @remarks
 * - Displays a list of transactions with options to select or delete each.
 * - Allows creation of new transactions.
 * - Shows user authentication state, avatar, and logout/login options.
 * - Uses Firebase authentication to track user state.
 * - Navigates to login page on logout or when user is not authenticated.
 */
const Sidebar = ({
  onCreate,
  onSelect,
  onDelete,
  transactions,
  selectedId,
  collapsed,
  toggleSidebar,
}: SidebarProps) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await signOut(auth);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <img className="logo" src={logo} alt="" />
        {!collapsed && (
          <button className="toggle-button" onClick={toggleSidebar}>
            ☰
          </button>
        )}
      </div>

      <div className="transaction-list">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className={`transaction-item ${
              selectedId === tx.id ? "selected" : ""
            }`}
          >
            <span onClick={() => onSelect(tx)} className="transaction-title">
              {tx.title}
            </span>
            <button
              onClick={() => {
                if (
                  confirm("Are you sure you want to delete this transaction?")
                ) {
                  onDelete(tx.id);
                }
              }}
              className="delete-button"
              title="Delete"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="create-transaction">
        <button className="create-button" onClick={onCreate}>
          + Create Transaction
        </button>
      </div>

      <hr className="divider" />

      <div className="sidebar-bottom">
        {user ? (
          <>
            <div className="user-avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User Avatar" className="user-image" />
              ) : (
                user.email?.[0]?.toUpperCase()
              )}
            </div>
            <p className="user-email">{user.email}</p>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="login-button" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;