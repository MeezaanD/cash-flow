import React, { useState, useMemo } from "react";
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
import DateRangeFilter, { DateRange } from "./DateRangeFilter";
import { filterTransactionsByDateRangeObject } from "../utils/dateRangeFilter";
import { useTheme } from "../context/ThemeContext";
import { formatCurrency } from "../utils/formatCurrency";
import "../styles/TransactionsTable.css";

// Constants moved outside component
const CATEGORY_COLORS: Record<string, string> = {
  debit_order: "#FFBB28",
  entertainment: "#FF6B6B",
  food: "#A28DFF",
  other: "#FF8042",
  personal: "#00C49F",
  travel: "#0088FE",
};

const MONTHS = [
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

const INITIAL_VISIBLE_COUNT = 15;
const LOAD_MORE_COUNT = 15;

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onDelete,
  onSelect,
  selectedId,
}) => {
  const { currency } = useTheme();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  // Memoized filtered transactions
  const { filtered, totals } = useMemo(() => {
    const dateFiltered = filterTransactionsByDateRangeObject(
      transactions,
      dateRange
    );

    const filtered = dateFiltered
      .filter((tx) => {
        const matchesSearch = tx.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesType = filterType === "all" || tx.type === filterType;
        const matchesCategory =
          filterCategory === "all" || tx.category === filterCategory;
        const dateValue = tx.date ?? tx.createdAt;
        const month = dateValue
          ? new Date(
              typeof dateValue === "object" && "toDate" in dateValue
                ? dateValue.toDate()
                : dateValue
            ).getMonth()
          : -1;
        const matchesMonth =
          filterMonth === "all" || month === parseInt(filterMonth);

        return matchesSearch && matchesType && matchesCategory && matchesMonth;
      })
      .sort((a, b) => {
        const getValidDate = (value: any) => {
          if (!value) return new Date(0);
          if (typeof value === "object" && "toDate" in value)
            return value.toDate();
          return new Date(value);
        };
        const dateA = getValidDate(a.date ?? a.createdAt).getTime();
        const dateB = getValidDate(b.date ?? b.createdAt).getTime();
        return dateB - dateA;
      });

    const totalAmount = filtered.reduce((sum, tx) => sum + tx.amount, 0);
    const totalIncome = filtered
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpense = filtered
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    return { filtered, totals: { totalAmount, totalIncome, totalExpense } };
  }, [
    transactions,
    dateRange,
    search,
    filterType,
    filterCategory,
    filterMonth,
  ]);

  // Memoized unique categories
  const allCategories = useMemo(
    () => Array.from(new Set(transactions.map((tx) => tx.category))).sort(),
    [transactions]
  );

  const visibleTransactions = filtered.slice(0, visibleCount);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      visibleCount < filtered.length
    ) {
      setVisibleCount((prev) =>
        Math.min(prev + LOAD_MORE_COUNT, filtered.length)
      );
    }
  };

  const resetVisibleCount = () => setVisibleCount(INITIAL_VISIBLE_COUNT);

  // Dynamic header text based on filters
  const amountHeader =
    filterType === "all"
      ? `Amount (Total: ${formatCurrency(totals.totalAmount, currency)}, Income: ${formatCurrency(totals.totalIncome, currency)}, Expense: ${formatCurrency(totals.totalExpense, currency)})`
      : filterType === "income"
        ? `Amount (Total Income: ${formatCurrency(totals.totalIncome, currency)})`
        : `Amount (Total Expense: ${formatCurrency(totals.totalExpense, currency)})`;

  return (
    <Box className="transactions-wrapper">
      <Box className="transactions-controls">
        <TextField
          label="Search transactions"
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetVisibleCount();
          }}
          size="small"
          fullWidth
          sx={{ flex: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            label="Type"
            onChange={(e) => {
              setFilterType(e.target.value as any);
              resetVisibleCount();
            }}
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
            onChange={(e) => {
              setFilterCategory(e.target.value as string);
              resetVisibleCount();
            }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {allCategories.map((category) => (
              <MenuItem key={category} value={category}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    size="small"
                    sx={{
                      backgroundColor: CATEGORY_COLORS[category] || "#9CA3AF",
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
            onChange={(e) => {
              setFilterMonth(e.target.value as string);
              resetVisibleCount();
            }}
          >
            {MONTHS.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 2 }}>
        <DateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={(newRange) => {
            setDateRange(newRange);
            resetVisibleCount();
          }}
          onClear={() => {
            setDateRange({ startDate: "", endDate: "" });
            resetVisibleCount();
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        onScroll={handleScroll}
        sx={{
          position: "relative",
          maxHeight: "calc(100vh - 180px)",
          overflow: "auto",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30px",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)",
            pointerEvents: "none",
            display: visibleCount < filtered.length ? "block" : "none",
            zIndex: 1,
          },
          ".theme-dark &::after": {
            background:
              "linear-gradient(to bottom, rgba(31,41,55,0) 0%, rgba(31,41,55,0.9) 100%)",
          },
        }}
      >
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
            {visibleTransactions.map((tx) => (
              <TableRow
                key={tx.id}
                hover
                selected={tx.id === selectedId}
                onClick={() => onSelect(tx)}
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ fontWeight: 500 }}>{tx.title}</Box>
                  <Box
                    sx={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
                  >
                    {tx.type}
                  </Box>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: tx.type === "income" ? "#10B981" : "#EF4444",
                    fontWeight: 500,
                  }}
                >
                  <Box className="amount-cell">
                    {tx.type === "income" ? (
                      <FiArrowUp size={14} />
                    ) : (
                      <FiArrowDown size={14} />
                    )}
                    <span className="amount-value">
                      {formatCurrency(tx.amount, currency)}
                    </span>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {(() => {
                    const dateValue = tx.date ?? tx.createdAt;
                    let dateObj: Date;
                    if (!dateValue) {
                      dateObj = new Date(0);
                    } else if (
                      typeof dateValue === "object" &&
                      "toDate" in dateValue
                    ) {
                      dateObj = dateValue.toDate();
                    } else {
                      dateObj = new Date(dateValue);
                    }
                    return dateObj.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  })()}
                </TableCell>
                <TableCell align="right">
                  <Box
                    className="category-badge"
                    sx={{
                      backgroundColor:
                        CATEGORY_COLORS[tx.category] || "#9CA3AF",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      display: "inline-block",
                      color: "white",
                      fontWeight: 500,
                    }}
                  >
                    {tx.category}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      tx.id && onDelete(tx.id);
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
