/**
 * Review data model
 */
export interface Review {
    id: string;
    title: string;
    content: string;
    score: string;
    label?: string;
    created_at: string;
    updated_at: string;
    sentiment?: string;
    order_id?: string;
    name?: string;
    customer_id?: string;
    email?: string;
    post_type?: string;
    review_images?: string[];
    nickname?: string;
    reviewer_type?: string;
    question_answer?: QuestionAnswer[];
    product_sku?: string;
    product_name?: string;
    product_url?: string;
}
/**
 * Review response wrapper
 */
export interface ReviewResponse {
    review?: Review[];
    questionAnswer?: QuestionAnswer[];
}
/**
 * Question and Answer
 */
export interface QuestionAnswer {
    id: string;
    question: string;
    answer: string;
}
/**
 * Review summary filter
 */
export interface ReviewSummaryFilter {
    expiration?: string;
    merge?: string;
    empty?: string;
}
/**
 * Review summary
 */
export interface ReviewSummary {
    total_reviews?: number;
    average_ratings?: number;
    score_distribution?: Record<string, number>;
}
/**
 * Customer review summary item
 */
export interface CustomerReviewSummary {
    customer_id: string;
    total_reviews: number;
    average_ratings: number;
}
/**
 * Review filter parameters for POST body (review_with_orders)
 */
export interface ReviewFilterParams {
    from_id?: string;
    from_date?: string;
    updated_date?: string;
    count?: string;
    page?: string;
    deleted?: string;
    sort?: string;
    sort_order?: string;
    stars?: string;
    stars_sorting?: string;
}
/**
 * Review with orders request body
 */
export interface ReviewWithOrdersRequestBody {
    access_token: string;
    reviews?: ReviewFilterParams;
}
/**
 * Order data for review with orders response
 */
export interface ReviewOrder {
    id?: string;
    user_name?: string;
    user_email?: string;
    user_nickname?: string;
    product_sku?: string;
    product_name?: string;
    product_url?: string;
    order_date?: string;
    coupon_code?: string;
}
/**
 * Review with orders
 */
export interface ReviewWithOrders {
    review: Review;
    order?: ReviewOrder;
}
/**
 * Reviews with orders response wrapper
 */
export interface ReviewsWithOrdersResponse {
    reviews?: ReviewWithOrders[];
}
/**
 * Groups review summary request
 */
export interface GroupsReviewSummaryRequest {
    groups: string[];
    filter?: ReviewSummaryFilter;
}
/**
 * Customers review summary request
 */
export interface CustomersReviewSummaryRequest {
    customers: string[];
    filter?: ReviewSummaryFilter;
}
/**
 * Filtered review summary request
 */
export interface FilteredReviewSummaryRequest {
    filter: ReviewSummaryFilter;
}
