# Testing Framework Documentation

## Overview
This directory contains comprehensive testing structure for the Admin Panel Backend API.

## Test Structure
```
tests/
├── unit/                    # Unit tests for individual components
├── integration/             # API endpoint integration tests
├── models/                  # Database model tests
├── middleware/             # Middleware functionality tests
├── e2e/                    # End-to-end workflow tests
├── fixtures/               # Test data and mock objects
├── helpers/                # Testing utilities and helpers
├── performance/            # Load and stress tests
└── coverage/               # Test coverage reports
```

## Running Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:performance

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Test Environment Setup
1. Ensure MongoDB is running locally
2. Set up test database configuration
3. Install test dependencies: `npm install --save-dev jest supertest mongodb-memory-server`
