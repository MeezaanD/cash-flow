# Cash Flow App - Data Structure and Flow Design

## 1. Data Structure

**Transaction:**

- `id?: string`
- `title: string`
- `amount: number`
- `type: 'income' | 'expense'`
- `category: string`
- `description?: string`
- `date?: Date | { toDate: () => Date }`
- `createdAt?: Date | { toDate: () => Date }`

**Expense:**

- An Expense is a Transaction where `type = 'expense'`

## 2. Data Flow (MVC Architecture)

**View Layer:**

- `TransactionForm`: Add or edit a transaction with date selection
- `TransactionsTable`: List of transactions
- `TransactionsList`: List view of transactions
- `PieChart`: Visualizes expenses by category
- `Sidebar`: Navigation and transaction selection
- `Dashboard`: Main page, coordinates all components

**Controller Layer:**

- `TransactionsController`: Business logic and data operations
- `useTransactionsContext`: Global state access via React Context

**Model Layer:**

- `TransactionModel`: Data types, normalization, and utility functions

**Data Layer:**

- `useTransactions` hook: Handles fetching, adding, updating, deleting transactions from Firestore
- `Firestore DB`: Stores all transaction data

**Flow Description:**

1. User interacts with view components (forms/tables) to create, edit, or delete transactions
2. Views access data through `TransactionsContext` (Controller layer)
3. Controller uses `useTransactions` hook to communicate with Firestore
4. Data is normalized through the Model layer (Firestore Timestamps → Dates)
5. UI components automatically update when data changes
6. Expenses are filtered from transactions where `type === 'expense'` for reporting

## 3. Textual Flow Diagram

```
MVC Architecture Flow:

[View Components] --> [TransactionsContext] --> [TransactionsController]
                                            --> [useTransactions Hook]
                                            --> [Firestore DB]

Detailed Flow:
[TransactionForm] --submits/edits--> [TransactionsContext] --> [TransactionsController]
[TransactionsController] --> [useTransactions Hook] --> [Firestore DB]
[Firestore DB] --> [useTransactions Hook] --> [TransactionsContext] --> [All View Components]
```

**New Features:**

- Date selection: TransactionForm now includes a date picker (defaults to current date)
- MVC separation: All transaction views (Form, List, Table) are in `views/Transactions/`
- Global state: All components access data via `TransactionsContext`

_Note: Expense is a Transaction with type 'expense'._

## 4. Basic ASCII Sketch

```
           +-------------------+
           |   TransactionForm |
           +-------------------+
                    |
                    v
           +-------------------+
           | useTransactions   |
           +-------------------+
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
|   Firestore DB    |
+-------------------+
        ^
        |
+-------------------+
| useTransactions   |
+-------------------+

* Expense = Transaction where type = 'expense'
```
