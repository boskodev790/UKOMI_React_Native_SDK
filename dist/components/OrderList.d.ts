import React from 'react';
import { ViewStyle } from 'react-native';
import { UKomiSDK } from '../UKomiSDK';
import { WriteReviewFormProps } from './WriteReviewForm';
/**
 * Props for the OrderList component
 */
export interface OrderListProps {
    /** The UKomiSDK instance */
    sdk: UKomiSDK;
    /** The customer ID to fetch orders for */
    customerId: string;
    /** Number of orders per page (default: 5) */
    ordersPerPage?: number;
    /** Optional: Custom style for the container */
    containerStyle?: ViewStyle;
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
    /** Optional: Callback when a product URL is pressed */
    onProductPress?: (productUrl: string) => void;
    /** Optional: Custom WriteReviewForm props to override defaults */
    writeReviewFormProps?: Partial<WriteReviewFormProps>;
}
/**
 * OrderList Component
 *
 * Displays a list of customer orders with products, allowing users to write reviews.
 * Integrates with WriteReviewForm from the SDK for review submission.
 *
 * Features:
 * - Fetches orders using U-KOMI API directly
 * - Built-in pagination
 * - Product images and details
 * - Write review functionality
 * - Customizable theming
 *
 * @example
 * ```tsx
 * import { OrderList } from '@ukomi/react-native-sdk';
 *
 * <OrderList
 *   sdk={ukomiSDK}
 *   customerId="customer-123"
 *   ordersPerPage={5}
 * />
 * ```
 */
export declare const OrderList: React.FC<OrderListProps>;
