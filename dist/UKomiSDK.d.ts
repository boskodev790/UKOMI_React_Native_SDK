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
export declare class UKomiSDK {
    private accessToken;
    private http;
    private apiKey;
    private apiSecret;
    /**
     * Creates a new UKomiSDK instance.
     * @param config - SDK configuration with API credentials
     */
    constructor(config: UKomiSDKConfig);
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
    authenticate(): Promise<string>;
    /**
     * Manually sets an access token if you already have one.
     * Useful when you want to reuse a previously obtained token.
     *
     * @param token - The access token to use
     */
    setAccessToken(token: string): void;
    /**
     * Gets the current access token.
     * @returns The current access token, or null if not authenticated
     */
    getAccessToken(): string | null;
    /**
     * Checks if the SDK is currently authenticated.
     * @returns True if authenticated, false otherwise
     */
    isAuthenticated(): boolean;
    /**
     * Gets the Account API client for account-related operations.
     * @returns AccountAPI instance
     * @throws {UKomiAuthException} If not authenticated
     */
    account(): AccountAPI;
    /**
     * Gets the Review API client for review-related operations.
     * @returns ReviewAPI instance
     * @throws {UKomiAuthException} If not authenticated
     */
    reviews(): ReviewAPI;
    /**
     * Gets the Product API client for product-related operations.
     * @returns ProductAPI instance
     * @throws {UKomiAuthException} If not authenticated
     */
    productAPI(): ProductAPI;
    /**
     * Gets the Order API client for order-related operations.
     * @returns OrderAPI instance
     * @throws {UKomiAuthException} If not authenticated
     */
    orderAPI(): OrderAPI;
    /**
     * Gets the Group API client for group-related operations.
     * @returns GroupAPI instance
     * @throws {UKomiAuthException} If not authenticated
     */
    groups(): GroupAPI;
    /**
     * Gets the Question API client for question and answer operations.
     * @returns QuestionAPI instance
     * @throws {UKomiAuthException} If not authenticated
     */
    questions(): QuestionAPI;
}
