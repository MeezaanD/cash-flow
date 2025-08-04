import React, { useState } from "react";
import { authService } from "../services/authService";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [loginMethod, setLoginMethod] = useState<"api" | "firebase">("api");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API Login Form State
  const [apiCredentials, setApiCredentials] = useState({
    username: "",
    password: "",
  });

  // Firebase Login Form State
  const [firebaseCredentials, setFirebaseCredentials] = useState({
    email: "",
    password: "",
  });

  const handleApiLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.loginWithCredentials(apiCredentials);
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.loginWithFirebase(
        firebaseCredentials.email,
        firebaseCredentials.password
      );
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      {/* Login Method Toggle */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setLoginMethod("api")}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            loginMethod === "api"
              ? "bg-blue-500 text-white"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          API Login
        </button>
        <button
          type="button"
          onClick={() => setLoginMethod("firebase")}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            loginMethod === "firebase"
              ? "bg-blue-500 text-white"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Firebase Login
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loginMethod === "api" ? (
        // API Login Form
        <form onSubmit={handleApiLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={apiCredentials.username}
              onChange={(e) =>
                setApiCredentials((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={apiCredentials.password}
              onChange={(e) =>
                setApiCredentials((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login with API"}
          </button>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-2">Demo credentials:</p>
            <p className="text-xs text-gray-500">Username: demo</p>
            <p className="text-xs text-gray-500">Password: demo123</p>
          </div>
        </form>
      ) : (
        // Firebase Login Form
        <form onSubmit={handleFirebaseLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={firebaseCredentials.email}
              onChange={(e) =>
                setFirebaseCredentials((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={firebaseCredentials.password}
              onChange={(e) =>
                setFirebaseCredentials((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login with Firebase"}
          </button>
        </form>
      )}
    </div>
  );
};
