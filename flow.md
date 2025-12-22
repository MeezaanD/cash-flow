# Cash Flow App - Data Structure and Flow Design

## 1. Data Structure

**Transaction:**

- `id?: string`
- `userId?: string`
- `title: string`
- `amount: number`
- `type: 'income' | 'expense'`
- `category: string`
- `description?: string`
- `date?: Date | { toDate: () => Date }`
- `createdAt?: Date | { toDate: () => Date }`

**Expense:**

- An Expense is a Transaction where `type = 'expense'`

**RecurringExpense:**

- `id?: string`
- `userId?: string`
- `title: string`
- `amount: number`
- `category: string`
- `description?: string`
- `frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly'`
- `createdAt?: Date | { toDate: () => Date }`

## 2. Data Flow (MVC Architecture)

**View Layer:**

- `TransactionForm`: Add or edit a transaction with date selection and quick fill from recurring expenses
- `TransactionsTable`: List of transactions
- `TransactionsList`: List view of transactions
- `PieChart`: Visualizes expenses by category
- `Sidebar`: Navigation and transaction selection
- `Dashboard`: Main page, coordinates all components
- `RecurringExpenseForm`: Add or edit recurring expenses
- `RecurringExpensesList`: List and manage recurring expenses
- `SettingsModal`: Settings including recurring expenses management

**Controller Layer:**

- `TransactionsController`: Business logic and data operations for transactions
- `RecurringExpensesController`: Business logic and data operations for recurring expenses
- `useTransactionsContext`: Global state access via React Context (includes both transactions and recurring expenses)

**Model Layer:**

- `TransactionModel`: Data types, normalization, and utility functions for transactions
- `RecurringExpenseModel`: Data types, normalization, and utility functions for recurring expenses

**Data Layer:**

- `useTransactions` hook: Handles fetching, adding, updating, deleting transactions from Firestore
- `useRecurringExpenses` hook: Handles fetching, adding, updating, deleting recurring expenses from Firestore with real-time subscriptions
- `Firestore DB`: Stores all transaction and recurring expense data

**Flow Description:**

**Transactions Flow:**
1. User interacts with view components (forms/tables) to create, edit, or delete transactions
2. Views access data through `TransactionsContext` (Controller layer)
3. Controller uses `useTransactions` hook to communicate with Firestore
4. Data is normalized through the Model layer (Firestore Timestamps → Dates)
5. UI components automatically update when data changes
6. Expenses are filtered from transactions where `type === 'expense'` for reporting

**Recurring Expenses Flow:**
1. User creates recurring expenses in Settings Modal → Recurring Expenses tab
2. Recurring expenses are stored in Firestore `recurringExpenses` collection
3. Real-time updates via `useRecurringExpenses` hook using `onSnapshot`
4. Quick Fill feature in TransactionForm allows one-click form pre-filling
5. Selecting a recurring expense auto-fills title, amount, category, and description
6. User can still edit all fields before submitting the transaction

## 3. Textual Flow Diagram

```
MVC Architecture Flow:

[View Components] --> [TransactionsContext] --> [TransactionsController]
                                            --> [RecurringExpensesController]
                                            --> [useTransactions Hook]
                                            --> [useRecurringExpenses Hook]
                                            --> [Firestore DB]

Detailed Transaction Flow:
[TransactionForm] --submits/edits--> [TransactionsContext] --> [TransactionsController]
[TransactionsController] --> [useTransactions Hook] --> [Firestore DB]
[Firestore DB] --> [useTransactions Hook] --> [TransactionsContext] --> [All View Components]

Detailed Recurring Expenses Flow:
[RecurringExpenseForm] --submits/edits--> [TransactionsContext] --> [RecurringExpensesController]
[RecurringExpensesController] --> [useRecurringExpenses Hook] --> [Firestore DB]
[Firestore DB] --> [useRecurringExpenses Hook] (real-time) --> [TransactionsContext] --> [All View Components]

Quick Fill Flow:
[TransactionForm] --selects recurring expense--> [Pre-fills form fields] --> [User edits if needed] --> [Submits as transaction]
```

**Key Features:**

- Date selection: TransactionForm includes a date picker (defaults to current date)
- MVC separation: All transaction views (Form, List, Table) are in `views/Transactions/`
- Global state: All components access data via `TransactionsContext`
- Recurring Expenses: Create templates for frequently used expenses
- Quick Fill: One-click form pre-filling from recurring expenses
- Real-time updates: Recurring expenses sync in real-time using Firestore subscriptions
- Settings Integration: Manage recurring expenses in Settings Modal

_Note: Expense is a Transaction with type 'expense'._

## 4. Basic ASCII Sketch

```
           +-------------------+
           |   TransactionForm |
           |  (with Quick Fill)|
           +-------------------+
                    |
        +-----------+-----------+
        |                       |
        v                       v
+-------------------+   +-------------------+
| useTransactions   |   |useRecurringExpenses|
+-------------------+   +-------------------+
        |                       |
        |                       |
        +-----------+-----------+
                    |
        +-----------+-----------+-------------------+-------------------+
        |           |           |                   |
        v           v           v                   v
+----------------+ +-----------+-----------+ +--------------+ +----------------+
| Transactions   | |   PieChart           | |   Sidebar    | |   Dashboard     |
|   Table        | +---------------------+ +--------------+ +----------------+
+----------------+
        |
        v
+-------------------+
|   Dashboard       |
+-------------------+

        +-------------------+
        |   SettingsModal   |
        +-------------------+
                    |
                    v
        +-------------------+
        |RecurringExpensesList|
        +-------------------+
                    |
                    v
        +-------------------+
        |RecurringExpenseForm|
        +-------------------+

+-------------------+
|   Firestore DB    |
+-------------------+
        ^
        |
+-----------+-----------+
|           |           |
v           v           v
+-------------------+   +-------------------+
| useTransactions   |   |useRecurringExpenses|
+-------------------+   +-------------------+
        |                       |
        |                       |
        +-----------+-----------+
                    |
           +-------------------+
           |TransactionsContext|
           +-------------------+

* Expense = Transaction where type = 'expense'
* RecurringExpense = Template for frequently used expenses
* Quick Fill = Pre-fill transaction form from recurring expense
```
