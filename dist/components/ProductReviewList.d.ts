import React from 'react';
import { ViewStyle } from 'react-native';
import { UKomiSDK } from '../UKomiSDK';
/**
 * Props for the ProductReviewList component
 */
export interface ProductReviewListProps {
    /** The UKomiSDK instance */
    sdk: UKomiSDK;
    /** The product ID to fetch reviews for */
    productId: string;
    /** Number of reviews per page (default: 10). Pagination is built-in and automatically displayed when there are multiple pages. */
    reviewsPerPage?: number;
    /** Optional: Custom style for the container */
    containerStyle?: ViewStyle;
    /** Optional: Callback when a review is marked as helpful */
    onHelpfulPress?: (reviewId: string) => void;
    /** Optional: Custom colors for theming. Defaults to dark theme if not provided. */
    colors?: {
        background?: string;
        text?: string;
        textSecondary?: string;
        primary?: string;
        border?: string;
        surface?: string;
        error?: string;
    };
    /** Optional: Show loading indicator (default: true) */
    showLoading?: boolean;
}
/**
 * ProductReviewList Component
 *
 * Displays a list of product reviews with sorting, filtering, and built-in pagination.
 * This is a focused component for displaying reviews only - no header or tabs included.
 *
 * The component includes:
 * - Automatic pagination with page numbers, previous/next buttons, and page indicators
 * - Sorting options (by date, rating, helpful, verified, media)
 * - Filter controls
 * - Dark theme by default (customizable via colors prop)
 * - Review display with star ratings, verified badges, and helpful counts
 *
 * Pagination is automatically enabled when there are multiple pages of reviews.
 * No additional pagination props are required - it's built into the component.
 *
 * Note: For tabs (Reviews/Q&A) and headers, implement them at the app level.
 *
 * @example
 * ```tsx
 * import { ProductReviewList } from '@ukomi/react-native-sdk';
 *
 * <ProductReviewList
 *   sdk={ukomiSDK}
 *   productId="product-123"
 *   reviewsPerPage={10}
 * />
 * ```
 *
 * @example
 * With custom colors (light theme):
 * ```tsx
 * <ProductReviewList
 *   sdk={ukomiSDK}
 *   productId="product-123"
 *   colors={{
 *     background: '#FFFFFF',
 *     text: '#000000',
 *     textSecondary: '#666666',
 *     primary: '#3b82f6',
 *     border: '#e5e5e5',
 *     surface: '#f5f5f5',
 *   }}
 * />
 * ```
 */
export declare const ProductReviewList: React.FC<ProductReviewListProps>;
