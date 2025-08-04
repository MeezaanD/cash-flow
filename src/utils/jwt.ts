// JWT Token Management Utilities

const JWT_TOKEN_KEY = "cashflow_jwt_token";
const JWT_USER_KEY = "cashflow_user_data";

export interface StoredUser {
  id: string;
  username: string;
  email: string;
}

// Store JWT token in localStorage
export const storeToken = (token: string): void => {
  localStorage.setItem(JWT_TOKEN_KEY, token);
};

// Retrieve JWT token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem(JWT_TOKEN_KEY);
};

// Remove JWT token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem(JWT_TOKEN_KEY);
};

// Store user data
export const storeUser = (user: StoredUser): void => {
  localStorage.setItem(JWT_USER_KEY, JSON.stringify(user));
};

// Retrieve user data
export const getUser = (): StoredUser | null => {
  const userData = localStorage.getItem(JWT_USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Remove user data
export const removeUser = (): void => {
  localStorage.removeItem(JWT_USER_KEY);
};

// Check if user is authenticated (has valid token)
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  // Basic token validation (you can add more sophisticated validation later)
  try {
    // Check if token is not expired (basic check)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    // If token is malformed, remove it
    removeToken();
    removeUser();
    return false;
  }
};

// Clear all authentication data
export const clearAuth = (): void => {
  removeToken();
  removeUser();
};

// Get authorization header for API requests
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
