import { HttpClient } from '../utils/HttpClient';
import { Product, ProductReviewSummary, ProductReviewMeta, ProductRequestParams } from '../types/ProductModels';
/**
 * Product API client for managing products and product-related data.
 * Provides methods to retrieve products, review summaries, and metadata.
 */
export declare class ProductAPI {
    private http;
    private apiKey;
    private accessToken;
    constructor(http: HttpClient, apiKey: string, accessToken: string);
    /**
     * Retrieves products with optional filtering.
     *
     * @param params - Optional query parameters for filtering
     * @param params.fromId - Filter products from this product ID
     * @param params.limit - Maximum number of products to return
     * @param params.status - Filter by product status
     * @returns Promise resolving to an array of products
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     *
     * @example
     * ```typescript
     * const products = await sdk.productAPI().getProducts({
     *   limit: 20,
     *   status: 'active'
     * });
     * ```
     */
    getProducts(params?: ProductRequestParams): Promise<Product[]>;
    /**
     * Retrieves review summary statistics for a specific product.
     *
     * @param productId - The product ID to get review summary for
     * @param groupStatus - Whether to include group status in summary (default: true)
     * @returns Promise resolving to product review summary
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     *
     * @example
     * ```typescript
     * const summary = await sdk.productAPI().getProductReviewSummary('product-123');
     * console.log(`Average rating: ${summary.average_ratings}`);
     * ```
     */
    getProductReviewSummary(productId: string, groupStatus?: boolean): Promise<ProductReviewSummary>;
    /**
     * Retrieves review metadata for a specific product and review code.
     * Used for generating structured data (JSON-LD) for SEO purposes.
     *
     * @param productId - The product ID
     * @param reviewCode - The review code identifier
     * @returns Promise resolving to review metadata
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     *
     * @example
     * ```typescript
     * const meta = await sdk.productAPI().getProductReviewMeta('product-123', 'review-code');
     * // Use meta.review_meta for structured data
     * ```
     */
    getProductReviewMeta(productId: string, reviewCode: string): Promise<ProductReviewMeta>;
}
