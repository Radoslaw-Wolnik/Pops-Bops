// src/utils/custom-errors.util.ts

export class CustomError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends CustomError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
  }
}


export class ExpiredTokenError extends CustomError {
  constructor(message: string = 'Token has expired') {
    super(message, 401);
  }
}

export class InvalidTokenError extends CustomError {
  constructor(message: string = 'Token is invalid') {
    super(message, 403);
  }
}

export class RateLimitError extends CustomError {
  constructor(message: string = 'Too many requests. Please try again later.') {
    super(message, 429); // 429 is the HTTP status code for rate-limiting
  }
}

export class ServiceUnavailableError extends CustomError {
  constructor(message: string = 'Service is currently unavailable') {
    super(message, 503); // 503 is the HTTP status code for service unavailable
  }
}