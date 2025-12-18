/**
 * Base API response wrapper used by all U-KOMI API endpoints.
 * The API may return code as either a string or number.
 */
export interface ApiResponse<T> {
  /** Response status (typically 'OK' for successful requests) */
  status: string;
  /** HTTP status code or API error code (may be string or number) */
  code: number | string;
  /** Response data payload (primary field) */
  data?: T;
  /** Alternative response data field (used by some endpoints) */
  response?: T;
}

/**
 * API response wrapper for product-related endpoints.
 */
export interface ApiProductResponse<T> {
  /** Array of products */
  products: T[];
}

/**
 * API response wrapper for order-related endpoints.
 */
export interface ApiOrdersResponse<T> {
  /** Array of orders */
  orders: T[];
}

