import { describe, it, expect } from 'vitest';
import { NoteUnavailableException, InvalidArgumentException } from './exceptions.js';

describe('Custom Exceptions', () => {
  describe('NoteUnavailableException', () => {
    it('should create exception with correct message', () => {
      const exception = new NoteUnavailableException(125);
      expect(exception).toBeInstanceOf(Error);
      expect(exception).toBeInstanceOf(NoteUnavailableException);
      expect(exception.name).toBe('NoteUnavailableException');
      expect(exception.message).toBe(
        'The requested amount of $125.00 cannot be satisfied with available notes.'
      );
    });

    it('should format amount correctly in message', () => {
      const exception = new NoteUnavailableException(5.5);
      expect(exception.message).toContain('$5.50');
    });
  });

  describe('InvalidArgumentException', () => {
    it('should create exception with custom message', () => {
      const exception = new InvalidArgumentException('Test error message');
      expect(exception).toBeInstanceOf(Error);
      expect(exception).toBeInstanceOf(InvalidArgumentException);
      expect(exception.name).toBe('InvalidArgumentException');
      expect(exception.message).toBe('Test error message');
    });
  });
});
