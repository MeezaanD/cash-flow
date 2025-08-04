import React from "react";
import { Navigate } from "react-router-dom";
import { useSimpleAuth } from "../hooks/useSimpleAuth";

interface SimpleProtectedRouteProps {
  children: React.ReactNode;
}

const SimpleProtectedRoute: React.FC<SimpleProtectedRouteProps> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useSimpleAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f5f5f5",
        }}
      >
        <div>Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/simple-login" replace />;
  }

  return <>{children}</>;
};

export default SimpleProtectedRoute;
