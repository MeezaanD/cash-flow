import { useState, useEffect } from "react";
import {
  simpleAuthService,
  SimpleAuthUser,
} from "../services/simpleAuthService";
import { isAuthenticated, getUser } from "../utils/jwt";

export const useSimpleAuth = () => {
  const [user, setUser] = useState<SimpleAuthUser | null>(null);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication state on mount
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const currentUser = getUser();

      setIsAuthenticatedState(authenticated);
      setUser(
        currentUser
          ? {
              id: currentUser.id,
              username: currentUser.username,
              email: currentUser.email,
            }
          : null
      );
      setLoading(false);
    };

    checkAuth();

    // Set up interval to check auth state periodically
    const interval = setInterval(checkAuth, 5000);

    return () => clearInterval(interval);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const user = await simpleAuthService.login({ username, password });
      setUser(user);
      setIsAuthenticatedState(true);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await simpleAuthService.logout();
      setUser(null);
      setIsAuthenticatedState(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated: isAuthenticatedState,
    loading,
    login,
    logout,
  };
};
