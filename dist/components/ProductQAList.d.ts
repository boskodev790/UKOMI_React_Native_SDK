import React from 'react';
import { ViewStyle } from 'react-native';
import { UKomiSDK } from '../UKomiSDK';
/**
 * Props for the ProductQAList component
 */
export interface ProductQAListProps {
    /** The UKomiSDK instance */
    sdk: UKomiSDK;
    /** The product ID to fetch questions for */
    productId: string;
    /** Number of questions per page (default: 10). Pagination is built-in and automatically displayed when there are multiple pages. */
    questionsPerPage?: number;
    /** Optional: Custom style for the container */
    containerStyle?: ViewStyle;
    /** Optional: Callback when a question is marked as helpful */
    onHelpfulPress?: (questionId: string) => void;
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
    /** Optional: Translation function for text labels. If provided, will override default Japanese text. */
    t?: (key: string) => string;
}
/**
 * ProductQAList Component
 *
 * Displays a list of product Q&A with sorting and built-in pagination.
 * This is a focused component for displaying Q&A only - no header or tabs included.
 *
 * The component includes:
 * - Automatic pagination with page numbers, previous/next buttons, and page indicators
 * - Sorting options (by date, helpful)
 * - Dark theme by default (customizable via colors prop)
 * - Q&A display with question/answer labels, verified badges, and helpful counts
 *
 * Pagination is automatically enabled when there are multiple pages of questions.
 * No additional pagination props are required - it's built into the component.
 *
 * Note: For tabs (Reviews/Q&A) and headers, implement them at the app level.
 *
 * @example
 * ```tsx
 * import { ProductQAList } from '@ukomi/react-native-sdk';
 *
 * <ProductQAList
 *   sdk={ukomiSDK}
 *   productId="product-123"
 *   questionsPerPage={10}
 * />
 * ```
 *
 * @example
 * With custom colors (light theme):
 * ```tsx
 * <ProductQAList
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
export declare const ProductQAList: React.FC<ProductQAListProps>;
