import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SimpleLoginPage from "./pages/SimpleLoginPage";
import SimpleDashboard from "./pages/SimpleDashboard";
import SimpleProtectedRoute from "./components/SimpleProtectedRoute";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Simple API Routes */}
          <Route path="/simple-login" element={<SimpleLoginPage />} />
          <Route
            path="/simple-dashboard"
            element={
              <SimpleProtectedRoute>
                <SimpleDashboard />
              </SimpleProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
