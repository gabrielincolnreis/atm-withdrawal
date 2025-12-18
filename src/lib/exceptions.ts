/**
 * Custom exception thrown when the requested amount cannot be satisfied
 * with available note denominations.
 */
export class NoteUnavailableException extends Error {
  constructor(amount: number) {
    super(`The requested amount of $${amount.toFixed(2)} cannot be satisfied with available notes.`);
    this.name = 'NoteUnavailableException';
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoteUnavailableException);
    }
  }
}

/**
 * Custom exception thrown when invalid arguments are provided
 * (e.g., null, undefined, negative amounts).
 */
export class InvalidArgumentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidArgumentException';
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidArgumentException);
    }
  }
}
