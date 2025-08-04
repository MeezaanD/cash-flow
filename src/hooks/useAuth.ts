import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { AuthUser } from "../services/authService";
import { isAuthenticated, getUser } from "../utils/jwt";

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [apiUser, setApiUser] = useState<AuthUser | null>(null);
  const [isApiAuthenticated, setIsApiAuthenticated] = useState(false);

  useEffect(() => {
    // Check Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Check API authentication state
    const checkApiAuth = () => {
      const authenticated = isAuthenticated();
      const user = getUser();

      setIsApiAuthenticated(authenticated);
      setApiUser(
        user
          ? {
              id: user.id,
              username: user.username,
              email: user.email,
            }
          : null
      );
    };

    // Check immediately
    checkApiAuth();

    // Also check after a short delay to ensure localStorage is accessible
    const initialCheck = setTimeout(checkApiAuth, 50);

    // Set up interval to check API auth state
    const interval = setInterval(checkApiAuth, 5000); // Check every 5 seconds

    return () => {
      unsubscribe();
      clearTimeout(initialCheck);
      clearInterval(interval);
    };
  }, []);

  // Combined authentication state
  const isUserAuthenticated = currentUser !== null || isApiAuthenticated;
  const user = currentUser || apiUser;

  return {
    currentUser: user,
    isAuthenticated: isUserAuthenticated,
    isFirebaseUser: currentUser !== null,
    isApiUser: isApiAuthenticated,
  };
};
