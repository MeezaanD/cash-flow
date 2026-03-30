# Cash Flow App - Data Structure and Flow Design

## 1. Data Structures

**Account:**

- `id?: string`
- `userId?: string`
- `name: string`
- `bank?: string`
- `type: 'debit' | 'credit' | 'savings' | 'cash'`
- `currency?: string`
- `balance: number`
- `color?: string`
- `icon?: string`
- `createdAt?: Date | { toDate: () => Date }`

**Transaction:**

- `id?: string`
- `userId?: string`
- `accountId: string` ← required; links to an Account
- `transferAccountId?: string` ← set on transfer records to identify the counterpart account
- `title: string`
- `amount: number`
- `type: 'income' | 'expense' | 'transfer'`
- `category: string`
- `description?: string`
- `date?: Date | { toDate: () => Date }`
- `createdAt?: Date | { toDate: () => Date }`

**Transfer:**
A transfer is represented as **two Transaction documents** — both with `type: 'transfer'`. The source account gets a debit record; the destination account gets a credit record. Both carry `transferAccountId` pointing to the other account.

**Budget:**

- `id?: string`
- `userId?: string`
- `category: string`
- `amount: number`
- `period: 'monthly'`
- `createdAt?: Date | { toDate: () => Date }`

**RecurringExpense (template):**

- `id?: string`
- `userId?: string`
- `accountId?: string`
- `title: string`
- `amount: number`
- `type?: 'income' | 'expense'`
- `category: string`
- `description?: string`
- `frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly'`
- `createdAt?: Date | { toDate: () => Date }`

---

## 2. Firestore Structure

All data is scoped to the authenticated user via subcollections:

```
users/{userId}/
  transactions/{transactionId}   — income, expense, and transfer records
  accounts/{accountId}           — financial accounts (debit, credit, savings, cash)
  budgets/{budgetId}             — monthly category budgets
  recurringTransactions/{id}     — recurring expense templates
```

Legacy top-level `transactions` and `recurringExpenses` collections exist as **read-only** for backward compatibility.

---

## 3. MVC Architecture

**Model Layer** (`src/models/`)

| File | Responsibilities |
|---|---|
| `AccountModel.ts` | `Account` interface, `normalizeAccount()`, `calculateNetWorth()`, `ACCOUNT_TYPE_LABELS`, `ACCOUNT_COLORS` |
| `BudgetModel.ts` | `Budget` interface, `normalizeBudget()`, `calculateBudgetUsage(budget, transactions)` |
| `TransactionModel.ts` | `Transaction` interface, `normalizeTransaction()`, filter helpers (`filterExpenses`, `filterIncome`, `filterTransfers`, `filterByAccount`, `filterByCategory`, `groupByCategory`, `calculateTotals`) |
| `RecurringExpenseModel.ts` | `RecurringExpense` interface, `normalizeRecurringExpenses()` |

**Hook (Data) Layer** (`src/hooks/`)

| Hook | Collection | Key operations |
|---|---|---|
| `useAccounts` | `users/{uid}/accounts` | `onSnapshot`, `addAccount`, `updateAccount`, `deleteAccount`, `updateBalance(delta)` |
| `useBudgets` | `users/{uid}/budgets` | `onSnapshot`, `addBudget`, `updateBudget`, `deleteBudget` |
| `useTransactions` | `users/{uid}/transactions` | `onSnapshot`, `addTransaction` (batch tx + balance), `addTransfer` (batch 2 tx + 2 balances), `deleteTransaction` (batch delete + reverse balance) |
| `useRecurringExpenses` | `users/{uid}/recurringTransactions` | `onSnapshot`, `addRecurringExpense`, `updateRecurringExpense`, `deleteRecurringExpense` |

**Controller Layer** (`src/controllers/`)

| Controller | Wraps | Adds |
|---|---|---|
| `AccountsController` | `useAccounts` | `getAccountById`, `getAccountsByType`, `calculateTotalBalance`, `calculateNetWorth` |
| `BudgetsController` | `useBudgets` | `getBudgetProgress(budgetId, txs)`, `getAllBudgetProgress(txs)` |
| `TransactionsController` | `useTransactions` | `getExpenses`, `getIncome`, `getTransfers`, `getByAccount`, `getByCategory`, `getByType`, `getAll`, `getUniqueCategories`, `sortByDateDesc`, `calculateTotals`, `groupByCategory`, `deleteAllTransactions` |
| `RecurringExpensesController` | `useRecurringExpenses` | CRUD passthrough (`addRecurringExpense`, `updateRecurringExpense`, `deleteRecurringExpense`) |
| `ReportsController` | Pure functions (no Firestore) | `getSpendingByCategory`, `getSpendingByAccount`, `getMonthlyTrend`, `getNetWorth` |

