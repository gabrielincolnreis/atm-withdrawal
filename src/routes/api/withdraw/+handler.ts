import { calculateNotes } from '../../../lib/withdrawal.js';
import { NoteUnavailableException, InvalidArgumentException } from '../../../lib/exceptions.js';

/**
 * Request body type for withdrawal endpoint
 */
interface WithdrawRequest {
  amount: number | null;
}

/**
 * Success response type
 */
interface WithdrawSuccessResponse {
  notes: number[];
  total: number;
}

/**
 * Error response type
 */
interface WithdrawErrorResponse {
  error: string;
  message: string;
}

/**
 * Handler context type
 */
interface HandlerContext {
  request: Request;
}

/**
 * POST handler for /api/withdraw endpoint
 * Calculates optimal note distribution for a withdrawal amount.
 */
export async function POST(context: HandlerContext): Promise<Response> {
  const { request } = context;

  try {
    // Parse request body
    let body: WithdrawRequest;
    try {
      body = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'InvalidRequest',
          message: 'Invalid JSON in request body.',
        } as WithdrawErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate body structure
    if (typeof body !== 'object' || body === null) {
      return new Response(
        JSON.stringify({
          error: 'InvalidRequest',
          message: 'Request body must be an object with an "amount" property.',
        } as WithdrawErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Calculate notes
    const notes = calculateNotes(body.amount);
    const total = notes.reduce((sum, note) => sum + note, 0);

    // Return success response
    return new Response(
      JSON.stringify({
        notes,
        total,
      } as WithdrawSuccessResponse),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    // Handle custom exceptions
    if (error instanceof InvalidArgumentException) {
      return new Response(
        JSON.stringify({
          error: 'InvalidArgumentException',
          message: error.message,
        } as WithdrawErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (error instanceof NoteUnavailableException) {
      return new Response(
        JSON.stringify({
          error: 'NoteUnavailableException',
          message: error.message,
        } as WithdrawErrorResponse),
        {
          status: 422,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Handle unexpected errors
    console.error('Unexpected error in withdraw handler:', error);
    return new Response(
      JSON.stringify({
        error: 'InternalServerError',
        message: 'An unexpected error occurred while processing your request.',
      } as WithdrawErrorResponse),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
