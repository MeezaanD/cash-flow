## Project Overview - Cash Flow

**Cash Flow** is a web application designed to help users track their income and expenses in real-time. Built for simplicity, speed, and privacy, it features secure authentication and cloud storage powered by Firebase.

## Key Features

- **Secure Login:** User authentication with Firebase.
- **Real-Time Tracking:** Instantly log and update income and expenses.
- **Clean Interface:** Simple, user-friendly design.
- **Cloud Sync:** Data stored and synced via Firebase.
- **Fast Hosting:** Deployed on Vercel for quick load times.
- **Import/Export (New):** Import transactions from CSV/JSON with validation and deduping, export all data as CSV/JSON from the Settings modal.

## Tech Stack

- **Frontend:** React, TypeScript, CSS
- **Backend:** Firebase Auth & Firestore
- **Hosting:** Vercel

## Goals

- Help users stay on top of their finances.
- Make budgeting easy and accessible.
- Keep data secure and always up to date.

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
