import { UKomiApiException, UKomiException } from '../errors/UKomiException';
/**
 * Review API client for managing product reviews.
 * Provides comprehensive methods to retrieve, filter, and analyze reviews.
 */
export class ReviewAPI {
    constructor(http, apiKey) {
        this.http = http;
        this.apiKey = apiKey;
    }
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
    async getAllReviews(params) {
        try {
            const queryParams = {};
            if (params) {
                if (params.fromId)
                    queryParams.from_id = params.fromId;
                if (params.customerId)
                    queryParams.customer_id = params.customerId;
                if (params.fromDate)
                    queryParams.from_date = params.fromDate;
                if (params.updatedDate)
                    queryParams.updated_date = params.updatedDate;
                if (params.count)
                    queryParams.count = params.count;
                if (params.page)
                    queryParams.page = params.page;
                if (params.likes)
                    queryParams.likes = params.likes;
                if (params.customQuestions)
                    queryParams.custom_questions = params.customQuestions;
                if (params.sort)
                    queryParams.sort = params.sort;
                if (params.sortOrder)
                    queryParams.sort_order = params.sortOrder;
                if (params.stars)
                    queryParams.stars = params.stars;
                if (params.starsSorting)
                    queryParams.stars_sorting = params.starsSorting;
                if (params.postType)
                    queryParams.post_type = params.postType;
                if (params.reviewType)
                    queryParams.review_type = params.reviewType;
                if (params.productId)
                    queryParams.product_id = params.productId;
                if (params.group)
                    queryParams.group = params.group;
                if (params.groupName)
                    queryParams.group_name = params.groupName;
                if (params.label)
                    queryParams.label = params.label;
                if (params.questionPublic)
                    queryParams.question_public = params.questionPublic;
                if (params.questionEnable)
                    queryParams.question_enable = params.questionEnable;
                if (params.deleted)
                    queryParams.deleted = params.deleted;
            }
            const response = await this.http.get(`reviews/${this.apiKey}/view_basic`, {
                params: queryParams,
            });
            return response;
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
    /**
     * Retrieves all reviews in basic format with filtering and pagination.
     * Returns a simplified version of review data for better performance.
     *
     * @param params - Optional query parameters (same as getAllReviews)
     * @returns Promise resolving to review response with reviews array
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     */
    async getAllReviewsBasic(params) {
        try {
            const queryParams = {};
            if (params) {
                if (params.fromId)
                    queryParams.from_id = params.fromId;
                if (params.customerId)
                    queryParams.customer_id = params.customerId;
                if (params.fromDate)
                    queryParams.from_date = params.fromDate;
                if (params.updatedDate)
                    queryParams.updated_date = params.updatedDate;
                if (params.count)
                    queryParams.count = params.count;
                if (params.page)
                    queryParams.page = params.page;
                if (params.likes)
                    queryParams.likes = params.likes;
                if (params.customQuestions)
                    queryParams.custom_questions = params.customQuestions;
                if (params.sort)
                    queryParams.sort = params.sort;
                if (params.sortOrder)
                    queryParams.sort_order = params.sortOrder;
                if (params.stars)
                    queryParams.stars = params.stars;
                if (params.starsSorting)
                    queryParams.stars_sorting = params.starsSorting;
                if (params.postType)
                    queryParams.post_type = params.postType;
                if (params.reviewType)
                    queryParams.review_type = params.reviewType;
                if (params.productId)
                    queryParams.product_id = params.productId;
                if (params.group)
                    queryParams.group = params.group;
                if (params.groupName)
                    queryParams.group_name = params.groupName;
                if (params.label)
                    queryParams.label = params.label;
                if (params.questionPublic)
                    queryParams.question_public = params.questionPublic;
                if (params.questionEnable)
                    queryParams.question_enable = params.questionEnable;
                if (params.deleted)
                    queryParams.deleted = params.deleted;
            }
            const response = await this.http.get(`reviews/${this.apiKey}/view_basic`, {
                params: queryParams,
            });
            return response;
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
    /**
     * Retrieves reviews along with their associated order information.
     * Useful for analyzing purchase behavior and review patterns.
     *
     * @param params - Optional filter parameters for reviews
     * @returns Promise resolving to an array of reviews with order data
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     */
    async getReviewsWithOrders(params) {
        try {
            const body = {
                reviews: params,
            };
            const response = await this.http.post(`reviews/${this.apiKey}/review_with_orders_basic`, body);
            return response.reviews || [];
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
    /**
     * Retrieves aggregated review summary statistics for multiple groups.
     *
     * @param groupIds - Array of group IDs to get summary for
     * @param filter - Optional filter for summary calculation
     * @returns Promise resolving to review summary with aggregated statistics
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     */
    async getGroupsReviewSummary(groupIds, filter) {
        try {
            const request = {
                groups: groupIds,
                filter,
            };
            const response = await this.http.post(`reviews/${this.apiKey}/groups_review_summary`, request);
            return response;
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
    /**
     * Retrieves review summary statistics for multiple customers.
     *
     * @param customerIds - Array of customer IDs to get summary for
     * @param filter - Optional filter for summary calculation
     * @returns Promise resolving to an array of customer review summaries
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     */
    async getCustomersReviewSummary(customerIds, filter) {
        try {
            const request = {
                customers: customerIds,
                filter,
            };
            const response = await this.http.post(`reviews/${this.apiKey}/customers_review_summary`, request);
            return response;
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
    /**
     * Retrieves filtered review summary based on review type and filter criteria.
     *
     * @param reviewType - The type of review to filter by
     * @param filter - Filter criteria for summary calculation
     * @returns Promise resolving to filtered review summary
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     */
    async getFilteredReviewSummary(reviewType, filter) {
        try {
            const request = { filter };
            const response = await this.http.post(`reviews/${this.apiKey}/${reviewType}/filtered_review_summary`, request);
            return response;
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
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
    async getReviewSummary(reviewType, params) {
        try {
            const queryParams = {};
            if (params) {
                if (params.productId)
                    queryParams.product_id = params.productId;
                if (params.group)
                    queryParams.group = params.group;
                if (params.groupName)
                    queryParams.group_name = params.groupName;
            }
            const response = await this.http.get(`reviews/${this.apiKey}/${reviewType}/review_summary`, { params: queryParams });
            return response;
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
    /**
     * Retrieves a single review by its ID.
     *
     * @param reviewId - The ID of the review to retrieve
     * @returns Promise resolving to the review
     * @throws {UKomiApiException} When the API returns an error or review not found
     * @throws {UKomiException} When a network error occurs
     */
    async getReview(reviewId) {
        try {
            const response = await this.http.get(`reviews/${this.apiKey}/${reviewId}/review_basic`);
            if (!response.review || response.review.length === 0) {
                throw new UKomiApiException(404, 'No review found with the given ID');
            }
            return response.review[0];
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
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
    async getProductReviews(productId, params) {
        try {
            const queryParams = {};
            if (params) {
                if (params.count)
                    queryParams.count = params.count;
                if (params.page)
                    queryParams.page = params.page;
                if (params.sort)
                    queryParams.sort = params.sort;
                if (params.sortOrder)
                    queryParams.sort_order = params.sortOrder;
                if (params.stars)
                    queryParams.stars = params.stars;
                if (params.starsSorting)
                    queryParams.stars_sorting = params.starsSorting;
            }
            const response = await this.http.get(`reviews/${this.apiKey}/${productId}/product_basic`, { params: queryParams });
            return response;
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
    /**
     * (V1 API) Returns form field configuration, validation rules, product info, and labels
     * needed to render a review form.
     *
     * @param productId - Product identifier
     * @returns Promise resolving to form fields data (product, form_config, fields, labels)
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     *
     * @example
     * ```typescript
     * const formData = await sdk.reviews().getReviewFormFields('product-123');
     * console.log(formData.form_config?.submit_button_text);
     * ```
     */
    async getReviewFormFields(productId) {
        try {
            const response = await this.http.postRaw(`v1/${this.apiKey}/review_form_fields`, { product_id: productId });
            if (response.status === 'success' && response.data) {
                return response.data;
            }
            throw new UKomiApiException(400, response.message ?? 'Failed to get review form fields');
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
    /**
     * (V1 API) Validates review data, saves a temp review, and sends a verification email
     * to the reviewer.
     *
     * @param params - Submit review params (product_id, score, review, email, etc.)
     * @returns Promise resolving to success data (verification_email_sent, message)
     * @throws {UKomiApiException} On API error (e.g. invalid API key)
     * @throws {UKomiException} When a network error occurs
     *
     * For validation/field errors, check the thrown error; the API returns status "field_error"
     * with an `errors` object (field name -> error message).
     *
     * @example
     * ```typescript
     * const result = await sdk.reviews().submitReviewV1({
     *   product_id: 'product-123',
     *   score: 5,
     *   review: 'Great product!',
     *   title: 'Love it',
     *   email: 'user@example.com',
     *   name: 'John',
     * });
     * console.log(result.data?.message);
     * ```
     */
    async submitReviewV1(params) {
        try {
            const response = await this.http.postRaw(`v1/${this.apiKey}/review_submit`, params);
            if (response.status === 'success') {
                return response.data;
            }
            if (response.status === 'field_error') {
                const err = response;
                const msg = err.errors ? Object.entries(err.errors).map(([k, v]) => `${k}: ${v}`).join('; ') : 'Validation failed';
                throw new UKomiApiException(422, msg);
            }
            const errResp = response;
            throw new UKomiApiException(errResp.code ? parseInt(errResp.code, 10) : 500, errResp.message ?? 'Submit review failed');
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
    /**
     * Retrieves a token for embedding inline review forms.
     * Used for displaying review forms directly in your application.
     *
     * @returns Promise resolving to token data
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     */
    async getInlineReviewFormToken() {
        try {
            const response = await this.http.post(`inline_review_form_token/${this.apiKey}/get`, {});
            return response;
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
    /**
     * Submits a review for a product.
     *
     * @param productId - The product ID to submit review for
     * @param reviewData - Review submission data
     * @param reviewData.rating - Star rating (1-5)
     * @param reviewData.subject - Review title/subject
     * @param reviewData.content - Review content/body
     * @param reviewData.email - Reviewer email (required)
     * @param reviewData.name - Reviewer name (optional)
     * @param reviewData.nickname - Reviewer nickname (optional)
     * @param reviewData.customAnswers - Custom question answers (optional)
     * @returns Promise resolving to the created review
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     *
     * @example
     * ```typescript
     * const review = await sdk.reviews().submitReview('product-123', {
     *   rating: 5,
     *   subject: 'Great product!',
     *   content: 'I really enjoyed this product...',
     *   email: 'user@example.com',
     *   name: 'John Doe',
     *   nickname: 'Johnny'
     * });
     * ```
     */
    async submitReview(productId, reviewData) {
        try {
            const body = {
                product_id: productId,
                score: reviewData.rating.toString(),
                title: reviewData.subject,
                content: reviewData.content,
                email: reviewData.email,
            };
            if (reviewData.name) {
                body.name = reviewData.name;
            }
            if (reviewData.nickname) {
                body.nickname = reviewData.nickname;
            }
            if (reviewData.customAnswers && Object.keys(reviewData.customAnswers).length > 0) {
                body.custom_answers = reviewData.customAnswers;
            }
            const response = await this.http.post(`reviews/${this.apiKey}/post`, body);
            if (!response.review || response.review.length === 0) {
                throw new UKomiApiException(400, 'Failed to submit review');
            }
            return response.review[0];
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
}
