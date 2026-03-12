import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, } from 'react-native';
import { UKomiApiException, UKomiException } from '../errors/UKomiException';
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
export const AskQuestionForm = ({ sdk, productId, onClose, onSubmitSuccess, colors: customColors, }) => {
    const colors = {
        background: customColors?.background || '#FFFFFF',
        text: customColors?.text || '#000000',
        textSecondary: customColors?.textSecondary || '#666666',
        primary: customColors?.primary || '#3b82f6',
        border: customColors?.border || '#e5e5e5',
        surface: customColors?.surface || '#F5F5F5',
        error: customColors?.error || '#ef4444',
    };
    const [question, setQuestion] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async () => {
        // Validate required fields
        if (!question.trim()) {
            setError('質問を入力してください');
            return;
        }
        if (!email.trim()) {
            setError('メールアドレスを入力してください');
            return;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('有効なメールアドレスを入力してください');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await sdk.questions().submitQuestion(productId, {
                question,
                email,
                name: name || undefined,
                nickname: nickname || undefined,
            });
            // Reset form
            setQuestion('');
            setName('');
            setEmail('');
            setNickname('');
            if (onSubmitSuccess) {
                onSubmitSuccess();
            }
            if (onClose) {
                onClose();
            }
        }
        catch (err) {
            let errorMessage = '質問の投稿に失敗しました';
            if (err instanceof UKomiApiException) {
                errorMessage = err.message || errorMessage;
            }
            else if (err instanceof UKomiException) {
                errorMessage = err.message || errorMessage;
            }
            else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(View, { style: [styles.container, { backgroundColor: colors.background }], children: [_jsxs(View, { style: styles.formGroup, children: [_jsxs(View, { style: styles.labelRow, children: [_jsx(Text, { style: [styles.label, { color: colors.text }], children: "\u8CEA\u554F" }), _jsx(View, { style: [styles.requiredBadge, { backgroundColor: colors.primary }], children: _jsx(Text, { style: styles.requiredText, children: "\u5FC5\u9808" }) })] }), _jsx(TextInput, { style: [styles.textArea, { borderColor: colors.border, color: colors.text }], value: question, onChangeText: setQuestion, placeholder: "\u8CEA\u554F\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", placeholderTextColor: colors.textSecondary, multiline: true, numberOfLines: 6, textAlignVertical: "top" })] }), _jsxs(View, { style: styles.formGroup, children: [_jsxs(View, { style: styles.labelRow, children: [_jsx(Text, { style: [styles.label, { color: colors.text }], children: "\u304A\u540D\u524D" }), _jsx(View, { style: [styles.optionalBadge, { backgroundColor: colors.surface }], children: _jsx(Text, { style: [styles.optionalText, { color: colors.textSecondary }], children: "\u4EFB\u610F" }) })] }), _jsx(TextInput, { style: [styles.textInput, { borderColor: colors.border, color: colors.text }], value: name, onChangeText: setName, placeholder: "\u304A\u540D\u524D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", placeholderTextColor: colors.textSecondary })] }), _jsxs(View, { style: styles.formGroup, children: [_jsxs(View, { style: styles.labelRow, children: [_jsx(Text, { style: [styles.label, { color: colors.text }], children: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9" }), _jsx(View, { style: [styles.requiredBadge, { backgroundColor: colors.primary }], children: _jsx(Text, { style: styles.requiredText, children: "\u5FC5\u9808" }) })] }), _jsx(TextInput, { style: [styles.textInput, { borderColor: colors.border, color: colors.text }], value: email, onChangeText: setEmail, placeholder: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", placeholderTextColor: colors.textSecondary, keyboardType: "email-address", autoCapitalize: "none" })] }), _jsxs(View, { style: styles.formGroup, children: [_jsxs(View, { style: styles.labelRow, children: [_jsx(Text, { style: [styles.label, { color: colors.text }], children: "\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0" }), _jsx(View, { style: [styles.optionalBadge, { backgroundColor: colors.surface }], children: _jsx(Text, { style: [styles.optionalText, { color: colors.textSecondary }], children: "\u4EFB\u610F" }) })] }), _jsx(TextInput, { style: [styles.textInput, { borderColor: colors.border, color: colors.text }], value: nickname, onChangeText: setNickname, placeholder: "\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", placeholderTextColor: colors.textSecondary })] }), _jsx(Text, { style: [styles.helpText, { color: colors.textSecondary }], children: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306F\u30B5\u30A4\u30C8\u306B\u516C\u958B\u3055\u308C\u307E\u305B\u3093" }), error && (_jsx(View, { style: styles.errorContainer, children: _jsx(Text, { style: [styles.errorText, { color: colors.error }], children: error }) })), _jsx(TouchableOpacity, { style: [styles.submitButton, { backgroundColor: colors.primary }], onPress: handleSubmit, disabled: loading, children: loading ? (_jsx(ActivityIndicator, { color: "#FFFFFF" })) : (_jsx(Text, { style: styles.submitButtonText, children: "\u6295\u7A3F\u3059\u308B" })) })] }));
};
const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
    requiredBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    requiredText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '600',
    },
    optionalBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    optionalText: {
        fontSize: 10,
        fontWeight: '500',
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        minHeight: 44,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    helpText: {
        fontSize: 12,
        marginBottom: 20,
        marginTop: -10,
    },
    errorContainer: {
        marginBottom: 16,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fee2e2',
    },
    errorText: {
        fontSize: 14,
    },
    submitButton: {
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
