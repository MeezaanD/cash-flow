// Theme
export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
}

// ViewType
export type ViewType = "dashboard" | "reports" | "transaction" | "table" | "list";

// Category
export interface Category {
  value: string;
  label: string;
}

// Transaction
export type TransactionType = "income" | "expense";

export interface Transaction {
  id?: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  date?: Date | { toDate: () => Date };
  createdAt?: Date | { toDate: () => Date };
}

// DateRange
export interface DateRange {
  startDate: string;
  endDate: string;
}

// SidebarProps
export interface SidebarProps {
  toggleSidebar: () => void;
  transactions: Transaction[];
  onCreate: () => void;
  onSelect: (tx: Transaction | null) => void;
  onDelete: (id: string) => void;
  selectedId: string | null;
  collapsed: boolean;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

// TransactionFormProps
export interface TransactionFormProps {
  onSubmit: (
    data: Omit<Transaction, "id" | "date" | "createdAt">
  ) => Promise<void> | void;
  onClose: () => void;
  transaction?: Transaction;
}

// PieChart
export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface PieChartComponentProps {
  data: PieChartData[];
  onClose: () => void;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
}

// TransactionsTable
export interface TransactionsTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onSelect: (tx: Transaction) => void;
  selectedId: string | null;
}

// Currency
export type CurrencyCode =
  | "USD"
  | "EUR"
  | "ZAR"
  | "GBP"
  | "JPY"
  | "AUD"
  | "CAD";

export interface ImportResult {
  importedCount: number;
  skippedDuplicates: number;
  errors: string[];
}

export interface SerializableTransaction {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  date?: string;
}
