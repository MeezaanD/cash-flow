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

- **Frontend:** React, TypeScript, CSS
- **Backend:** Firebase Auth & Firestore
- **Hosting:** Vercel

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
