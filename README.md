## Project Overview - Cash Flow

**Cash Flow** is a web application designed to help users track their income and expenses in real-time. Built for simplicity, speed, and privacy, it features secure authentication and cloud storage powered by Firebase.

## Key Features

- **Secure Login:** User authentication with Firebase.
- **Real-Time Tracking:** Instantly log and update income and expenses.
- **Recurring Expenses:** Create templates for frequently used expenses and quickly fill transaction forms.
- **Quick Fill:** One-click form pre-filling from recurring expenses to save time.
- **Date Selection:** Choose custom dates for transactions (defaults to current date).
- **Clean Interface:** Modern, minimalist design with smooth user experience.
- **Cloud Sync:** Data stored and synced via Firebase with real-time updates.
- **Fast Hosting:** Deployed on Vercel for quick load times.
- **Import/Export:** Import transactions from CSV/JSON with validation and deduping, export all data as CSV/JSON from the Settings modal.
- **MVC Architecture:** Clean separation of concerns with Model-View-Controller pattern.
- **Theme Support:** Dark and light mode with proper theming throughout the app.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Shadcn
- **Backend:** Firebase Auth & Firestore
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Environment Variables

Create a .env.local file in the project root with the Firebase config values used in [src/services/firebase.ts](src/services/firebase.ts):

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID

### Install & Run

1. Install dependencies: npm install
2. Start dev server: npm run dev
3. Run tests: npm test

### Useful Scripts

- npm run build
- npm run lint
- npm run test:watch
- npm run test:coverage

## Project Structure

- [src/pages](src/pages): Route-level screens like [Dashboard](src/pages/Dashboard.tsx) and [Home](src/pages/Home.tsx).
- [src/views](src/views): Feature-level UI (transactions and recurring expenses).
- [src/components/app](src/components/app): Reusable app components and shared UI primitives.
- [src/context](src/context): Global state (theme and transactions).
- [src/hooks](src/hooks): Reusable stateful logic (auth, transactions, recurring expenses).
- [src/controllers](src/controllers): Data controllers for transaction and recurring expense flows.
- [src/models](src/models): Domain models, validation, and normalization for Firestore data.
- [src/services](src/services): External services (Firebase).
- [src/utils](src/utils): Pure utilities (date, formatting, import/export helpers).
- [src/types](src/types): Shared TypeScript types used across the app.

## Architecture & Data Flow

- UI lives in [src/pages](src/pages) and [src/views](src/views).
- Business logic is concentrated in hooks and controllers.
- Firestore data is normalized at the model layer in [src/models](src/models).
- Shared formatting and filtering utilities sit in [src/utils](src/utils).
- Theme and currency are managed in [src/context/ThemeContext.tsx](src/context/ThemeContext.tsx).

## State Management

- Transactions and recurring expenses are provided via [src/context/TransactionsContext.tsx](src/context/TransactionsContext.tsx).
- Auth state is provided by [src/hooks/useAuth.ts](src/hooks/useAuth.ts).

## Coding Conventions

- Keep data normalization in models, not in UI components.
- Prefer small, focused components with single responsibility.
- Reuse utilities from [src/utils](src/utils) instead of duplicating logic.
- Use shared types from [src/types](src/types) across UI and logic layers.

## Goals

- Help users stay on top of their finances.
- Make budgeting easy and accessible.
- Keep data secure and always up to date.

## Recurring Expenses Usage

1. **Creating a Recurring Expense:**
   - Open Settings (bottom-left in the sidebar)
   - Navigate to the "Recurring Expenses" tab
   - Click "Add New"
   - Fill in title, amount, category, frequency (daily/weekly/monthly/yearly), and optional description
   - Click "Add Expense"

2. **Using Quick Fill:**
   - Click "New Transaction" or "Create Transaction"
   - In the "Quick Fill" section at the top of the form, select a recurring expense
   - The form automatically fills with the expense details
   - Adjust any fields as needed (you can still edit everything)
   - Submit the transaction

3. **Managing Recurring Expenses:**
   - Edit: Click the edit icon next to any recurring expense
   - Delete: Click the delete icon (confirmation required)

## Import/Export Usage

- Open the app and go to the Dashboard.
- Click the Settings button (bottom-left in the sidebar).
- Navigate to the "Data" tab inside the Settings modal.
- Use:
    - Import: upload a `.csv` or `.json` file. Required fields: `title`, `amount`, `type`, `category`. Duplicates are skipped using a signature of title+amount+type+category+date.
    - Export CSV / Export JSON: downloads all your transactions.

Feedback is shown after import indicating how many records were imported, skipped, or errored.

## Ideal For

- Budget-conscious individuals
- Students and freelancers
- Anyone wanting a lightweight finance tracker
