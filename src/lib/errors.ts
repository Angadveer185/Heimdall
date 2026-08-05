import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Base API Error
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: unknown[],
  ) {
    super(message);
    this.name = this.constructor.name;
    // Captures clean stack trace in V8 environments (Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// 400 Bad Request / Validation Errors
export class BadRequestError extends ApiError {
  constructor(message = "Bad request", errors?: unknown[]) {
    super(400, message, errors);
  }
}

// 401 Unauthorized (Missing or invalid token)
export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized access") {
    super(401, message);
  }
}

// 403 Forbidden (Authenticated, but lacks permissions)
export class ForbiddenError extends ApiError {
  constructor(message = "Access forbidden") {
    super(403, message);
  }
}

// 404 Not Found
export class NotFoundError extends ApiError {
  constructor(resource = "Resource") {
    super(404, `${resource} not found`);
  }
}

// 409 Conflict (e.g., Duplicate email)
export class ConflictError extends ApiError {
  constructor(message = "Resource conflict") {
    super(409, message);
  }
}

// 422 Unprocessable Entity (Semantic errors)
export class UnprocessableEntityError extends ApiError {
  constructor(message = "Unprocessable entity") {
    super(422, message);
  }
}

// 429 Too Many Requests (Rate limiting)
export class TooManyRequestsError extends ApiError {
  constructor(message = "Too many requests, please try again later") {
    super(429, message);
  }
}

// 500 Internal Server Error
export class InternalServerError extends ApiError {
  constructor(message = "Internal server error") {
    super(500, message);
  }
}

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { success: false, errors: error.issues },
      { status: 400 },
    );
  }
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        ...(error.errors && { errors: error.errors }),
      },
      { status: error.statusCode },
    );
  }

  // Fallback for unhandled unexpected JS errors (e.g., syntax errors, network drop)
  console.error("Unhandled Error:", error);
  return NextResponse.json(
    { success: false, message: "Something went wrong" },
    { status: 500 },
  );
}
