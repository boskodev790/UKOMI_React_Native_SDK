import { HttpClient } from '../utils/HttpClient';
import { ReviewResponse, Review, ReviewSummary, ReviewFilterParams, ReviewWithOrders, CustomerReviewSummary, ReviewSummaryFilter } from '../types/ReviewModels';
/**
 * Review API client for managing product reviews.
 * Provides comprehensive methods to retrieve, filter, and analyze reviews.
 */
export declare class ReviewAPI {
    private http;
    private apiKey;
    private accessToken;
    constructor(http: HttpClient, apiKey: string, accessToken: string);
    /**
     * Retrieves all reviews with extensive filtering and pagination options.
     *
     * @param params - Optional query parameters for filtering and pagination
     * @param params.fromId - Filter reviews from this review ID
     * @param params.customerId - Filter reviews by customer ID
     * @param params.fromDate - Filter reviews from this date (YYYY-MM-DD format)
     * @param params.updatedDate - Filter reviews updated from this date
     * @param params.count - Number of reviews per page
     * @param params.page - Page number
     * @param params.likes - Filter by likes count
     * @param params.customQuestions - Include custom questions ('1' or '0')
     * @param params.sort - Sort field (e.g., 'date', 'score')
     * @param params.sortOrder - Sort order ('asc' or 'desc')
     * @param params.stars - Filter by star rating
     * @param params.starsSorting - Star sorting method
     * @param params.postType - Filter by post type
     * @param params.reviewType - Filter by review type
     * @param params.productId - Filter by product ID
     * @param params.group - Filter by group
     * @param params.groupName - Filter by group name
     * @param params.label - Filter by label
     * @param params.questionPublic - Filter by question public status ('1' or '0')
     * @param params.questionEnable - Filter by question enabled status ('1' or '0')
     * @param params.deleted - Include deleted reviews ('1' or '0')
     * @returns Promise resolving to review response with reviews array
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     *
     * @example
     * ```typescript
     * const reviews = await sdk.reviews().getAllReviews({
     *   count: '20',
     *   page: '1',
     *   sort: 'date',
     *   sortOrder: 'desc',
     *   stars: '5'
     * });
     * ```
     */
    getAllReviews(params?: {
        fromId?: string;
        customerId?: string;
        fromDate?: string;
        updatedDate?: string;
        count?: string;
        page?: string;
        likes?: string;
        customQuestions?: string;
        sort?: string;
        sortOrder?: string;
        stars?: string;
        starsSorting?: string;
        postType?: string;
        reviewType?: string;
        productId?: string;
        group?: string;
        groupName?: string;
        label?: string;
        questionPublic?: string;
        questionEnable?: string;
        deleted?: string;
    }): Promise<ReviewResponse>;
    /**
     * Retrieves all reviews in basic format with filtering and pagination.
     * Returns a simplified version of review data for better performance.
     *
     * @param params - Optional query parameters (same as getAllReviews)
     * @returns Promise resolving to review response with reviews array
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     */
    getAllReviewsBasic(params?: {
        fromId?: string;
        customerId?: string;
        fromDate?: string;
        updatedDate?: string;
        count?: string;
        page?: string;
        likes?: string;
        customQuestions?: string;
        sort?: string;
        sortOrder?: string;
        stars?: string;
        starsSorting?: string;
        postType?: string;
        reviewType?: string;
        productId?: string;
        group?: string;
        groupName?: string;
        label?: string;
        questionPublic?: string;
        questionEnable?: string;
        deleted?: string;
    }): Promise<ReviewResponse>;
    /**
     * Retrieves reviews along with their associated order information.
     * Useful for analyzing purchase behavior and review patterns.
     *
     * @param params - Optional filter parameters for reviews
     * @returns Promise resolving to an array of reviews with order data
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     */
    getReviewsWithOrders(params?: ReviewFilterParams): Promise<ReviewWithOrders[]>;
    /**
     * Retrieves aggregated review summary statistics for multiple groups.
     *
     * @param groupIds - Array of group IDs to get summary for
     * @param filter - Optional filter for summary calculation
     * @returns Promise resolving to review summary with aggregated statistics
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     */
    getGroupsReviewSummary(groupIds: string[], filter?: ReviewSummaryFilter): Promise<ReviewSummary>;
    /**
     * Retrieves review summary statistics for multiple customers.
     *
     * @param customerIds - Array of customer IDs to get summary for
     * @param filter - Optional filter for summary calculation
     * @returns Promise resolving to an array of customer review summaries
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     */
    getCustomersReviewSummary(customerIds: string[], filter?: ReviewSummaryFilter): Promise<CustomerReviewSummary[]>;
    /**
     * Retrieves filtered review summary based on review type and filter criteria.
     *
     * @param reviewType - The type of review to filter by
     * @param filter - Filter criteria for summary calculation
     * @returns Promise resolving to filtered review summary
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     */
    getFilteredReviewSummary(reviewType: string, filter: ReviewSummaryFilter): Promise<ReviewSummary>;
    /**
     * Retrieves review summary statistics for a specific review type.
     *
     * @param reviewType - The type of review to get summary for
     * @param params - Optional parameters for filtering
     * @param params.productId - Filter by product ID
     * @param params.group - Filter by group
     * @param params.groupName - Filter by group name
     * @returns Promise resolving to review summary
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     */
    getReviewSummary(reviewType: string, params?: {
        productId?: string;
        group?: string;
        groupName?: string;
    }): Promise<ReviewSummary>;
    /**
     * Retrieves a single review by its ID.
     *
     * @param reviewId - The ID of the review to retrieve
     * @returns Promise resolving to the review
     * @throws {UKomiApiException} When the API returns an error or review not found
     * @throws {UKomiException} When a network error occurs
     */
    getReview(reviewId: string): Promise<Review>;
    /**
     * Retrieves all reviews for a specific product with pagination and sorting.
     *
     * @param productId - The product ID to get reviews for
     * @param params - Optional query parameters
     * @param params.count - Number of reviews per page
     * @param params.page - Page number
     * @param params.sort - Sort field (e.g., 'date', 'score')
     * @param params.sortOrder - Sort order ('asc' or 'desc')
     * @param params.stars - Filter by star rating
     * @param params.starsSorting - Star sorting method
     * @returns Promise resolving to review response
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     */
    getProductReviews(productId: string, params?: {
        count?: string;
        page?: string;
        sort?: string;
        sortOrder?: string;
        stars?: string;
        starsSorting?: string;
    }): Promise<ReviewResponse>;
    /**
     * Retrieves a token for embedding inline review forms.
     * Used for displaying review forms directly in your application.
     *
     * @returns Promise resolving to token data
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     */
    getInlineReviewFormToken(): Promise<Record<string, string>>;
}
