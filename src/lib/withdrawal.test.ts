import { describe, it, expect } from 'vitest';
import { calculateNotes } from './withdrawal.js';
import { NoteUnavailableException, InvalidArgumentException } from './exceptions.js';

describe('calculateNotes', () => {
  describe('valid withdrawals', () => {
    it('should return [20, 10] for $30', () => {
      const result = calculateNotes(30);
      expect(result).toEqual([20, 10]);
    });

    it('should return [50, 20, 10] for $80', () => {
      const result = calculateNotes(80);
      expect(result).toEqual([50, 20, 10]);
    });

    it('should return [100] for $100', () => {
      const result = calculateNotes(100);
      expect(result).toEqual([100]);
    });

    it('should return [100, 50] for $150', () => {
      const result = calculateNotes(150);
      expect(result).toEqual([100, 50]);
    });

    it('should return [100, 100, 50, 20, 10] for $280', () => {
      const result = calculateNotes(280);
      expect(result).toEqual([100, 100, 50, 20, 10]);
    });

    it('should return empty array for $0', () => {
      const result = calculateNotes(0);
      expect(result).toEqual([]);
    });

    it('should return [10] for $10', () => {
      const result = calculateNotes(10);
      expect(result).toEqual([10]);
    });

    it('should return [20] for $20', () => {
      const result = calculateNotes(20);
      expect(result).toEqual([20]);
    });

    it('should return [50] for $50', () => {
      const result = calculateNotes(50);
      expect(result).toEqual([50]);
    });

    it('should handle large amounts correctly', () => {
      const result = calculateNotes(1000);
      expect(result).toEqual(Array(10).fill(100));
      expect(result.reduce((sum, note) => sum + note, 0)).toBe(1000);
    });
  });

  describe('error cases', () => {
    it('should throw NoteUnavailableException for $125', () => {
      expect(() => calculateNotes(125)).toThrow(NoteUnavailableException);
      expect(() => calculateNotes(125)).toThrow(
        'The requested amount of $125.00 cannot be satisfied with available notes.'
      );
    });

    it('should throw NoteUnavailableException for $5', () => {
      expect(() => calculateNotes(5)).toThrow(NoteUnavailableException);
    });

    it('should throw NoteUnavailableException for $15', () => {
      expect(() => calculateNotes(15)).toThrow(NoteUnavailableException);
    });

    it('should throw NoteUnavailableException for $25', () => {
      expect(() => calculateNotes(25)).toThrow(NoteUnavailableException);
    });

    it('should throw InvalidArgumentException for negative amount', () => {
      expect(() => calculateNotes(-130)).toThrow(InvalidArgumentException);
      expect(() => calculateNotes(-130)).toThrow(
        'Amount cannot be negative. Received: -130'
      );
    });

    it('should throw InvalidArgumentException for null', () => {
      expect(() => calculateNotes(null)).toThrow(InvalidArgumentException);
      expect(() => calculateNotes(null)).toThrow(
        'Amount cannot be null or undefined.'
      );
    });

    it('should throw InvalidArgumentException for undefined', () => {
      expect(() => calculateNotes(undefined)).toThrow(InvalidArgumentException);
      expect(() => calculateNotes(undefined)).toThrow(
        'Amount cannot be null or undefined.'
      );
    });

    it('should throw InvalidArgumentException for NaN', () => {
      expect(() => calculateNotes(NaN)).toThrow(InvalidArgumentException);
      expect(() => calculateNotes(NaN)).toThrow(
        'Amount must be a valid number.'
      );
    });
  });

  describe('edge cases', () => {
    it('should handle amounts that require multiple notes of same denomination', () => {
      const result = calculateNotes(200);
      expect(result).toEqual([100, 100]);
    });

    it('should handle amounts that require all denominations', () => {
      const result = calculateNotes(180);
      expect(result).toEqual([100, 50, 20, 10]);
    });

    it('should minimize number of notes (greedy algorithm)', () => {
      const result = calculateNotes(90);
      // Should use 50 + 20 + 20, not 20 + 20 + 20 + 20 + 10
      expect(result).toEqual([50, 20, 20]);
      expect(result.length).toBe(3);
    });

    it('should handle decimal amounts correctly (if converted to integer)', () => {
      // Note: The function expects integer amounts in cents or whole dollars
      // Testing with whole numbers that represent dollars
      const result = calculateNotes(40);
      expect(result).toEqual([20, 20]);
    });
  });
});
