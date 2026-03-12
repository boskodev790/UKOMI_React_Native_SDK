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
    /** Optional base URL for the API (defaults to production URL) */
    baseUrl?: string;
}
/**
 * Main U-KOMI SDK client for React Native applications.
 *
 * Provides a type-safe interface to interact with all U-KOMI API endpoints.
 * APIs do not require access_token; use the API key only.
 *
 * @example
 * ```typescript
 * import { UKomiSDK } from '@ukomi/react-native-sdk';
 *
 * const sdk = new UKomiSDK({
 *   apiKey: 'your-api-key'
 * });
 *
 * const reviews = await sdk.reviews().getAllReviews();
 * ```
 */
export declare class UKomiSDK {
    private http;
    private apiKey;
    /**
     * Creates a new UKomiSDK instance.
     * @param config - SDK configuration with API key (no access token or secret required)
     */
    constructor(config: UKomiSDKConfig);
    /**
     * Gets the Account API client for account-related operations.
     * @returns AccountAPI instance
     */
    account(): AccountAPI;
    /**
     * Gets the Review API client for review-related operations.
     * @returns ReviewAPI instance
     */
    reviews(): ReviewAPI;
    /**
     * Gets the Product API client for product-related operations.
     * @returns ProductAPI instance
     */
    productAPI(): ProductAPI;
    /**
     * Gets the Order API client for order-related operations.
     * @returns OrderAPI instance
     */
    orderAPI(): OrderAPI;
    /**
     * Gets the Group API client for group-related operations.
     * @returns GroupAPI instance
     */
    groups(): GroupAPI;
    /**
     * Gets the Question API client for question and answer operations.
     * @returns QuestionAPI instance
     */
    questions(): QuestionAPI;
}
