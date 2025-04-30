import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import "../styles/Sidebar.css";

interface SidebarProps {
  toggleSidebar: () => void;
  transactions: any[];
  onCreate: () => void;
  onSelect: (tx: any) => void;
  onDelete: (id: string) => void;
  selectedId: string | null;
  collapsed: boolean;
}

const Sidebar = ({ onCreate, onSelect, onDelete, transactions, selectedId, collapsed, toggleSidebar }: SidebarProps) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Top section: Logo and Collapse Button */}
      <div className="sidebar-top">
        <div className="logo">App Logo</div>
        {!collapsed && (
          <button className="toggle-button" onClick={toggleSidebar}>☰</button>
        )}
      </div>

      {/* List of Transactions */}
      <div className="transaction-list">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className={`transaction-item ${selectedId === tx.id ? "selected" : ""}`}
          >
            <span onClick={() => onSelect(tx)} className="transaction-title">
              {tx.title}
            </span>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete this transaction?")) {
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

      {/* Bottom section: User Info */}
      <div className="sidebar-bottom">
        {user ? (
          <>
            <div className="user-avatar">
              {user.email?.[0]?.toUpperCase()}
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