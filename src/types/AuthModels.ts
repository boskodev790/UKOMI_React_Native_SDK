/**
 * Authentication response containing the access token.
 * Returned by the authenticate endpoint after successful authentication.
 */
export interface AccessTokenData {
  /** Access token for authenticated API requests */
  access_token: string;
}

