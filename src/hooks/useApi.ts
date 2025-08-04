import { useState, useEffect } from "react";
import { getFinancialData } from "../services/api";
import { FinancialData } from "../types/api";
import { isAuthenticated } from "../utils/jwt";

export const useApi = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinancialData = async () => {
    if (!isAuthenticated()) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getFinancialData();

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

  return {
    financialData,
    loading,
    error,
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
  };
};
