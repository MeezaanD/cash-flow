# API Integration Guide

This document explains how the dual authentication system works and how to integrate with your real backend.

## Overview

The app now supports two authentication methods:

1. **Custom API Authentication** - Username/password → JWT token
2. **Firebase Authentication** - Email/password → Firebase user → JWT token

## Current Implementation

### Mock API Service (`src/services/api.ts`)

- Simulates a real backend API
- Provides authentication and financial data endpoints
- Easy to replace with your actual API

### Authentication Flow

#### API Authentication:

```
User enters username/password →
API validates credentials →
Returns JWT token →
Token stored in localStorage →
Used for subsequent API calls
```

#### Firebase Authentication:

```
User enters email/password →
Firebase validates credentials →
Creates mock JWT token →
Token stored in localStorage →
Used for subsequent API calls
```

## Demo Credentials

For testing the API authentication:

- **Username**: `demo`
- **Password**: `demo123`

## File Structure

```
src/
├── services/
│   ├── firebase.ts (existing - Firebase config)
│   ├── api.ts (NEW - Mock API client)
│   └── authService.ts (NEW - Unified auth service)
├── hooks/
│   ├── useAuth.ts (updated - supports both auth methods)
│   ├── useTransactions.ts (updated - uses API data)
│   └── useApi.ts (NEW - API data fetching)
├── utils/
│   └── jwt.ts (NEW - JWT token management)
├── types/
│   └── api.ts (NEW - API type definitions)
└── components/
    └── LoginForm.tsx (NEW - Dual auth login form)
```

## Replacing Mock API with Real Backend

### 1. Update API Base URL

In `src/services/api.ts`, change:

```typescript
const API_BASE_URL = "Im just putting this here so long";
```

### 2. Implement Real API Endpoints

Your backend should implement these endpoints:

#### Authentication Endpoint

```
POST /auth/login
Content-Type: application/json

{
  "username": "user",
  "password": "password"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "username",
      "email": "user@example.com"
    }
  }
}
```

#### Financial Data Endpoint

```
GET /financial-data
Authorization: Bearer jwt_token_here

Response:
{
  "success": true,
  "data": {
    "transactions": [...],
    "summary": {
      "totalIncome": 5000,
      "totalExpenses": 1200,
      "netAmount": 3800
    },
    "categories": {
      "income": [...],
      "expenses": [...]
    }
  }
}
```

### 3. Update API Client

Replace the mock implementation in `src/services/api.ts` with real HTTP calls:

```typescript
// mock fetch for now
private async request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${this.baseUrl}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Request failed'
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
}
```

## Security Considerations

1. **JWT Token Storage**: Tokens are stored in localStorage. Consider using httpOnly cookies for better security.
2. **Token Expiration**: Implement proper token refresh logic.
3. **HTTPS**: Always use HTTPS in production.
4. **Input Validation**: Validate all inputs on both client and server.

## Testing

1. Start the development server: `npm run dev`
2. Navigate to the home page
3. Try both authentication methods:
   - API Login: Use demo/demo123
   - Firebase Login: Use your Firebase credentials
4. Check that financial data loads in the dashboard

## Next Steps

1. Implement your real backend API
2. Add transaction creation/update/delete endpoints
3. Implement proper error handling
4. Add loading states and user feedback
5. Implement token refresh logic
6. Add proper validation and security measures

## Troubleshooting

- **CORS Issues**: Ensure your backend allows requests from your frontend domain
- **Authentication Errors**: Check that JWT tokens are being sent correctly
- **Data Not Loading**: Verify API endpoints are working and returning correct data format
