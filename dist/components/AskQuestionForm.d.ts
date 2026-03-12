import React from 'react';
import { UKomiSDK } from '../UKomiSDK';
/**
 * Props for the AskQuestionForm component
 */
export interface AskQuestionFormProps {
    /** The UKomiSDK instance */
    sdk: UKomiSDK;
    /** The product ID to submit question for */
    productId: string;
    /** Callback when form should be closed (e.g., after successful submission) */
    onClose?: () => void;
    /** Optional: Callback when question is successfully submitted */
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
 * AskQuestionForm Component
 *
 * Displays a form for asking a question about a product.
 * This is a pure form component that can be used in modals, pages, or any container.
 *
 * @example
 * ```tsx
 * <Modal visible={showQuestionForm}>
 *   <AskQuestionForm
 *     sdk={ukomiSDK}
 *     productId="product-123"
 *     onClose={() => setShowQuestionForm(false)}
 *   />
 * </Modal>
 * ```
 */
export declare const AskQuestionForm: React.FC<AskQuestionFormProps>;
