import { NoteUnavailableException, InvalidArgumentException } from './exceptions.js';

/**
 * Available note denominations in descending order.
 * This order ensures the greedy algorithm minimizes the number of notes.
 */
const DENOMINATIONS = [100, 50, 20, 10] as const;

/**
 * Calculates the optimal distribution of notes for a withdrawal amount.
 * Uses a greedy algorithm to minimize the number of notes delivered.
 *
 * @param amount - The withdrawal amount (must be a positive number divisible by available denominations)
 * @returns An array of note values (e.g., [50, 20, 10] for $80)
 * @throws {InvalidArgumentException} If amount is null, undefined, negative, or not a number
 * @throws {NoteUnavailableException} If the amount cannot be satisfied with available denominations
 *
 * @example
 * calculateNotes(30) // Returns [20, 10]
 * calculateNotes(80) // Returns [50, 20, 10]
 * calculateNotes(125) // Throws NoteUnavailableException
 */
export function calculateNotes(amount: number | null | undefined): number[] {
  // Validate input
  if (amount === null || amount === undefined) {
    throw new InvalidArgumentException('Amount cannot be null or undefined.');
  }

  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new InvalidArgumentException('Amount must be a valid number.');
  }

  if (amount < 0) {
    throw new InvalidArgumentException(`Amount cannot be negative. Received: ${amount}`);
  }

  // Handle zero amount
  if (amount === 0) {
    return [];
  }

  const notes: number[] = [];
  let remaining = amount;

  // Use greedy algorithm: always use the largest denomination possible
  for (const denomination of DENOMINATIONS) {
    const count = Math.floor(remaining / denomination);
    
    // Add the notes to the result
    for (let i = 0; i < count; i++) {
      notes.push(denomination);
    }
    
    // Update remaining amount
    remaining = remaining % denomination;
    
    // If we've used all the amount, we're done
    if (remaining === 0) {
      break;
    }
  }

  // If there's still a remainder, the amount cannot be satisfied
  if (remaining > 0) {
    throw new NoteUnavailableException(amount);
  }

  return notes;
}
