/**
 * Base exception class for all U-KOMI SDK errors.
 * All SDK exceptions extend this class, allowing for unified error handling.
 */
export class UKomiException extends Error {
  /** Optional underlying error that caused this exception */
  public cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'UKomiException';
    if (cause) {
      this.cause = cause;
    }
  }
}

/**
 * Exception thrown when the U-KOMI API returns an error response.
 * Contains the HTTP status code and error message from the API.
 */
export class UKomiApiException extends UKomiException {
  /** HTTP status code or API error code */
  public code: number;

  constructor(
    code: number,
    message: string,
    cause?: Error
  ) {
    super(message, cause);
    this.name = 'UKomiApiException';
    this.code = code;
  }
}

/**
 * Thrown when POST /v1/{api_key}/review_submit returns status "field_error".
 * Inspect {@link fieldErrors} for per-field messages.
 */
export class UKomiFieldValidationException extends UKomiApiException {
  public readonly fieldErrors: Record<string, string>;

  constructor(fieldErrors: Record<string, string>, message?: string) {
    const fromFields = Object.entries(fieldErrors)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');
    const combined =
      message ?? (fromFields.length > 0 ? fromFields : 'Validation failed');
    super(422, combined);
    this.name = 'UKomiFieldValidationException';
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Exception thrown when authentication fails.
 * Typically occurs when invalid API credentials are provided.
 */
export class UKomiAuthException extends UKomiException {
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'UKomiAuthException';
  }
}

/**
 * Exception thrown when a network error occurs.
 * Indicates connectivity issues or the API server being unreachable.
 */
export class UKomiNetworkException extends UKomiException {
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'UKomiNetworkException';
  }
}

