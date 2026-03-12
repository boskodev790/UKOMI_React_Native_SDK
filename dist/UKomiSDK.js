import { HttpClient } from './utils/HttpClient';
import { ApiConfig } from './config/ApiConfig';
import { AccountAPI } from './api/AccountAPI';
import { ReviewAPI } from './api/ReviewAPI';
import { ProductAPI } from './api/ProductAPI';
import { OrderAPI } from './api/OrderAPI';
import { GroupAPI } from './api/GroupAPI';
import { QuestionAPI } from './api/QuestionAPI';
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
export class UKomiSDK {
    /**
     * Creates a new UKomiSDK instance.
     * @param config - SDK configuration with API key (no access token or secret required)
     */
    constructor(config) {
        this.apiKey = config.apiKey;
        const baseUrl = config.baseUrl ?? ApiConfig.BASE_URL;
        this.http = new HttpClient(baseUrl);
    }
    /**
     * Gets the Account API client for account-related operations.
     * @returns AccountAPI instance
     */
    account() {
        return new AccountAPI(this.http, this.apiKey);
    }
    /**
     * Gets the Review API client for review-related operations.
     * @returns ReviewAPI instance
     */
    reviews() {
        return new ReviewAPI(this.http, this.apiKey);
    }
    /**
     * Gets the Product API client for product-related operations.
     * @returns ProductAPI instance
     */
    productAPI() {
        return new ProductAPI(this.http, this.apiKey);
    }
    /**
     * Gets the Order API client for order-related operations.
     * @returns OrderAPI instance
     */
    orderAPI() {
        return new OrderAPI(this.http, this.apiKey);
    }
    /**
     * Gets the Group API client for group-related operations.
     * @returns GroupAPI instance
     */
    groups() {
        return new GroupAPI(this.http, this.apiKey);
    }
    /**
     * Gets the Question API client for question and answer operations.
     * @returns QuestionAPI instance
     */
    questions() {
        return new QuestionAPI(this.http, this.apiKey);
    }
}
