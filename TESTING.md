# Testing Documentation for Cash Flow Application

## Overview

This document outlines the comprehensive testing strategy for the Cash Flow application, including unit tests, integration tests, and the new token feature functionality.

## Testing Stack

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing

## Test Structure

```
src/
├── __tests__/
│   ├── utils/
│   │   └── test-utils.tsx          # Test utilities and mocks
│   └── integration/
│       └── token-integration.test.tsx # Integration tests
├── hooks/__tests__/
│   ├── useAuth.test.ts             # Authentication hook tests
│   └── useTransactions.test.ts     # Transaction management tests
├── components/__tests__/
│   ├── AuthModals.test.tsx        # Authentication modal tests
│   └── Sidebar.test.tsx           # Sidebar component tests
├── context/__tests__/
│   └── ThemeContext.test.tsx      # Theme context tests
└── utils/__tests__/
    ├── formatCurrency.test.ts      # Currency formatting tests
    ├── formatDate.test.ts          # Date formatting tests
    └── dateRangeFilter.test.ts     # Date range filtering tests
```

## Running Tests

### Quick Start

```bash
# Install dependencies (if not already installed)
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Using the Test Runner Script

```bash
# Make the script executable
chmod +x src/__tests__/run-tests.sh

# Run tests with the script
./src/__tests__/run-tests.sh
```

## Test Categories

### 1. Unit Tests

#### Hooks Testing

- **useAuth**: Tests authentication state management

  - User authentication state changes
  - Firebase auth integration
  - Error handling
  - Token management

- **useTransactions**: Tests transaction CRUD operations
  - Fetching transactions
  - Adding new transactions
  - Updating transactions
  - Deleting transactions
  - Error handling for unauthenticated users

#### Component Testing

- **AuthModals**: Tests authentication UI

  - Login/Register form validation
  - Google sign-in integration
  - Error message display
  - Loading states
  - Form reset functionality

- **Sidebar**: Tests navigation and user interface

  - User authentication display
  - Logout functionality with token removal
  - Transaction list rendering
  - Search functionality
  - View switching

- **ThemeContext**: Tests theme management
  - Theme switching (light/dark)
  - localStorage persistence
  - Context provider functionality
  - Error handling for invalid themes

#### Utility Function Testing

- **formatCurrency**: Tests currency formatting

  - Positive and negative numbers
  - Decimal handling
  - Large number formatting
  - Invalid input handling

- **formatDate**: Tests date formatting

  - Various date formats
  - Firestore timestamp handling
  - Invalid date handling
  - Edge cases

- **dateRangeFilter**: Tests date range filtering
  - Date range filtering logic
  - Firestore timestamp support
  - Empty/invalid input handling
  - Edge case dates

### 2. Integration Tests

#### Token Integration Testing

- **Authentication Flow**: Complete login/logout flow with token management
- **Google Sign-in**: OAuth integration with token storage
- **Error Handling**: Graceful handling of authentication errors
- **Token Persistence**: Token storage and retrieval across sessions
- **Security**: Token removal on logout and error scenarios

## Testing Strategy

### Mocking Strategy

1. **Firebase Services**: All Firebase auth and Firestore operations are mocked
2. **React Router**: Navigation functions are mocked for component testing
3. **localStorage**: Browser storage is mocked for token testing
4. **External APIs**: All external API calls are mocked

### Test Utilities

The `test-utils.tsx` file provides:

- Custom render function with providers
- Mock user and transaction data
- Authentication state helpers
- Mock cleanup utilities

### Coverage Requirements

- **Minimum Coverage**: 70% for all metrics (branches, functions, lines, statements)
- **Critical Paths**: 100% coverage for authentication and token management
- **Error Handling**: All error scenarios must be tested

## Token Feature Testing

### Authentication Flow Tests

1. **Login Process**:

   - Email/password authentication
   - Google OAuth authentication
   - Token storage in localStorage
   - Navigation to dashboard

2. **Logout Process**:

   - Firebase signOut call
   - Token removal from localStorage
   - UI state updates
   - Error handling for failed logout

3. **Token Persistence**:

   - Token storage across page reloads
   - Token validation
   - Expired token handling

4. **Security Tests**:
   - Token removal on logout
   - Error handling for network failures
   - Invalid token handling

### Integration Test Scenarios

```typescript
// Example integration test structure
describe("Token Integration Tests", () => {
  describe("Authentication Flow with Token Management", () => {
    it("should handle complete login flow with token storage");
    it("should handle complete logout flow with token removal");
    it("should handle Google sign-in with token management");
    it("should handle authentication errors gracefully");
  });

  describe("Transaction Management with Authentication", () => {
    it("should handle transactions with authenticated user");
    it("should clear transactions when user logs out");
  });

  describe("Token Persistence and Security", () => {
    it("should persist authentication state across page reloads");
    it("should clear token on logout even if Firebase signOut fails");
    it("should handle token expiration gracefully");
  });
});
```

## Best Practices

### Writing Tests

1. **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification
2. **Descriptive Names**: Use clear, descriptive test names
3. **Isolation**: Each test should be independent and not rely on other tests
4. **Mocking**: Mock external dependencies to ensure test isolation

### Test Data

- Use consistent mock data across tests
- Create realistic test scenarios
- Test edge cases and error conditions
- Use TypeScript for type safety in tests

### Performance

- Tests should run quickly (< 30 seconds for full suite)
- Use efficient mocking strategies
- Avoid unnecessary re-renders in component tests

## Debugging Tests

### Common Issues

1. **Mock Not Working**: Ensure mocks are set up before component rendering
2. **Async Tests**: Use `waitFor` for asynchronous operations
3. **Firebase Errors**: Check that Firebase services are properly mocked
4. **TypeScript Errors**: Ensure test files have proper type annotations

### Debug Commands

```bash
# Run specific test file
npm test -- useAuth.test.ts

# Run tests with verbose output
npm test -- --verbose

# Run tests with coverage for specific file
npm test -- --coverage --collectCoverageFrom="src/hooks/useAuth.ts"
```

## Continuous Integration

The testing setup is designed to work with CI/CD pipelines:

- Tests run on every commit
- Coverage reports are generated
- Failed tests prevent deployment
- Coverage thresholds are enforced

## Future Enhancements

1. **E2E Testing**: Add end-to-end tests with Cypress or Playwright
2. **Visual Testing**: Add visual regression tests
3. **Performance Testing**: Add performance benchmarks
4. **Accessibility Testing**: Add accessibility testing with jest-axe

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain coverage thresholds
4. Update this documentation if needed

## Support

For questions about testing:

1. Check this documentation
2. Review existing test examples
3. Consult Jest and React Testing Library documentation
4. Create an issue for unclear test scenarios