**Context Layer** (`src/context/`)

| Context | Provider | Consumers |
|---|---|---|
| `AccountsContext` | `AccountsProvider` | Sidebar, AccountsList, AccountForm, TransferForm, ReconcileForm, AccountDetail, ReportsView |
| `BudgetsContext` | `BudgetsProvider` | BudgetsList, BudgetForm |
| `TransactionsContext` | `TransactionsProvider` | All transaction views, RecurringExpensesController, BudgetProgress calculation |
| `ThemeContext` | `ThemeProvider` | Sidebar, SettingsModal |

Provider nesting in `App.tsx`:
```
ThemeProvider
  TransactionsProvider
    AccountsProvider
      BudgetsProvider
        Router
```

**View Layer** (`src/views/`, `src/pages/`)

| Component | View path | Description |
|---|---|---|
| `AccountsList` | `views/Accounts/` | Grid of account cards with net worth summary |
| `AccountForm` | `views/Accounts/` | Create / edit account |
| `TransferForm` | `views/Accounts/` | Transfer between two accounts |
| `ReconcileForm` | `views/Accounts/` | 3-step reconciliation flow |
| `BudgetsList` | `views/Budgets/` | Budget cards with progress bars |
| `BudgetForm` | `views/Budgets/` | Create / edit budget |
| `ReportsView` | `views/Reports/` | 4 charts: category pie, account bar, monthly trend, net worth |
| `TransactionForm` | `views/Transactions/` | Create / edit; supports income, expense, transfer types + account selector |
| `TransactionsTable` | `views/Transactions/` | Tabular transaction list |
| `TransactionsList` | `views/Transactions/` | Card-style list |
| `AccountDetail` | `pages/` | Route `/accounts/:accountId` — per-account history |
| `Dashboard` | `pages/` | Main app shell, view routing |

---

## 4. Data Flow

### Adding a Transaction

```
TransactionForm --submit--> TransactionsContext.addTransaction(data)
  --> useTransactions.addTransaction(data)
      writeBatch:
        batch.set(txRef, { ...data, createdAt: now })
        batch.update(accountRef, { balance: increment(delta) })
      batch.commit()
  --> onSnapshot fires --> setTransactions([...]) --> all subscribed views update
```

### Adding a Transfer

```
TransferForm --submit--> TransactionsContext.addTransfer({ fromAccountId, toAccountId, amount, ... })
  --> useTransactions.addTransfer(data)
      writeBatch:
        batch.set(expenseRef,  { type: 'transfer', accountId: from, transferAccountId: to, ... })
        batch.set(incomeRef,   { type: 'transfer', accountId: to,   transferAccountId: from, ... })
        batch.update(fromRef,  { balance: increment(-amount) })
        batch.update(toRef,    { balance: increment(+amount) })
      batch.commit()
```

### Budget Progress

```
BudgetsList --render--> useBudgetsContext.getAllBudgetProgress(transactions)
  --> BudgetsController.getAllBudgetProgress(transactions)
      --> budgets.map(b => calculateBudgetUsage(b, transactions))
          // pure: filter expenses by category + current month, sum amounts
          --> { budget, spent, remaining, percent }
```

### Reports

```
ReportsView --render--> ReportsController functions (pure, no Firestore)
  getSpendingByCategory(transactions, dateRange)  --> CategoryReport[]
  getSpendingByAccount(transactions, accounts, dateRange) --> AccountReport[]
  getMonthlyTrend(transactions, months)            --> MonthlyTrend[]
  getNetWorth(accounts)                            --> NetWorthData
```

---

## 5. Textual Flow Diagram

```
MVC Architecture:

[Views / Pages]
  |
  +--> [AccountsContext]   --> [AccountsController]   --> [useAccounts]    --> Firestore accounts
  +--> [BudgetsContext]    --> [BudgetsController]    --> [useBudgets]     --> Firestore budgets
  +--> [TransactionsContext]--> [TransactionsController]--> [useTransactions]--> Firestore transactions
                            --> [RecurringExpenses]   --> [useRecurringExpenses]--> Firestore recurringTransactions

All hooks use onSnapshot() for real-time updates.
All writes to transactions also update account.balance via writeBatch + increment().
```

---

## 6. Account Balance Rules

| Operation | Balance effect |
|---|---|
| Add income | `account.balance += amount` |
| Add expense | `account.balance -= amount` |
| Add transfer | `from.balance -= amount`, `to.balance += amount` |
| Delete income | `account.balance -= amount` (reversed) |
| Delete expense | `account.balance += amount` (reversed) |
| Reconcile | creates income or expense adjustment transaction |

All balance updates use `increment()` inside a `writeBatch` — no read-modify-write race conditions.
