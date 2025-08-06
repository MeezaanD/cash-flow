# Testing Documentation for Cash Flow Application

## Overview

This document outlines the testing strategy for the Cash Flow application, focusing on authentication and currency formatting functionality.

## Testing Stack

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing

## Test Structure

```
src/
├── __tests__/
│   └── utils/
│       └── test-utils.ts          # Test utilities and mocks
├── hooks/__tests__/
│   └── useAuth.test.ts            # Authentication hook tests
├── components/__tests__/
│   └── AuthModals.test.tsx       # Authentication modal tests
└── utils/__tests__/
    └── formatCurrency.test.ts     # ZAR currency formatting tests
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

## Test Categories

### 1. Authentication Tests

#### Hooks Testing

- **useAuth**: Tests authentication state management
  - User authentication state changes
  - Firebase auth integration
  - Error handling
  - Token management

#### Component Testing

- **AuthModals**: Tests authentication UI
  - Login/Register form validation
  - Google sign-in integration
  - Error message display
  - Loading states
  - Form reset functionality

### 2. Currency Formatting Tests

#### Utility Testing

- **formatCurrency**: Tests ZAR currency formatting
  - Positive and negative amounts
  - Zero amounts (including negative zero)
  - String input handling
  - Invalid input handling (NaN, Infinity)
  - Decimal precision and rounding
  - Large numbers with proper grouping
  - Very small amounts

## Test Coverage

### Authentication Features

- ✅ User registration (email/password and Google OAuth)
- ✅ User login (email/password and Google OAuth)
- ✅ Authentication state management
- ✅ Error handling for invalid credentials
- ✅ Loading states during authentication
- ✅ Form validation and submission

### Currency Features

- ✅ ZAR (South African Rand) currency formatting
- ✅ Proper locale formatting (en-ZA)
- ✅ Non-breaking space handling
- ✅ Decimal and thousands separators
- ✅ Edge case handling (invalid inputs, negative zero)

## Test Results

Current test suite includes:

- **20 authentication tests** (useAuth + AuthModals)
- **8 currency formatting tests** (formatCurrency)
- **Total: 28 tests passing**

## Configuration

### Jest Configuration

- ES modules support
- TypeScript compilation
- JSDOM environment
- CSS and asset mocking
- Environment variable mocking

### Mock Setup

- Firebase Auth mocking
- React Router mocking
- localStorage mocking
- Material-UI component mocking

## Best Practices

1. **Focused Testing**: Tests focus only on authentication and currency features
2. **Mock Isolation**: External dependencies are properly mocked
3. **Edge Case Coverage**: Invalid inputs and error scenarios are tested
4. **Realistic Scenarios**: Tests simulate actual user interactions
5. **Maintainable**: Clean, readable test code with proper setup/teardown
