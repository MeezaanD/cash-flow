import { auth } from "./firebase";
import { loginUser } from "./api";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import { storeToken, storeUser, clearAuth, StoredUser } from "../utils/jwt";
import { LoginRequest } from "../types/api";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firebaseUser?: FirebaseUser;
}

export class AuthService {
  // Login with username/password (calls your API)
  async loginWithCredentials(credentials: LoginRequest): Promise<AuthUser> {
    try {
      const response = await loginUser(credentials);

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

  // Login with Firebase (existing functionality)
  async loginWithFirebase(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // For Firebase users, we'll create a mock API user
      // In a real app, you'd call your API to get/create a user record
      const apiUser: StoredUser = {
        id: firebaseUser.uid,
        username: firebaseUser.email?.split("@")[0] || "user",
        email: firebaseUser.email || "",
      };

      // Generate a mock token for Firebase users
      const mockToken = this.generateMockTokenForFirebase(firebaseUser.uid);
      storeToken(mockToken);
      storeUser(apiUser);

      return {
        id: apiUser.id,
        username: apiUser.username,
        email: apiUser.email,
        firebaseUser,
      };
    } catch (error) {
      clearAuth();
      throw error;
    }
  }

  // Generate mock token for Firebase users
  private generateMockTokenForFirebase(uid: string): string {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        sub: uid,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
        firebase: true,
      })
    );
    const signature = btoa("mock-signature");

    return `${header}.${payload}.${signature}`;
  }

  // Logout (clears both Firebase and API auth)
  async logout(): Promise<void> {
    try {
      // Sign out from Firebase
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Firebase logout error:", error);
    } finally {
      // Clear all authentication data
      clearAuth();
    }
  }

  // Get current authenticated user
  getCurrentUser(): AuthUser | null {
    const { getUser } = require("../utils/jwt");
    const storedUser = getUser();
    if (!storedUser) return null;

    return {
      id: storedUser.id,
      username: storedUser.username,
      email: storedUser.email,
    };
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const { isAuthenticated } = require("../utils/jwt");
    return isAuthenticated();
  }
}

// Export singleton instance
export const authService = new AuthService();
