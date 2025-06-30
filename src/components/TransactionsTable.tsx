import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
} from "@mui/material";
import { FiArrowUp, FiArrowDown, FiTrash2 } from "react-icons/fi";
import { TransactionsTableProps } from "../types";
import "../styles/TransactionsTable.css";

const categoryColors: Record<string, string> = {
  debit_order: "#FFBB28",
  entertainment: "#FF6B6B",
  food: "#A28DFF",
  other: "#FF8042",
  personal: "#00C49F",
  travel: "#0088FE",
};

const months = [
  { value: "all", label: "All Months" },
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onDelete,
  onSelect,
  selectedId,
}) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");

  // Get all unique categories from transactions
  const allCategories = React.useMemo(() => {
    const categories = new Set<string>();
    transactions.forEach((tx) => {
      categories.add(tx.category);
    });
    return Array.from(categories).sort();
  }, [transactions]);

  const formatDate = (date: unknown) => {
    try {
      let parsedDate: Date;

      if (typeof date === "object" && date !== null && "toDate" in date) {
        parsedDate = (date as { toDate: () => Date }).toDate();
      } else if (typeof date === "string" || typeof date === "number") {
        parsedDate = new Date(date);
      } else {
        return "Invalid Date";
      }

      return parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "N/A";
    }
  };

  const getMonthFromDate = (date: unknown): number => {
    try {
      let parsedDate: Date;

      if (typeof date === "object" && date !== null && "toDate" in date) {
        parsedDate = (date as { toDate: () => Date }).toDate();
      } else if (typeof date === "string" || typeof date === "number") {
        parsedDate = new Date(date);
      } else {
        return -1;
      }

      return parsedDate.getMonth();
    } catch (e) {
      return -1;
    }
  };

  const filtered = [...transactions]
    .filter((tx) => {
      const matchesSearch = tx.title.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === "all" || tx.type === filterType;
      const matchesCategory = filterCategory === "all" || tx.category === filterCategory;
      const matchesMonth = filterMonth === "all" || 
        getMonthFromDate(tx.date ?? tx.createdAt) === parseInt(filterMonth);
      
      return matchesSearch && matchesType && matchesCategory && matchesMonth;
    })
    .sort((a, b) => {
      const parseDate = (d: unknown): number => {
        if (typeof d === "object" && d !== null && "toDate" in d) {
          return (d as { toDate: () => Date }).toDate().getTime();
        }
        if (typeof d === "string" || typeof d === "number") {
          return new Date(d).getTime();
        }
        return 0;
      };

      const timeA = parseDate(a.date ?? a.createdAt);
      const timeB = parseDate(b.date ?? b.createdAt);

      return timeB - timeA;
    });

  // Calculate total amount for filtered transactions
  const totalAmount = filtered.reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate total income and expenses separately
  const totalIncome = filtered
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalExpense = filtered
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Determine which totals to show based on current filters
  let amountHeader = "Amount";
  if (filterType === "all") {
    amountHeader = `Amount (Total: R${totalAmount.toFixed(2)}, Income: R${totalIncome.toFixed(2)}, Expense: R${totalExpense.toFixed(2)})`;
  } else if (filterType === "income") {
    amountHeader = `Amount (Total Income: R${totalIncome.toFixed(2)})`;
  } else if (filterType === "expense") {
    amountHeader = `Amount (Total Expense: R${totalExpense.toFixed(2)})`;
  }

  return (
    <Box className="transactions-wrapper">
      <Box className="transactions-controls">
        <TextField
          label="Search transactions"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          fullWidth
          sx={{ flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            label="Type"
            onChange={(e) => setFilterType(e.target.value as any)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            label="Category"
            onChange={(e) => setFilterCategory(e.target.value as string)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {allCategories.map((category) => (
              <MenuItem key={category} value={category}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    size="small"
                    sx={{
                      backgroundColor: categoryColors[category] || "#9CA3AF",
                      width: 12,
                      height: 12,
                    }}
                  />
                  {category}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={filterMonth}
            label="Month"
            onChange={(e) => setFilterMonth(e.target.value as string)}
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="transactions table">
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">{amountHeader}</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((tx) => (
              <TableRow
                key={tx.id}
                hover
                selected={tx.id === selectedId}
                onClick={() => onSelect(tx)}
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <div style={{ fontWeight: 500 }}>{tx.title}</div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {tx.type}
                  </div>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: tx.type === "income" ? "#10B981" : "#EF4444",
                    fontWeight: 500,
                  }}
                >
                  <div className="amount-cell">
                    {tx.type === "income" ? (
                      <FiArrowUp size={14} />
                    ) : (
                      <FiArrowDown size={14} />
                    )}
                    <span className="amount-value">
                      R{tx.amount.toFixed(2)}
                    </span>
                  </div>
                </TableCell>
                <TableCell align="right">
                  {formatDate(tx.date ?? tx.createdAt)}
                </TableCell>
                <TableCell align="right">
                  <span
                    className="category-badge"
                    style={{
                      backgroundColor: categoryColors[tx.category] || "#9CA3AF",
                    }}
                  >
                    {tx.category}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      if (tx.id) onDelete(tx.id);
                    }}
                    size="small"
                  >
                    <FiTrash2 size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="textSecondary">
                    {search
                      ? "No matching transactions found"
                      : "No transactions available"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionsTable;