import React from 'react';
import { UKomiSDK } from '../UKomiSDK';
/**
 * Props for the WriteReviewForm component
 */
export interface WriteReviewFormProps {
    /** The UKomiSDK instance */
    sdk: UKomiSDK;
    /** The product ID to submit review for */
    productId: string;
    /** Callback when form should be closed (e.g., after successful submission) */
    onClose?: () => void;
    /** Optional: Callback when review is successfully submitted */
    onSubmitSuccess?: () => void;
    /** Optional: Custom colors for theming */
    colors?: {
        background?: string;
        text?: string;
        textSecondary?: string;
        primary?: string;
        border?: string;
        surface?: string;
        error?: string;
    };
}
/**
 * WriteReviewForm Component
 *
 * Displays a form for writing a product review with custom questions support.
 * This is a pure form component that can be used in modals, pages, or any container.
 *
 * @example
 * ```tsx
 * <Modal visible={showReviewForm}>
 *   <WriteReviewForm
 *     sdk={ukomiSDK}
 *     productId="product-123"
 *     onClose={() => setShowReviewForm(false)}
 *   />
 * </Modal>
 * ```
 */
export declare const WriteReviewForm: React.FC<WriteReviewFormProps>;
