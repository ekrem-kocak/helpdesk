export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network connection failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fields?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

export function formatErrorForDisplay(error: unknown): {
  title: string;
  message: string;
} {
  if (isAPIError(error)) {
    return {
      title: `Error ${error.statusCode || ''}`.trim(),
      message: error.message,
    };
  }

  if (isNetworkError(error)) {
    return {
      title: 'Connection Error',
      message: error.message,
    };
  }

  if (isValidationError(error)) {
    return {
      title: 'Validation Error',
      message: error.message,
    };
  }

  return {
    title: 'Error',
    message: getErrorMessage(error),
  };
}
