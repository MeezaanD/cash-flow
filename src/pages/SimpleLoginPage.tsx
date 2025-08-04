import React from "react";
import { SimpleLoginForm } from "../components/SimpleLoginForm";
import { useNavigate } from "react-router-dom";
import { DollarSign, Shield, TrendingUp } from "lucide-react";

const SimpleLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/simple-dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          maxWidth: "500px",
          width: "100%",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "15px",
              }}
            >
              <DollarSign size={28} color="white" />
            </div>
          </div>
          <h1
            style={{
              margin: "0 0 10px 0",
              color: "#1f2937",
              fontSize: "32px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            Sign in to access your financial dashboard
          </p>
        </div>

        <SimpleLoginForm onLoginSuccess={handleLoginSuccess} />

        {/* Feature highlights */}
        <div
          style={{
            marginTop: "40px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "15px",
              borderRadius: "12px",
              background: "rgba(102, 126, 234, 0.1)",
              border: "1px solid rgba(102, 126, 234, 0.2)",
            }}
          >
            <Shield size={20} color="#667eea" style={{ marginBottom: "8px" }} />
            <div
              style={{ fontSize: "12px", color: "#667eea", fontWeight: "600" }}
            >
              Secure
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "15px",
              borderRadius: "12px",
              background: "rgba(118, 75, 162, 0.1)",
              border: "1px solid rgba(118, 75, 162, 0.2)",
            }}
          >
            <TrendingUp
              size={20}
              color="#764ba2"
              style={{ marginBottom: "8px" }}
            />
            <div
              style={{ fontSize: "12px", color: "#764ba2", fontWeight: "600" }}
            >
              Analytics
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "15px",
              borderRadius: "12px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <DollarSign
              size={20}
              color="#10b981"
              style={{ marginBottom: "8px" }}
            />
            <div
              style={{ fontSize: "12px", color: "#10b981", fontWeight: "600" }}
            >
              Smart
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLoginPage;
