import { HttpClient } from '../utils/HttpClient';
import { UKomiApiException, UKomiException } from '../errors/UKomiException';
import {
  Product,
  ProductReviewSummary,
  ProductReviewMeta,
  ProductRequestParams,
  ProductRequestBody,
  ProductsResponse,
} from '../types/ProductModels';

/**
 * Product API client for managing products and product-related data.
 * Provides methods to retrieve products, review summaries, and metadata.
 */
export class ProductAPI {
  constructor(
    private http: HttpClient,
    private apiKey: string,
    private accessToken: string
  ) {}

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
  async getProducts(params?: ProductRequestParams): Promise<Product[]> {
    try {
      const body: ProductRequestBody = {
        access_token: this.accessToken,
        product: params,
      };

      const response = await this.http.post<ProductsResponse>(
        `products/${this.apiKey}/view`,
        body
      );
      return response.products;
    } catch (error) {
      if (error instanceof UKomiApiException) {
        throw error;
      }
      throw new UKomiException('Network error', error instanceof Error ? error : undefined);
    }
  }

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
  async getProductReviewSummary(
    productId: string,
    groupStatus: boolean = true
  ): Promise<ProductReviewSummary> {
    try {
      const response = await this.http.get<ProductReviewSummary>(
        `products/${this.apiKey}/${productId}/${groupStatus.toString()}/review_summary`
      );
      return response;
    } catch (error) {
      if (error instanceof UKomiApiException) {
        throw error;
      }
      throw new UKomiException('Network error', error instanceof Error ? error : undefined);
    }
  }

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
  async getProductReviewMeta(productId: string, reviewCode: string): Promise<ProductReviewMeta> {
    try {
      const response = await this.http.get<{ review_meta: string }>(
        `products/${this.apiKey}/${productId}/${reviewCode}/review_meta`
      );
      return { review_meta: response.review_meta };
    } catch (error) {
      if (error instanceof UKomiApiException) {
        throw error;
      }
      throw new UKomiException('Network error', error instanceof Error ? error : undefined);
    }
  }
}

