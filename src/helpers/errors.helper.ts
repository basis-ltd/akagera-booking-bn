export interface CustomError extends Error {
  data: object | null | undefined;
}

export class AppError extends Error implements CustomError {
  statusCode: number;
  errorCode: string;
  data: object | null | undefined;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string = 'GENERIC_ERROR',
    data: object | null | undefined = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

// VALIDATION ERROR
export class ValidationError extends AppError {
  constructor(message: string, errorCode: string = 'VALIDATION_ERROR') {
    super(message, 400, errorCode);
  }
}

// NOT FOUND ERROR
export class NotFoundError extends AppError {
  constructor(message: string, errorCode: string = 'NOT_FOUND') {
    super(message, 404, errorCode);
  }
}

// CONFLICT ERROR
export class ConflictError extends AppError {
  constructor(
    message: string,
    errorCode: string = 'CONFLICT',
    data: object | null | undefined = null,
  ) {
    super(message, 409, errorCode, data);
  }
}
