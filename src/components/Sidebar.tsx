import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import "../styles/Sidebar.css";
import logo from "../assets/images/logo.png";

interface SidebarProps {
  toggleSidebar: () => void;
  transactions: any[];
  onCreate: () => void;
  onSelect: (tx: any) => void;
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
        <img className="logo" src={logo} alt="" />
        {!collapsed && (
          <button className="toggle-button" onClick={toggleSidebar}>
            ☰
          </button>
        )}
      </div>

      {/* List of Transactions */}
      {/* List of Transactions */}
      <div className="transaction-list">
        {transactions.map((tx) => {
          const createdAt = tx.createdAt
            ? new Date(tx.createdAt.seconds * 1000).toLocaleDateString()
            : "Unknown Date";

          return (
            <div
              key={tx.id}
              className={`transaction-item ${
                selectedId === tx.id ? "selected" : ""
              }`}
            >
              <div className="transaction-content" onClick={() => onSelect(tx)}>
                <div className="transaction-title">{tx.title}</div>
                <div className="transaction-meta">
                  <span>{createdAt}</span> -{" "}
                  <span>R{parseFloat(tx.amount).toFixed(2)}</span>
                </div>
              </div>
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
          );
        })}
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
