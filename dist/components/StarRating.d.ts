import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { UKomiSDK } from '../UKomiSDK';
/**
 * Props for the StarRating component
 */
export interface StarRatingProps {
    /** The UKomiSDK instance (must be authenticated) */
    sdk: UKomiSDK;
    /** The product ID to fetch reviews for */
    productId: string;
    /** Optional: Custom star size (default: 16) */
    starSize?: number;
    /** Optional: Custom style for the container */
    containerStyle?: ViewStyle;
    /** Optional: Custom style for the count text */
    countStyle?: TextStyle;
    /** Optional: Show loading indicator (default: true) */
    showLoading?: boolean;
    /** Optional: Custom format function for review count */
    formatCount?: (count: number) => string;
}
/**
 * StarRating Component
 *
 * Displays a star rating and review count for a product.
 * Fetches review data from the UKOMI API and calculates the average rating.
 *
 * @example
 * ```tsx
 * import { StarRating } from '@ukomi/react-native-sdk';
 * import { UKomiSDK } from '@ukomi/react-native-sdk';
 *
 * const sdk = new UKomiSDK({ apiKey: '...', apiSecret: '...' });
 * await sdk.authenticate();
 *
 * <StarRating sdk={sdk} productId="product-123" />
 * ```
 */
export declare const StarRating: React.FC<StarRatingProps>;
