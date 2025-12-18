import { HttpClient } from './utils/HttpClient';
import { UKomiAuthException, UKomiException } from './errors/UKomiException';
import { ApiConfig } from './config/ApiConfig';
import { AccessTokenData } from './types/AuthModels';
import { AccountAPI } from './api/AccountAPI';
import { ReviewAPI } from './api/ReviewAPI';
import { ProductAPI } from './api/ProductAPI';
import { OrderAPI } from './api/OrderAPI';
import { GroupAPI } from './api/GroupAPI';
import { QuestionAPI } from './api/QuestionAPI';

/**
 * Configuration options for initializing the UKomiSDK.
 */
export interface UKomiSDKConfig {
  /** Your U-KOMI API key */
  apiKey: string;
  /** Your U-KOMI API secret */
  apiSecret: string;
  /** Optional base URL for the API (defaults to production URL) */
  baseUrl?: string;
}

/**
 * Main U-KOMI SDK client for React Native applications.
 * 
 * Provides a type-safe interface to interact with all U-KOMI API endpoints.
 * 
 * @example
 * ```typescript
 * import { UKomiSDK } from '@ukomi/react-native-sdk';
 * 
 * const sdk = new UKomiSDK({
 *   apiKey: 'your-api-key',
 *   apiSecret: 'your-api-secret'
 * });
 * 
 * await sdk.authenticate();
 * const reviews = await sdk.reviews().getAllReviews();
 * ```
 */
export class UKomiSDK {
  private accessToken: string | null = null;
  private http: HttpClient;
  private apiKey: string;
  private apiSecret: string;

  /**
   * Creates a new UKomiSDK instance.
   * @param config - SDK configuration with API credentials
   */
  constructor(config: UKomiSDKConfig) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    const baseUrl = config.baseUrl ?? ApiConfig.BASE_URL;
    this.http = new HttpClient(baseUrl);
  }

  /**
   * Authenticates with the U-KOMI API using the provided credentials.
   * Stores the access token for subsequent API calls.
   * 
   * @returns Promise resolving to the access token
   * @throws {UKomiAuthException} When authentication fails
   * 
   * @example
   * ```typescript
   * try {
   *   const token = await sdk.authenticate();
   *   console.log('Authenticated successfully');
   * } catch (error) {
   *   console.error('Authentication failed:', error.message);
   * }
   * ```
   */
  async authenticate(): Promise<string> {
    try {
      const response = await this.http.postFormUrlEncoded<AccessTokenData>('auth/access_token', {
        api_key: this.apiKey,
        api_secret: this.apiSecret,
      });

      this.setAccessToken(response.access_token);
      return response.access_token;
    } catch (error) {
      if (error instanceof UKomiException) {
        throw new UKomiAuthException(
          `Authentication failed: ${error.message}`,
          error
        );
      }
      throw new UKomiAuthException(
        'Authentication failed: Network error',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Manually sets an access token if you already have one.
   * Useful when you want to reuse a previously obtained token.
   * 
   * @param token - The access token to use
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
    this.http.setAccessToken(token);
  }

  /**
   * Gets the current access token.
   * @returns The current access token, or null if not authenticated
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Checks if the SDK is currently authenticated.
   * @returns True if authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  /**
   * Gets the Account API client for account-related operations.
   * @returns AccountAPI instance
   * @throws {UKomiAuthException} If not authenticated
   */
  account(): AccountAPI {
    if (!this.accessToken) {
      throw new UKomiAuthException('Not authenticated. Call authenticate() first.');
    }
    return new AccountAPI(this.http, this.apiKey, this.accessToken);
  }

  /**
   * Gets the Review API client for review-related operations.
   * @returns ReviewAPI instance
   * @throws {UKomiAuthException} If not authenticated
   */
  reviews(): ReviewAPI {
    if (!this.accessToken) {
      throw new UKomiAuthException('Not authenticated. Call authenticate() first.');
    }
    return new ReviewAPI(this.http, this.apiKey, this.accessToken);
  }

  /**
   * Gets the Product API client for product-related operations.
   * @returns ProductAPI instance
   * @throws {UKomiAuthException} If not authenticated
   */
  productAPI(): ProductAPI {
    if (!this.accessToken) {
      throw new UKomiAuthException('Not authenticated. Call authenticate() first.');
    }
    return new ProductAPI(this.http, this.apiKey, this.accessToken);
  }

  /**
   * Gets the Order API client for order-related operations.
   * @returns OrderAPI instance
   * @throws {UKomiAuthException} If not authenticated
   */
  orderAPI(): OrderAPI {
    if (!this.accessToken) {
      throw new UKomiAuthException('Not authenticated. Call authenticate() first.');
    }
    return new OrderAPI(this.http, this.apiKey, this.accessToken);
  }

  /**
   * Gets the Group API client for group-related operations.
   * @returns GroupAPI instance
   * @throws {UKomiAuthException} If not authenticated
   */
  groups(): GroupAPI {
    if (!this.accessToken) {
      throw new UKomiAuthException('Not authenticated. Call authenticate() first.');
    }
    return new GroupAPI(this.http, this.apiKey, this.accessToken);
  }

  /**
   * Gets the Question API client for question and answer operations.
   * @returns QuestionAPI instance
   * @throws {UKomiAuthException} If not authenticated
   */
  questions(): QuestionAPI {
    if (!this.accessToken) {
      throw new UKomiAuthException('Not authenticated. Call authenticate() first.');
    }
    return new QuestionAPI(this.http, this.apiKey, this.accessToken);
  }
}

