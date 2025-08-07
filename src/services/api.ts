import { auth } from "./firebase";
import { getIdToken } from "firebase/auth";

// API response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Transaction interface
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense";
  date: string;
  createdAt: string;
  updatedAt: string;
}

// API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://us-central1-cash-flow-eb5bd.cloudfunctions.net";

class ApiService {
  private tokenCache: { token: string; expiresAt: number } | null = null;
  private readonly TOKEN_CACHE_DURATION = 50 * 60 * 1000; // 50 minutes (tokens expire in 1 hour)

  private async getAuthToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Check if we have a cached token that's still valid
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.token;
    }

    try {
      // Get token without forcing refresh first
      let token = await getIdToken(user, false);

      // If token is about to expire (within 10 minutes), refresh it
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const tokenExpiry = decodedToken.exp * 1000; // Convert to milliseconds
      const tenMinutesFromNow = Date.now() + 10 * 60 * 1000;

      if (tokenExpiry < tenMinutesFromNow) {
        // Token will expire soon, refresh it
        token = await getIdToken(user, true);
      }

      // Cache the token
      this.tokenCache = {
        token,
        expiresAt: Date.now() + this.TOKEN_CACHE_DURATION,
      };

      return token;
    } catch (error) {
      console.error("Error getting auth token:", error);

      // Clear cache on error
      this.tokenCache = null;

      if (error instanceof Error) {
        if (error.message.includes("quota-exceeded")) {
          throw new Error(
            "Authentication quota exceeded. Please try again in a few minutes."
          );
        } else if (error.message.includes("auth/network-request-failed")) {
          throw new Error(
            "Network error. Please check your internet connection."
          );
        } else if (error.message.includes("auth/user-token-expired")) {
          throw new Error("Your session has expired. Please log in again.");
        }
      }

      throw new Error("Failed to get authentication token");
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      console.error("API request failed:", error);

      if (error instanceof Error) {
        if (error.message.includes("No authenticated user")) {
          throw new Error("Please log in to access this feature");
        } else if (
          error.message.includes("Failed to get authentication token") ||
          error.message.includes("Authentication quota exceeded")
        ) {
          throw new Error(
            "Authentication failed. Please try logging in again."
          );
        } else if (error.message.includes("Invalid or expired token")) {
          throw new Error("Your session has expired. Please log in again.");
        } else if (error.message.includes("Network error")) {
          throw new Error(
            "Network error. Please check your connection and try again."
          );
        }
      }

      throw new Error("Failed to fetch data. Please try again later.");
    }
  }

  // Clear token cache (useful for logout or errors)
  public clearTokenCache(): void {
    this.tokenCache = null;
  }

  // Get user transactions
  async getUserTransactions(): Promise<Transaction[]> {
    const response = await this.makeRequest<Transaction[]>(
      "/getUserTransactions"
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch transactions");
    }

    return response.data || [];
  }

  // Health check
  async healthCheck(): Promise<{
    success: boolean;
    message: string;
    timestamp: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/healthCheck`);
    return response.json();
  }
}

export const apiService = new ApiService();
