import { useState, useEffect } from "react";
import { simpleApiService } from "../services/simpleApi";
import { FinancialData, Transaction } from "../types/api";
import { simpleAuthService } from "../services/simpleAuthService";

export const useSimpleApi = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);

  const fetchFinancialData = async () => {
    if (!simpleAuthService.isAuthenticated()) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authHeader = simpleAuthService.getAuthHeader();
      const response = await simpleApiService.getFinancialData(
        "Authorization" in authHeader ? authHeader.Authorization : ""
      );

      if (response.success && response.data) {
        setFinancialData(response.data);
      } else {
        setError(response.error || "Failed to fetch financial data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchFinancialData();
  }, []);

  // Refresh data
  const refreshData = () => {
    fetchFinancialData();
  };

  // Transaction methods
  const addTransaction = async (transaction: {
    type: "income" | "expense";
    title: string;
    category: string;
    description?: string;
    amount: number;
  }) => {
    setTransactionLoading(true);
    setTransactionError(null);

    try {
      const response = await simpleApiService.addTransaction(transaction);
      if (response.success) {
        await refreshData();
        return { success: true };
      } else {
        setTransactionError(response.error || "Failed to add transaction");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add transaction";
      setTransactionError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setTransactionLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setTransactionLoading(true);
    setTransactionError(null);

    try {
      const response = await simpleApiService.deleteTransaction(id);
      if (response.success) {
        await refreshData();
        return { success: true };
      } else {
        setTransactionError(response.error || "Failed to delete transaction");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete transaction";
      setTransactionError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setTransactionLoading(false);
    }
  };

  const updateTransaction = async (
    id: string,
    updates: Partial<Transaction>
  ) => {
    setTransactionLoading(true);
    setTransactionError(null);

    try {
      const response = await simpleApiService.updateTransaction(id, updates);
      if (response.success) {
        await refreshData();
        return { success: true };
      } else {
        setTransactionError(response.error || "Failed to update transaction");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update transaction";
      setTransactionError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setTransactionLoading(false);
    }
  };

  return {
    financialData,
    loading: loading || transactionLoading,
    error: error || transactionError,
    refreshData,
    transactions: financialData?.transactions || [],
    summary: financialData?.summary || {
      totalIncome: 0,
      totalExpenses: 0,
      netAmount: 0,
    },
    categories: financialData?.categories || {
      income: [],
      expenses: [],
    },
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };
};
