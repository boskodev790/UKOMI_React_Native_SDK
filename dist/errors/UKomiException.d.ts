/**
 * Base exception class for all U-KOMI SDK errors.
 * All SDK exceptions extend this class, allowing for unified error handling.
 */
export declare class UKomiException extends Error {
    /** Optional underlying error that caused this exception */
    cause?: Error;
    constructor(message: string, cause?: Error);
}
/**
 * Exception thrown when the U-KOMI API returns an error response.
 * Contains the HTTP status code and error message from the API.
 */
export declare class UKomiApiException extends UKomiException {
    /** HTTP status code or API error code */
    code: number;
    constructor(code: number, message: string, cause?: Error);
}
/**
 * Exception thrown when authentication fails.
 * Typically occurs when invalid API credentials are provided.
 */
export declare class UKomiAuthException extends UKomiException {
    constructor(message: string, cause?: Error);
}
/**
 * Exception thrown when a network error occurs.
 * Indicates connectivity issues or the API server being unreachable.
 */
export declare class UKomiNetworkException extends UKomiException {
    constructor(message: string, cause?: Error);
}
