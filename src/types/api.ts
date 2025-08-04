// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Authentication Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

// Financial Data Types
export interface FinancialData {
  transactions: Transaction[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
  };
  categories: {
    income: CategorySummary[];
    expenses: CategorySummary[];
  };
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  title: string;
  category: string;
  description?: string;
  amount: number;
  createdAt: string;
  userId: string;
}

export interface CategorySummary {
  category: string;
  total: number;
  count: number;
}

// API Error Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
