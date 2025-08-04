# Simple API Implementation

This document describes the clean, simplified API implementation that provides exactly the two APIs you requested:

## 1. Authentication API

**Endpoint**: `POST /api/auth/login` (mock implementation)
**Purpose**: Accepts username/password and returns a JWT token

### Request:

```json
{
  "username": "demo",
  "password": "demo123"
}
```

### Response:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "username": "demo",
      "email": "demo@example.com"
    }
  }
}
```

## 2. Financial Data API

**Endpoint**: `GET /api/financial-data` (mock implementation)
**Purpose**: Accepts JWT token and returns financial data for the user

### Request Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response:

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "1",
        "type": "expense",
        "title": "Grocery Shopping",
        "category": "Food & Dining",
        "description": "Weekly groceries from supermarket",
        "amount": 85.5,
        "date": "2024-01-15",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "summary": {
      "totalIncome": 4300.0,
      "totalExpenses": 146.49,
      "netAmount": 4153.51
    },
    "categories": {
      "income": [{ "name": "Salary", "amount": 3500.0 }],
      "expenses": [{ "name": "Food & Dining", "amount": 85.5 }]
    }
  }
}
```

## Implementation Files

### Core API Services

- `src/services/simpleApi.ts` - Mock API implementation
- `src/services/simpleAuthService.ts` - Authentication service
- `src/utils/jwt.ts` - JWT token management

### React Hooks

- `src/hooks/useSimpleAuth.ts` - Authentication hook
- `src/hooks/useSimpleApi.ts` - Financial data hook

### Components

- `src/components/SimpleLoginForm.tsx` - Login form
- `src/components/SimpleProtectedRoute.tsx` - Route protection
- `src/pages/SimpleLoginPage.tsx` - Login page
- `src/pages/SimpleDashboard.tsx` - Dashboard

## Demo Credentials

### User 1:

- **Username**: `demo`
- **Password**: `demo123`

### User 2:

- **Username**: `test`
- **Password**: `test123`

## How to Test

1. **Go to the home page** (`http://localhost:5175/`)
2. **Click "Try Simple API Login"** or go to `/simple-login`
3. **Enter demo credentials** (demo/demo123 or test/test123)
4. **View the dashboard** at `/simple-dashboard`

## API Flow

1. **Login**: User enters username/password
2. **Authentication**: API validates credentials and returns JWT token
3. **Token Storage**: JWT token is stored in localStorage
4. **Data Fetching**: Dashboard uses JWT token to fetch financial data
5. **Display**: Financial data is displayed in a clean dashboard

## Security Features

- **JWT Token Validation**: Tokens are validated for expiration
- **Protected Routes**: Dashboard is only accessible to authenticated users
- **Automatic Logout**: Expired tokens trigger automatic logout
- **Secure Storage**: Tokens are stored securely in localStorage

## Replacing with Real Backend

To replace the mock API with a real backend:

1. **Update `src/services/simpleApi.ts`**:

   ```typescript
   // mock API calls
   async authenticate(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
     const response = await fetch('/api/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(credentials)
     });
     return response.json();
   }
   ```

2. **Update `src/services/simpleApi.ts`**:
   ```typescript
   // mock API calls
   async getFinancialData(authHeader: string): Promise<ApiResponse<FinancialData>> {
     const response = await fetch('/api/financial-data', {
       headers: { Authorization: authHeader }
     });
     return response.json();
   }
   ```

## Key Benefits

- ✅ **Clean Separation**: No Firebase dependencies
- ✅ **Simple Authentication**: Username/password only
- ✅ **JWT Security**: Token-based authentication
- ✅ **Protected Data**: Financial data requires authentication
- ✅ **Easy to Replace**: Mock API can be easily replaced with real backend
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Error Handling**: Comprehensive error handling
- ✅ **Loading States**: Proper loading and error states

## File Structure

```
src/
├── services/
│   ├── simpleApi.ts          # Mock API implementation
│   └── simpleAuthService.ts  # Authentication service
├── hooks/
│   ├── useSimpleAuth.ts      # Authentication hook
│   └── useSimpleApi.ts       # Financial data hook
├── components/
│   ├── SimpleLoginForm.tsx   # Login form
│   └── SimpleProtectedRoute.tsx # Route protection
├── pages/
│   ├── SimpleLoginPage.tsx   # Login page
│   └── SimpleDashboard.tsx   # Dashboard
└── utils/
    └── jwt.ts               # JWT utilities
```

This implementation provides exactly what you requested: a clean, simple API authentication system with JWT tokens and a protected financial data API.
