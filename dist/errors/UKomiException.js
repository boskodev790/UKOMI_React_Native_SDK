/**
 * Base exception class for all U-KOMI SDK errors.
 * All SDK exceptions extend this class, allowing for unified error handling.
 */
export class UKomiException extends Error {
    constructor(message, cause) {
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
    constructor(code, message, cause) {
        super(message, cause);
        this.name = 'UKomiApiException';
        this.code = code;
    }
}
/**
 * Exception thrown when authentication fails.
 * Typically occurs when invalid API credentials are provided.
 */
export class UKomiAuthException extends UKomiException {
    constructor(message, cause) {
        super(message, cause);
        this.name = 'UKomiAuthException';
    }
}
/**
 * Exception thrown when a network error occurs.
 * Indicates connectivity issues or the API server being unreachable.
 */
export class UKomiNetworkException extends UKomiException {
    constructor(message, cause) {
        super(message, cause);
        this.name = 'UKomiNetworkException';
    }
}
