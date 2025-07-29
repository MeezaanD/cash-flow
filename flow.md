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

## 2. Data Flow

**User Interface Components:**

- `TransactionForm`: Add or edit a transaction
- `TransactionsTable`: List of transactions
- `PieChart`: Visualizes expenses by category
- `Sidebar`: Navigation and transaction selection
- `Dashboard`: Main page, coordinates all components

**Data Layer:**

- `useTransactions` hook: Handles fetching, adding, updating, deleting transactions from Firestore
- `Firestore DB`: Stores all transaction data

**Flow Description:**

- User interacts with forms/tables to create, edit, or delete transactions.
- All transaction operations go through the `useTransactions` hook, which communicates with Firestore.
- UI components receive transaction data from the hook and update accordingly.
- Expenses are filtered from transactions where `type === 'expense'` for reporting and visualization.

## 3. Textual Flow Diagram

```
[TransactionForm] --submits/edits--> [useTransactions Hook] --add/update/delete--> [Firestore DB]
[useTransactions Hook] --fetches--> [Firestore DB]
[useTransactions Hook] --provides transactions--> [TransactionsTable]
[useTransactions Hook] --provides transactions--> [PieChart]
[useTransactions Hook] --provides transactions--> [Sidebar]
[useTransactions Hook] --provides transactions--> [Dashboard]
[TransactionsTable] --select/delete/edit--> [Dashboard]
[Sidebar] --select/create/delete--> [Dashboard]
[Dashboard] --shows--> [TransactionForm], [TransactionsTable], [PieChart], [Sidebar]
```

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
