import { LoginRequest } from "../types/api";
import { simpleApiService } from "./simpleApi";
import {
  storeToken,
  storeUser,
  clearAuth,
  getToken,
  getUser,
} from "../utils/jwt";

export interface SimpleAuthUser {
  id: string;
  username: string;
  email: string;
}

export class SimpleAuthService {
  // Login with username/password
  async login(credentials: LoginRequest): Promise<SimpleAuthUser> {
    try {
      const response = await simpleApiService.authenticate(credentials);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Login failed");
      }

      const { token, user } = response.data;

      // Store the JWT token and user data
      storeToken(token);
      storeUser(user);

      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    } catch (error) {
      clearAuth();
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    clearAuth();
  }

  // Get current authenticated user
  getCurrentUser(): SimpleAuthUser | null {
    const storedUser = getUser();
    return storedUser
      ? {
          id: storedUser.id,
          username: storedUser.username,
          email: storedUser.email,
        }
      : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = getToken();
    if (!token) return false;

    try {
      // Basic token validation
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      clearAuth();
      return false;
    }
  }

  // Get authorization header for API requests
  getAuthHeader(): { Authorization: string } | {} {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Export singleton instance
export const simpleAuthService = new SimpleAuthService();
