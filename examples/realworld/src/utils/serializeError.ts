import type { SerializedError } from "@reduxjs/toolkit";

export type SerializedValidationError = SerializedError & {
  errors?: Record<string, string[]>;
};

export class ValidationError extends Error {
  public readonly name = "ValidationError";

  public constructor(
    public readonly message: string,
    public readonly errors: Record<string, string[]>
  ) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this);
    }
  }

  public static isValidationError(error: unknown): error is ValidationError {
    return error instanceof ValidationError;
  }

  public toJSON(): SerializedValidationError {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      errors: this.errors,
    };
  }
}

export function serializeError(error: unknown): SerializedValidationError {
  if (ValidationError.isValidationError(error)) {
    return error.toJSON();
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return { message: String(error) };
}
