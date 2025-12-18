import { describe, it, expect } from 'vitest';
import { POST } from './+handler.js';

// Mock context object
interface HandlerContext {
  request: Request;
}

function createMockContext(method: string = 'POST', body: any = null): HandlerContext {
  return {
    request: {
      method,
      json: async () => body,
    } as any,
  };
}

describe('POST /api/withdraw handler', () => {
  describe('successful requests', () => {
    it('should return notes for valid withdrawal amount', async () => {
      const context = createMockContext('POST', { amount: 30 });
      const response = await POST(context);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        notes: [20, 10],
        total: 30,
      });
    });

    it('should return notes for $80', async () => {
      const context = createMockContext('POST', { amount: 80 });
      const response = await POST(context);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        notes: [50, 20, 10],
        total: 80,
      });
    });

    it('should return empty array for $0', async () => {
      const context = createMockContext('POST', { amount: 0 });
      const response = await POST(context);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        notes: [],
        total: 0,
      });
    });
  });

  describe('error cases', () => {
    it('should return 422 for NoteUnavailableException', async () => {
      const context = createMockContext('POST', { amount: 125 });
      const response = await POST(context);

      expect(response.status).toBe(422);
      const data = await response.json();
      expect(data).toMatchObject({
        error: 'NoteUnavailableException',
      });
      expect(data.message).toContain('125.00');
    });

    it('should return 400 for InvalidArgumentException (negative amount)', async () => {
      const context = createMockContext('POST', { amount: -130 });
      const response = await POST(context);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toMatchObject({
        error: 'InvalidArgumentException',
      });
      expect(data.message).toContain('negative');
    });

    it('should return 400 for InvalidArgumentException (null amount)', async () => {
      const context = createMockContext('POST', { amount: null });
      const response = await POST(context);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toMatchObject({
        error: 'InvalidArgumentException',
      });
      expect(data.message).toContain('null or undefined');
    });

    it('should return 400 for invalid JSON', async () => {
      const context: HandlerContext = {
        request: {
          method: 'POST',
          json: async () => {
            throw new Error('Invalid JSON');
          },
        } as any,
      };

      const response = await POST(context);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toMatchObject({
        error: 'InvalidRequest',
      });
      expect(data.message).toContain('Invalid JSON');
    });

    it('should return 400 for non-object body', async () => {
      const context = createMockContext('POST', 'not an object');
      const response = await POST(context);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toMatchObject({
        error: 'InvalidRequest',
      });
      expect(data.message).toContain('object');
    });
  });

  describe('edge cases', () => {
    it('should handle large amounts correctly', async () => {
      const context = createMockContext('POST', { amount: 1000 });
      const response = await POST(context);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.notes.length).toBe(10);
      expect(data.notes.every((note: number) => note === 100)).toBe(true);
      expect(data.total).toBe(1000);
    });

    it('should handle amounts requiring all denominations', async () => {
      const context = createMockContext('POST', { amount: 180 });
      const response = await POST(context);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.notes).toEqual([100, 50, 20, 10]);
      expect(data.total).toBe(180);
    });
  });
});
