# ATM Withdrawal System

A high-performance ATM withdrawal simulator that calculates the optimal distribution of banknotes for cash withdrawals. Built with Marko.js for minimal bundle size and maximum performance.

## Features

- **Optimal Note Distribution**: Uses a greedy algorithm to minimize the number of notes delivered
- **Error Handling**: Comprehensive validation with custom exceptions for invalid inputs and unavailable amounts
- **RESTful API**: Clean API endpoint for programmatic access
- **Modern UI**: Beautiful, responsive interface built with Marko.js
- **Fully Tested**: Comprehensive unit and integration tests with Vitest
- **Lightweight**: Minimal dependencies, optimized bundle size

## Problem Statement

Simulate the delivery of notes when a client makes a withdrawal at a cash machine with the following requirements:

- Always deliver the lowest number of possible notes
- Handle cases where the requested amount cannot be satisfied with available notes
- Client balance is infinite
- Supply of notes is infinite
- Available note denominations: $100.00, $50.00, $20.00, and $10.00

## Examples

| Input | Output |
|-------|--------|
| $30.00 | `[20.00, 10.00]` |
| $80.00 | `[50.00, 20.00, 10.00]` |
| $125.00 | `NoteUnavailableException` |
| -$130.00 | `InvalidArgumentException` |
| `null` | `InvalidArgumentException` |

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd atm-withdrawal
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the port shown in the terminal).

## Building for Production

Build the production-ready server:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

Run the production server:
```bash
npm start
```

## Testing

Run tests in watch mode:
```bash
npm test
```

Run tests once:
```bash
npm run test:run
```

## API Documentation

### POST /api/withdraw

Calculate the optimal note distribution for a withdrawal amount.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "amount": 80
}
```

#### Response

**Success (200 OK):**
```json
{
  "notes": [50, 20, 10],
  "total": 80
}
```

**Error Responses:**

- **400 Bad Request** - Invalid input (negative amount, null, undefined, invalid JSON)
```json
{
  "error": "InvalidArgumentException",
  "message": "Amount cannot be negative. Received: -130"
}
```

- **405 Method Not Allowed** - Non-POST request
```json
{
  "error": "MethodNotAllowed",
  "message": "Only POST requests are allowed."
}
```

- **422 Unprocessable Entity** - Amount cannot be satisfied with available notes
```json
{
  "error": "NoteUnavailableException",
  "message": "The requested amount of $125.00 cannot be satisfied with available notes."
}
```

- **500 Internal Server Error** - Unexpected server error
```json
{
  "error": "InternalServerError",
  "message": "An unexpected error occurred while processing your request."
}
```

#### Example Usage

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount": 80}'
```

**Using JavaScript (fetch):**
```javascript
const response = await fetch('/api/withdraw', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ amount: 80 }),
});

const data = await response.json();
console.log(data); // { notes: [50, 20, 10], total: 80 }
```

## Project Structure

```
src/
├── lib/
│   ├── withdrawal.ts          # Core withdrawal calculation logic
│   ├── withdrawal.test.ts     # Unit tests for withdrawal logic
│   ├── exceptions.ts           # Custom exception classes
│   └── exceptions.test.ts     # Unit tests for exceptions
├── routes/
│   ├── +layout.marko           # Application layout
│   ├── +page.marko            # Main ATM interface
│   ├── +meta.json             # Page metadata
│   └── api/
│       └── withdraw/
│           ├── +handler.ts    # API endpoint handler
│           └── +handler.test.ts # API integration tests
└── ...
```

## Algorithm

The system uses a **greedy algorithm** to minimize the number of notes:

1. Sort denominations in descending order: [100, 50, 20, 10]
2. For each denomination:
   - Calculate maximum notes: `Math.floor(remaining / denomination)`
   - Add notes to result array
   - Update remaining: `remaining % denomination`
3. If remainder > 0, throw `NoteUnavailableException`

**Time Complexity:** O(1) - constant time with fixed denominations  
**Space Complexity:** O(n) - where n is the number of notes

## Technology Stack

- **Marko.js** - High-performance UI framework with minimal bundle size
- **@marko/run** - Full-stack framework for Marko.js
- **TypeScript** - Type-safe development
- **Vitest** - Fast unit testing framework

## License

Private project - All rights reserved
