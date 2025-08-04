import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  FinancialData,
  Transaction,
} from "../types/api";

// Mock user database
const mockUsers = [
  {
    id: "1",
    username: "demo",
    password: "demo123",
    email: "demo@example.com",
  },
  {
    id: "2",
    username: "test",
    password: "test123",
    email: "test@example.com",
  },
];

// Mock financial data
const mockFinancialData: FinancialData = {
  transactions: [
    {
      id: "1",
      type: "expense",
      title: "Grocery Shopping",
      category: "Food & Dining",
      description: "Weekly groceries from supermarket",
      amount: 85.5,
      createdAt: "2024-01-15T10:30:00Z",
      userId: "1",
    },
    {
      id: "2",
      type: "income",
      title: "Salary",
      category: "Salary",
      description: "Monthly salary payment",
      amount: 3500.0,
      createdAt: "2024-01-01T09:00:00Z",
      userId: "1",
    },
    {
      id: "3",
      type: "expense",
      title: "Gas Station",
      category: "Transportation",
      description: "Fuel for car",
      amount: 45.0,
      createdAt: "2024-01-14T16:20:00Z",
      userId: "1",
    },
    {
      id: "4",
      type: "expense",
      title: "Netflix Subscription",
      category: "Entertainment",
      description: "Monthly streaming service",
      amount: 15.99,
      createdAt: "2024-01-10T12:00:00Z",
      userId: "1",
    },
    {
      id: "5",
      type: "income",
      title: "Freelance Project",
      category: "Freelance",
      description: "Web development project",
      amount: 800.0,
      createdAt: "2024-01-12T14:15:00Z",
      userId: "1",
    },
  ],
  summary: {
    totalIncome: 4300.0,
    totalExpenses: 146.49,
    netAmount: 4153.51,
  },
  categories: {
    income: [
      { category: "Salary", total: 3500.0, count: 1 },
      { category: "Freelance", total: 800.0, count: 1 },
    ],
    expenses: [
      { category: "Food & Dining", total: 85.5, count: 1 },
      { category: "Transportation", total: 45.0, count: 1 },
      { category: "Entertainment", total: 15.99, count: 1 },
    ],
  },
};

// Generate a simple JWT token
const generateToken = (userId: string, username: string): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      username: username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    })
  );
  const signature = btoa("mock-signature");

  return `${header}.${payload}.${signature}`;
};

// Validate JWT token
const validateToken = (
  token: string
): { valid: boolean; userId?: string; username?: string } => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false };
    }

    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;

    if (payload.exp < currentTime) {
      return { valid: false };
    }

    return {
      valid: true,
      userId: payload.sub,
      username: payload.username,
    };
  } catch (error) {
    return { valid: false };
  }
};

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class SimpleApiService {
  // 1. Authentication API - accepts username/password and returns JWT token
  async authenticate(
    credentials: LoginRequest
  ): Promise<ApiResponse<LoginResponse>> {
    await delay(1000); // Simulate network delay

    const user = mockUsers.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );

    if (!user) {
      return {
        success: false,
        error: "Invalid username or password",
      };
    }

    const token = generateToken(user.id, user.username);

    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
    };
  }

  // 2. Financial Data API - accepts JWT token and returns financial data
  async getFinancialData(
    authHeader: string
  ): Promise<ApiResponse<FinancialData>> {
    await delay(800); // Simulate network delay

    // Extract token from Authorization header
    const token = authHeader.replace("Bearer ", "");

    // Validate token
    const validation = validateToken(token);

    if (!validation.valid) {
      return {
        success: false,
        error: "Invalid or expired token",
      };
    }

    // Return financial data for the authenticated user
    return {
      success: true,
      data: mockFinancialData,
    };
  }

  // Transaction APIs
  async addTransaction(
    transaction: Omit<Transaction, "id" | "createdAt" | "userId">
  ): Promise<ApiResponse<Transaction>> {
    await delay(500);

    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: "1", // Mock user ID
    };

    // Add to mock data
    mockFinancialData.transactions.push(newTransaction);

    // Update summary
    if (transaction.type === "income") {
      mockFinancialData.summary.totalIncome += transaction.amount;
    } else {
      mockFinancialData.summary.totalExpenses += transaction.amount;
    }
    mockFinancialData.summary.netAmount =
      mockFinancialData.summary.totalIncome -
      mockFinancialData.summary.totalExpenses;

    return {
      success: true,
      data: newTransaction,
    };
  }

  async updateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<ApiResponse<Transaction>> {
    await delay(500);

    const index = mockFinancialData.transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    const oldTransaction = mockFinancialData.transactions[index];
    const updatedTransaction = { ...oldTransaction, ...updates };

    // Update summary if amount or type changed
    if (updates.amount !== undefined || updates.type !== undefined) {
      // Remove old transaction from summary
      if (oldTransaction.type === "income") {
        mockFinancialData.summary.totalIncome -= oldTransaction.amount;
      } else {
        mockFinancialData.summary.totalExpenses -= oldTransaction.amount;
      }

      // Add new transaction to summary
      if (updatedTransaction.type === "income") {
        mockFinancialData.summary.totalIncome += updatedTransaction.amount;
      } else {
        mockFinancialData.summary.totalExpenses += updatedTransaction.amount;
      }

      mockFinancialData.summary.netAmount =
        mockFinancialData.summary.totalIncome -
        mockFinancialData.summary.totalExpenses;
    }

    mockFinancialData.transactions[index] = updatedTransaction;

    return {
      success: true,
      data: updatedTransaction,
    };
  }

  async deleteTransaction(
    id: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    await delay(500);

    const index = mockFinancialData.transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    const transaction = mockFinancialData.transactions[index];

    // Update summary
    if (transaction.type === "income") {
      mockFinancialData.summary.totalIncome -= transaction.amount;
    } else {
      mockFinancialData.summary.totalExpenses -= transaction.amount;
    }
    mockFinancialData.summary.netAmount =
      mockFinancialData.summary.totalIncome -
      mockFinancialData.summary.totalExpenses;

    // Remove from transactions
    mockFinancialData.transactions.splice(index, 1);

    return {
      success: true,
      data: { success: true },
    };
  }
}

// Export singleton instance
export const simpleApiService = new SimpleApiService();
