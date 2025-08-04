import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  FinancialData,
  Transaction,
} from "../types/api";
import { getAuthHeader } from "../utils/jwt";

// Mock data for demonstration
const mockUsers = [
  { username: "demo", password: "demo123", id: "1", email: "demo@example.com" },
  { username: "test", password: "test123", id: "2", email: "test@example.com" },
];

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    title: "Salary",
    category: "Salary",
    description: "Monthly salary",
    amount: 5000,
    createdAt: new Date().toISOString(),
    userId: "1",
  },
  {
    id: "2",
    type: "expense",
    title: "Rent",
    category: "Housing",
    description: "Monthly rent payment",
    amount: 1200,
    createdAt: new Date().toISOString(),
    userId: "1",
  },
  {
    id: "3",
    type: "expense",
    title: "Groceries",
    category: "Food",
    description: "Weekly groceries",
    amount: 150,
    createdAt: new Date().toISOString(),
    userId: "1",
  },
  {
    id: "4",
    type: "income",
    title: "Freelance Work",
    category: "Freelance",
    description: "Web development project",
    amount: 800,
    createdAt: new Date().toISOString(),
    userId: "1",
  },
];

// Generate a mock JWT token
const generateMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      username: mockUsers.find((u) => u.id === userId)?.username,
    })
  );
  const signature = btoa("mock-signature");

  return `${header}.${payload}.${signature}`;
};

// Mock API Client
class ApiClient {
  constructor() {}

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock API responses
      if (endpoint === "/auth/login" && options.method === "POST") {
        const body = JSON.parse(options.body as string);
        const user = mockUsers.find(
          (u) => u.username === body.username && u.password === body.password
        );

        if (user) {
          const token = generateMockToken(user.id);
          return {
            success: true,
            data: {
              token,
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
              },
            } as T,
          };
        } else {
          return {
            success: false,
            error: "Invalid credentials",
          };
        }
      }

      if (endpoint === "/financial-data" && options.method === "GET") {
        // Check if user is authenticated
        const authHeader = getAuthHeader();
        if (!("Authorization" in authHeader)) {
          return {
            success: false,
            error: "Unauthorized",
          };
        }

        // Calculate summary data
        const totalIncome = mockTransactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = mockTransactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);

        // Calculate category summaries
        const incomeCategories = mockTransactions
          .filter((t) => t.type === "income")
          .reduce((acc, t) => {
            const existing = acc.find((c) => c.category === t.category);
            if (existing) {
              existing.total += t.amount;
              existing.count += 1;
            } else {
              acc.push({ category: t.category, total: t.amount, count: 1 });
            }
            return acc;
          }, [] as any[]);

        const expenseCategories = mockTransactions
          .filter((t) => t.type === "expense")
          .reduce((acc, t) => {
            const existing = acc.find((c) => c.category === t.category);
            if (existing) {
              existing.total += t.amount;
              existing.count += 1;
            } else {
              acc.push({ category: t.category, total: t.amount, count: 1 });
            }
            return acc;
          }, [] as any[]);

        return {
          success: true,
          data: {
            transactions: mockTransactions,
            summary: {
              totalIncome,
              totalExpenses,
              netAmount: totalIncome - totalExpenses,
            },
            categories: {
              income: incomeCategories,
              expenses: expenseCategories,
            },
          } as T,
        };
      }

      // Default error response
      return {
        success: false,
        error: "Endpoint not found",
      };
    } catch (error) {
      return {
        success: false,
        error: "Network error",
      };
    }
  }

  // Authentication API
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  // Financial Data API
  async getFinancialData(): Promise<ApiResponse<FinancialData>> {
    return this.request<FinancialData>("/financial-data", {
      method: "GET",
    });
  }

  // Transaction APIs
  async addTransaction(
    transaction: Omit<Transaction, "id" | "createdAt" | "userId">
  ): Promise<ApiResponse<Transaction>> {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: "1", // Mock user ID
    };

    // Add to mock data
    mockTransactions.push(newTransaction);

    return this.request<Transaction>("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<ApiResponse<Transaction>> {
    const index = mockTransactions.findIndex((t) => t.id === id);
    if (index === -1) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    mockTransactions[index] = { ...mockTransactions[index], ...updates };

    return this.request<Transaction>(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteTransaction(
    id: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    const index = mockTransactions.findIndex((t) => t.id === id);
    if (index === -1) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    mockTransactions.splice(index, 1);

    return this.request<{ success: boolean }>(`/transactions/${id}`, {
      method: "DELETE",
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export individual API functions for easier use
export const loginUser = (credentials: LoginRequest) =>
  apiClient.login(credentials);
export const getFinancialData = () => apiClient.getFinancialData();
export const addTransaction = (
  transaction: Omit<Transaction, "id" | "createdAt" | "userId">
) => apiClient.addTransaction(transaction);
export const updateTransaction = (id: string, updates: Partial<Transaction>) =>
  apiClient.updateTransaction(id, updates);
export const deleteTransaction = (id: string) =>
  apiClient.deleteTransaction(id);
