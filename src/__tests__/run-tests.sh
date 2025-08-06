#!/bin/bash

# Test runner script for Cash Flow application
echo "🧪 Running Cash Flow Application Tests"
echo "======================================"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run tests with coverage
echo "🔍 Running tests with coverage..."
npm run test:coverage

# Check if tests passed
if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
    echo "📊 Coverage report generated in coverage/ directory"
else
    echo "❌ Some tests failed!"
    exit 1
fi

echo ""
echo "🎯 Test Summary:"
echo "- Unit tests for hooks (useAuth, useTransactions)"
echo "- Component tests (AuthModals, Sidebar, ThemeContext)"
echo "- Utility function tests (formatCurrency, formatDate, dateRangeFilter)"
echo "- Integration tests for token functionality"
echo "- Coverage threshold: 70%" 