# API Documentation

This document describes the Firebase Cloud Functions API endpoints for the CashFlow application.

## Base URL

```
https://us-central1-cash-flow-eb5bd.cloudfunctions.net
```

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

### Getting a Firebase ID Token

In the application, you can get the current user's ID token:

```typescript
import { getIdToken } from "firebase/auth";
import { auth } from "./services/firebase";

const token = await getIdToken(auth.currentUser, true);
```

## Endpoints

### 1. Health Check

**GET** `/healthCheck`

Check if the API is running.

**Request:**

```http
GET /healthCheck
```

**Response:**

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes:**

- `200` - API is running
- `500` - Internal server error

### 2. Get User Transactions

**GET** `/getUserTransactions`

Retrieve all transactions for the authenticated user.

**Request:**

```http
GET /getUserTransactions
Authorization: Bearer <firebase_id_token>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "transaction_id",
      "userId": "user_uid",
      "amount": 100.5,
      "description": "Grocery shopping",
      "category": "Food",
      "type": "expense",
      "date": "2024-01-15",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "message": "Successfully retrieved 1 transactions"
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized (missing or invalid token)
- `405` - Method not allowed
- `500` - Internal server error

**Error Response:**

```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

## Data Models

### Transaction

```typescript
interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense";
  date: string;
  createdAt: string;
  updatedAt: string;
}
```

### API Response

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

| Status Code | Description           | Example Error                     |
| ----------- | --------------------- | --------------------------------- |
| `200`       | Success               | -                                 |
| `401`       | Unauthorized          | "Invalid or expired token"        |
| `405`       | Method not allowed    | "Only GET requests are supported" |
| `500`       | Internal server error | "Internal server error"           |

## CORS

The API includes CORS headers to allow cross-origin requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Security

1. **JWT Token Validation**: All protected endpoints validate Firebase ID tokens
2. **User Data Isolation**: Users can only access their own transactions
3. **Input Validation**: All inputs are validated and sanitized
4. **Error Handling**: Sensitive information is not exposed in error messages

## Testing

### Using cURL

**Health Check:**

```bash
curl -X GET https://us-central1-cash-flow-eb5bd.cloudfunctions.net/healthCheck
```

**Get User Transactions:**

```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  https://us-central1-cash-flow-eb5bd.cloudfunctions.net/getUserTransactions
```

### Using Postman

1. **Health Check:**

   - Method: `GET`
   - URL: `https://us-central1-cash-flow-eb5bd.cloudfunctions.net/healthCheck`

2. **Get User Transactions:**
   - Method: `GET`
   - URL: `https://us-central1-cash-flow-eb5bd.cloudfunctions.net/getUserTransactions`
   - Headers: `Authorization: Bearer YOUR_FIREBASE_ID_TOKEN`

## Monitoring

### Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to Functions
4. View logs, metrics, and performance data

### Function Logs

```bash
firebase functions:log
```

### Function Status

```bash
firebase functions:list
```

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure your domain is allowed in Firebase Console
   - Check that CORS headers are being sent

2. **Authentication Errors**

   - Verify the user is logged in
   - Check that the token is valid and not expired
   - Ensure the token is being sent in the correct format

3. **Function Not Found**
   - Verify the function is deployed
   - Check the function URL is correct
   - Ensure the function name matches the deployment

### Debugging

1. **Check Function Logs:**

   ```bash
   firebase functions:log --only getUserTransactions
   ```

2. **Test Locally:**

   ```bash
   firebase emulators:start --only functions
   ```

3. **Verify Deployment:**
   ```bash
   firebase functions:list
   ```

## Future Enhancements

1. **Additional Endpoints:**

   - `POST /transactions` - Create new transaction
   - `PUT /transactions/{id}` - Update transaction
   - `DELETE /transactions/{id}` - Delete transaction

2. **Query Parameters:**

   - Date range filtering
   - Category filtering
   - Pagination support

3. **Advanced Features:**
   - Bulk operations
   - Client-side import/export (Implemented in app UI: Settings → Data)
   - Analytics endpoints
