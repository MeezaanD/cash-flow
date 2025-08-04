import React, { useState } from "react";
import { useSimpleApi } from "../hooks/useSimpleApi";
import { useSimpleAuth } from "../hooks/useSimpleAuth";
import { formatCurrency } from "../utils/formatCurrency";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  LogOut,
  Edit,
  Trash2,
} from "lucide-react";

const SimpleDashboard: React.FC = () => {
  const {
    transactions,
    loading,
    error,
    summary,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  } = useSimpleApi();
  const { user, logout } = useSimpleAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    title: "",
    category: "",
    description: "",
    amount: "",
  });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            style={{ fontSize: "18px", color: "#1f2937", marginBottom: "10px" }}
          >
            Loading your financial data...
          </div>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            Please wait while we fetch your transactions
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            maxWidth: "400px",
          }}
        >
          <h2 style={{ margin: "0 0 15px 0", color: "#1f2937" }}>
            Error loading data
          </h2>
          <p style={{ margin: "0 0 20px 0", color: "#6b7280" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            padding: "25px",
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "12px",
            border: "1px solid rgba(102, 126, 234, 0.1)",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: "#1f2937",
                fontSize: "28px",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Financial Dashboard
            </h1>
            <p
              style={{
                margin: "8px 0 0 0",
                color: "#6b7280",
                fontSize: "16px",
              }}
            >
              Welcome back, {user?.username}! 👋
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#fff",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.3)",
              }}
            >
              <Plus size={16} />
              Add Transaction
            </button>
            <button
              onClick={logout}
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "#fff",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px 0 rgba(239, 68, 68, 0.3)",
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderLeft: "4px solid #10b981",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                background: "rgba(16, 185, 129, 0.1)",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp size={24} color="#10b981" />
            </div>
            <h3
              style={{
                margin: "0 0 15px 0",
                color: "#1f2937",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Total Income
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: "bold",
                color: "#10b981",
              }}
            >
              {formatCurrency(summary.totalIncome)}
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderLeft: "4px solid #ef4444",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                background: "rgba(239, 68, 68, 0.1)",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingDown size={24} color="#ef4444" />
            </div>
            <h3
              style={{
                margin: "0 0 15px 0",
                color: "#1f2937",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Total Expenses
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: "bold",
                color: "#ef4444",
              }}
            >
              {formatCurrency(summary.totalExpenses)}
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(102, 126, 234, 0.2)",
              borderLeft: "4px solid #667eea",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                background: "rgba(102, 126, 234, 0.1)",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DollarSign size={24} color="#667eea" />
            </div>
            <h3
              style={{
                margin: "0 0 15px 0",
                color: "#1f2937",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Net Amount
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: "bold",
                color: "#667eea",
              }}
            >
              {formatCurrency(summary.netAmount)}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            border: "1px solid rgba(102, 126, 234, 0.1)",
          }}
        >
          <div
            style={{
              padding: "25px",
              borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
              background: "rgba(102, 126, 234, 0.05)",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#1f2937",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              Recent Transactions
            </h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ background: "rgba(102, 126, 234, 0.05)" }}>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
                      color: "#374151",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
                      color: "#374151",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Title
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
                      color: "#374151",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "right",
                      borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
                      color: "#374151",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "center",
                      borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
                      color: "#374151",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    style={{
                      borderBottom: "1px solid rgba(102, 126, 234, 0.05)",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(102, 126, 234, 0.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td
                      style={{
                        padding: "16px 20px",
                        color: "#6b7280",
                        fontSize: "14px",
                      }}
                    >
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        color: "#1f2937",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      {transaction.title}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        color: "#6b7280",
                        fontSize: "14px",
                      }}
                    >
                      {transaction.category}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        textAlign: "right",
                        fontWeight: "bold",
                        fontSize: "14px",
                        color:
                          transaction.type === "income" ? "#10b981" : "#ef4444",
                      }}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        textAlign: "center",
                      }}
                    >
                      <button
                        onClick={() => {
                          setEditingTransaction(transaction.id);
                          setFormData({
                            type: transaction.type,
                            title: transaction.title,
                            category: transaction.category,
                            description: transaction.description || "",
                            amount: transaction.amount.toString(),
                          });
                        }}
                        style={{
                          background:
                            "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          marginRight: "8px",
                          fontSize: "12px",
                          fontWeight: "500",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Edit size={12} />
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (
                            confirm(
                              "Are you sure you want to delete this transaction?"
                            )
                          ) {
                            await deleteTransaction(transaction.id);
                          }
                        }}
                        style={{
                          background:
                            "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "500",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Transaction Form */}
        {(showAddForm || editingTransaction) && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                padding: "30px",
                borderRadius: "16px",
                width: "90%",
                maxWidth: "500px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <h2
                style={{
                  margin: "0 0 25px 0",
                  color: "#1f2937",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                {editingTransaction ? "Edit Transaction" : "Add Transaction"}
              </h2>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const transactionData = {
                    type: formData.type,
                    title: formData.title,
                    category: formData.category,
                    description: formData.description,
                    amount: parseFloat(formData.amount),
                  };

                  if (editingTransaction) {
                    await updateTransaction(
                      editingTransaction,
                      transactionData
                    );
                    setEditingTransaction(null);
                  } else {
                    await addTransaction(transactionData);
                    setShowAddForm(false);
                  }

                  setFormData({
                    type: "expense",
                    title: "",
                    category: "",
                    description: "",
                    amount: "",
                  });
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#374151",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "income" | "expense",
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid rgba(102, 126, 234, 0.2)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      background: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#374151",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid rgba(102, 126, 234, 0.2)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      background: "rgba(255, 255, 255, 0.9)",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#374151",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid rgba(102, 126, 234, 0.2)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      background: "rgba(255, 255, 255, 0.9)",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#374151",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid rgba(102, 126, 234, 0.2)",
                      borderRadius: "8px",
                      minHeight: "80px",
                      resize: "vertical",
                      fontSize: "14px",
                      background: "rgba(255, 255, 255, 0.9)",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "25px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#374151",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid rgba(102, 126, 234, 0.2)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      background: "rgba(255, 255, 255, 0.9)",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingTransaction(null);
                      setFormData({
                        type: "expense",
                        title: "",
                        category: "",
                        description: "",
                        amount: "",
                      });
                    }}
                    style={{
                      background: "rgba(107, 114, 128, 0.1)",
                      color: "#6b7280",
                      border: "1px solid rgba(107, 114, 128, 0.2)",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#fff",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                      boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    {editingTransaction ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleDashboard;
