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

Create a `.env.local` file in the repository root with the Firebase config values used in [app/src/services/firebase.ts](app/src/services/firebase.ts):

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID

### Install & Run

1. Install dependencies from the root: `npm install`
2. Start Astro (marketing + mounted app): `npm run dev`
3. Open:
   - `http://localhost:4321/` for the Astro marketing page
   - `http://localhost:4321/app` for the React app
4. Optional: run React app independently from `/app`:
   - `cd app`
   - `npm install`
   - `npm run dev`

### Useful Scripts

- Root (Astro): `npm run dev`, `npm run build`, `npm run preview`
- React app only (`/app`): `npm run dev`, `npm run build`, `npm run lint`, `npm test`

### Vercel Deployment Notes

- Deploy from the repository root as a single project.
- Root build command: `npm run build` (Astro static output).
- `/` serves the Astro marketing page.
- `/app` serves the mounted React app.
- `vercel.json` rewrites `/app/*` to `/app` so React Router paths refresh correctly.

## Project Structure

- [src/pages](src/pages): Astro pages (`/` marketing landing, `/app` React mount).
- [app](app): Existing React + Vite + Firebase application.
- [app/src/pages](app/src/pages): Route-level screens like [Dashboard](app/src/pages/Dashboard.tsx) and [Home](app/src/pages/Home.tsx).
- [app/src/views](app/src/views): Feature-level UI (transactions and recurring expenses).
- [app/src/components/app](app/src/components/app): Reusable app components and shared UI primitives.
- [app/src/context](app/src/context): Global state (theme and transactions).
- [app/src/hooks](app/src/hooks): Reusable stateful logic (auth, transactions, recurring expenses).
- [app/src/controllers](app/src/controllers): Data controllers for transaction and recurring expense flows.
- [app/src/models](app/src/models): Domain models, validation, and normalization for Firestore data.
- [app/src/services](app/src/services): External services (Firebase).
- [app/src/utils](app/src/utils): Pure utilities (date, formatting, import/export helpers).
- [app/src/types](app/src/types): Shared TypeScript types used across the app.

## Architecture & Data Flow

- UI lives in [app/src/pages](app/src/pages) and [app/src/views](app/src/views).
- Business logic is concentrated in hooks and controllers.
- Firestore data is normalized at the model layer in [app/src/models](app/src/models).
- Shared formatting and filtering utilities sit in [app/src/utils](app/src/utils).
- Theme and currency are managed in [app/src/context/ThemeContext.tsx](app/src/context/ThemeContext.tsx).

## State Management

- Transactions and recurring expenses are provided via [app/src/context/TransactionsContext.tsx](app/src/context/TransactionsContext.tsx).
- Auth state is provided by [app/src/hooks/useAuth.ts](app/src/hooks/useAuth.ts).

## Coding Conventions

- Keep data normalization in models, not in UI components.
- Prefer small, focused components with single responsibility.
- Reuse utilities from [app/src/utils](app/src/utils) instead of duplicating logic.
- Use shared types from [app/src/types](app/src/types) across UI and logic layers.

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
