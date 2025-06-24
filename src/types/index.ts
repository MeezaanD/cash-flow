// Theme
export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Transaction (merged)
export type TransactionType = "income" | "expense";

export interface Transaction {
  id?: string;
  title: string;
  amount: number;
  type: TransactionType;
  category?: string;
  description?: string;
  date?: Date | { toDate: () => Date };
  createdAt?: Date | { toDate: () => Date };
}

// SidebarProps
export interface SidebarProps {
  toggleSidebar: () => void;
  transactions: Transaction[];
  onCreate: () => void;
  isCreating: boolean;
  onSelect: (tx: Transaction | null) => void;
  onDelete: (id: string) => void;
  selectedId: string | null;
  collapsed: boolean;
  onShowPieChart: (show: boolean) => void;
  showPieChart: boolean;
}

// TransactionFormProps
export interface TransactionFormProps {
  onSubmit: (data: Omit<Transaction, 'id' | 'date' | 'createdAt'>) => Promise<void> | void;
  onClose: () => void;
  transaction?: Transaction;
}

export interface Category {
  value: string;
  label: string;
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
}
