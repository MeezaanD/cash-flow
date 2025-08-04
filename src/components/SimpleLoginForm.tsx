import React, { useState } from "react";
import { useSimpleAuth } from "../hooks/useSimpleAuth";
import { TextField, Button, Box, Alert, CircularProgress } from "@mui/material";
import { LogIn } from "lucide-react";

interface SimpleLoginFormProps {
  onLoginSuccess: () => void;
}

export const SimpleLoginForm: React.FC<SimpleLoginFormProps> = ({
  onLoginSuccess,
}) => {
  const { login, loading } = useSimpleAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(credentials.username, credentials.password);
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={credentials.username}
          onChange={(e) =>
            setCredentials((prev) => ({
              ...prev,
              username: e.target.value,
            }))
          }
          disabled={loading}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          disabled={loading}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        />

        <Box sx={{ mt: 3, mb: 2 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <LogIn size={20} />
            }
            sx={{
              py: 1.5,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "600",
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
              },
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
