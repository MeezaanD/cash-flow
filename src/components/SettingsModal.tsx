import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FiSettings, FiDatabase } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { CurrencyCode } from "../types";
import { useAuth } from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import {
  Dialog as ConfirmDialog,
  DialogTitle as ConfirmDialogTitle,
  DialogContent as ConfirmDialogContent,
  DialogContentText as ConfirmDialogContentText,
  DialogActions as ConfirmDialogActions,
} from "@mui/material";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onImport?: (file: File) => Promise<void> | void;
  onExportCSV?: () => void;
  onExportJSON?: () => void;
}

const currencyOptions: CurrencyCode[] = [
  "ZAR",
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
];

const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  onImport,
  onExportCSV,
  onExportJSON,
}) => {
  const { theme, setTheme, currency, setCurrency } = useTheme();
  const [localTheme, setLocalTheme] = useState(theme);
  const [localCurrency, setLocalCurrency] = useState<CurrencyCode>(currency);
  const { currentUser } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "data">("general");

  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  useEffect(() => {
    setLocalCurrency(currency);
  }, [currency]);

  const handleApply = () => {
    if (localTheme !== theme) setTheme(localTheme);
    if (localCurrency !== currency) setCurrency(localCurrency);
    onClose();
  };

  const handleSignOut = async () => {
    setConfirmOpen(true);
  };

  const confirmLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    setConfirmOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2} mt={1}>
          <Paper
            variant="outlined"
            sx={{ width: 220, flexShrink: 0, borderRadius: 2 }}
          >
            <List component="nav" disablePadding>
              <ListItemButton
                selected={activeTab === "general"}
                onClick={() => setActiveTab("general")}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FiSettings size={16} />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2">General</Typography>}
                />
              </ListItemButton>
              <ListItemButton
                selected={activeTab === "data"}
                onClick={() => setActiveTab("data")}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FiDatabase size={16} />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2">Data</Typography>}
                />
              </ListItemButton>
            </List>
          </Paper>

          <Box flex={1}>
            {activeTab === "general" && (
              <Box>
                <Typography
                  variant="overline"
                  sx={{ color: "text.secondary", letterSpacing: 0.6 }}
                >
                  General
                </Typography>
                <Paper variant="outlined" sx={{ mt: 1, p: 2, borderRadius: 2 }}>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={localTheme === "dark"}
                          onChange={(e) =>
                            setLocalTheme(e.target.checked ? "dark" : "light")
                          }
                        />
                      }
                      label="Dark Mode"
                    />
                    <FormControl size="small" fullWidth>
                      <InputLabel id="currency-label">Currency</InputLabel>
                      <Select
                        labelId="currency-label"
                        value={localCurrency}
                        label="Currency"
                        onChange={(e) =>
                          setLocalCurrency(e.target.value as CurrencyCode)
                        }
                      >
                        {currencyOptions.map((c) => (
                          <MenuItem key={c} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Paper>
              </Box>
            )}

            {activeTab === "data" && (
              <Box>
                <Typography
                  variant="overline"
                  sx={{ color: "text.secondary", letterSpacing: 0.6 }}
                >
                  Data
                </Typography>
                <Paper variant="outlined" sx={{ mt: 1, p: 2, borderRadius: 2 }}>
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Import transactions from CSV/JSON. Duplicates are
                      automatically skipped.
                    </Typography>
                    <Box display="flex" gap={1}>
                      <input
                        type="file"
                        accept=".csv,.json,application/json,text/csv"
                        id="settings-import-input"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file && onImport) await onImport(file);
                          e.currentTarget.value = "";
                        }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          document
                            .getElementById("settings-import-input")
                            ?.click()
                        }
                      >
                        Import
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={onExportCSV}
                      >
                        Export CSV
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={onExportJSON}
                      >
                        Export JSON
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        {currentUser ? (
          <Button
            color="error"
            variant="outlined"
            onClick={handleSignOut}
            sx={{ mr: "auto" }}
          >
            Sign Out
          </Button>
        ) : (
          <Button variant="outlined" onClick={onClose} sx={{ mr: "auto" }}>
            Sign In
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleApply} variant="contained">
          Apply
        </Button>
      </DialogActions>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <ConfirmDialogTitle>Confirm Logout</ConfirmDialogTitle>
        <ConfirmDialogContent>
          <ConfirmDialogContentText>
            Are you sure you want to log out?
          </ConfirmDialogContentText>
        </ConfirmDialogContent>
        <ConfirmDialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmLogout} autoFocus>
            Logout
          </Button>
        </ConfirmDialogActions>
      </ConfirmDialog>
    </Dialog>
  );
};

export default SettingsModal;
