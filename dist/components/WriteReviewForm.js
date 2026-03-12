import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { UKomiApiException, UKomiException } from '../errors/UKomiException';
// Star SVG path
const starPath = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';
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
export const WriteReviewForm = ({ sdk, productId, onClose, onSubmitSuccess, colors: customColors, }) => {
    // Built-in questions matching the screenshot
    const builtInQuestions = [
        {
            id: 'taste',
            label: '美味しさはいかがでしたか?',
            type: 'scale',
            required: false,
            scaleType: 'satisfaction',
            options: [
                { value: 'satisfied', label: '満足' },
                { value: 'slightly_satisfied', label: '少し満足' },
                { value: 'normal', label: '普通' },
                { value: 'slightly_dissatisfied', label: '少し不満' },
                { value: 'dissatisfied', label: '不満' },
            ],
        },
        {
            id: 'quantity',
            label: '内容量はいかがでしたか?',
            type: 'scale',
            required: false,
            scaleType: 'quantity',
            options: [
                { value: 'little', label: '少ない' },
                { value: 'slightly_little', label: '少し少ない' },
                { value: 'just_right', label: 'ちょうど良い' },
                { value: 'slightly_much', label: '少し多い' },
                { value: 'much', label: '多い' },
            ],
        },
        {
            id: 'freetext_test',
            label: 'フリーテキストのテスト',
            type: 'radio',
            required: false,
            options: [
                { value: 'option1', label: '選択肢1' },
                { value: 'option2', label: '選択肢2' },
                { value: 'option3', label: '選択肢3 (フリーテキスト)' },
            ],
        },
    ];
    const colors = {
        background: customColors?.background || '#FFFFFF',
        text: customColors?.text || '#000000',
        textSecondary: customColors?.textSecondary || '#666666',
        primary: customColors?.primary || '#3b82f6',
        border: customColors?.border || '#e5e5e5',
        surface: customColors?.surface || '#F5F5F5',
        error: customColors?.error || '#ef4444',
    };
    const [rating, setRating] = useState(0);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [customAnswers, setCustomAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Render a single star
    const renderStar = (isFilled, starNumber, size = 24) => {
        const fillColor = isFilled ? '#f5c518' : 'transparent';
        const strokeColor = isFilled ? '#f5c518' : '#e0e0e0';
        return (_jsx(TouchableOpacity, { onPress: () => setRating(starNumber), style: starNumber > 1 ? styles.starMargin : undefined, children: _jsx(Svg, { width: size, height: size, viewBox: "0 0 24 24", children: _jsx(Path, { d: starPath, fill: fillColor, stroke: strokeColor, strokeWidth: 1.5, strokeLinejoin: "round" }) }) }, starNumber));
    };
    // Render stars for rating input
    const renderStarInput = () => {
        return (_jsx(View, { style: styles.starsContainer, children: [1, 2, 3, 4, 5].map((starNumber) => renderStar(starNumber <= rating, starNumber)) }));
    };
    // Render scale question
    const renderScaleQuestion = (question) => {
        const value = customAnswers[question.id] || '';
        const totalLevels = question.options.length;
        return (_jsxs(View, { style: styles.formGroup, children: [_jsxs(View, { style: styles.labelRow, children: [_jsx(Text, { style: [styles.label, { color: colors.text }], children: question.label }), question.required ? (_jsx(View, { style: [styles.requiredBadge, { backgroundColor: colors.primary, marginLeft: 8 }], children: _jsx(Text, { style: styles.requiredText, children: "\u5FC5\u9808" }) })) : (_jsx(View, { style: [styles.optionalBadge, { backgroundColor: colors.surface, marginLeft: 8 }], children: _jsx(Text, { style: [styles.optionalText, { color: colors.textSecondary }], children: "\u4EFB\u610F" }) }))] }), _jsx(View, { style: styles.scaleOptions, children: question.options.map((option, index) => {
                        const isSelected = value === option.value;
                        const level = index + 1;
                        // Determine bar color based on scale type
                        let barColor = '#3B82F6'; // Default blue for satisfaction
                        if (question.scaleType === 'quantity') {
                            // For quantity: red for extremes (1, 5), green for middle options (2, 3, 4)
                            if (level === 1 || level === 5)
                                barColor = '#EF4444'; // Red - too little or too much
                            else
                                barColor = '#10B981'; // Green - slightly less, just right, or slightly too much
                        }
                        else {
                            // For satisfaction: blue gradient (all blue)
                            barColor = '#3B82F6'; // Blue
                        }
                        return (_jsxs(TouchableOpacity, { style: [styles.scaleOption, index > 0 && { marginTop: 8 }], onPress: () => setCustomAnswers({ ...customAnswers, [question.id]: option.value }), children: [_jsx(View, { style: [styles.radioButton, { borderColor: colors.border }], children: isSelected && _jsx(View, { style: [styles.radioButtonInner, { backgroundColor: colors.primary }] }) }), _jsx(View, { style: [styles.scaleBarContainer, { marginLeft: 12 }], children: [...Array(totalLevels)].map((_, i) => {
                                        const isFilled = i < level;
                                        return (_jsx(View, { style: [
                                                styles.scaleBar,
                                                {
                                                    backgroundColor: isFilled ? barColor : '#E5E5E5',
                                                    ...(i > 0 && { marginLeft: 2 }),
                                                },
                                            ] }, i));
                                    }) }), _jsx(Text, { style: [styles.scaleOptionLabel, { color: colors.text, marginLeft: 12 }], children: option.label })] }, option.value));
                    }) })] }, question.id));
    };
    // Render radio question
    const renderRadioQuestion = (question) => {
        const value = customAnswers[question.id] || '';
        return (_jsxs(View, { style: styles.formGroup, children: [_jsxs(View, { style: styles.labelRow, children: [_jsx(Text, { style: [styles.label, { color: colors.text }], children: question.label }), question.required ? (_jsx(View, { style: [styles.requiredBadge, { backgroundColor: colors.primary, marginLeft: 8 }], children: _jsx(Text, { style: styles.requiredText, children: "\u5FC5\u9808" }) })) : (_jsx(View, { style: [styles.optionalBadge, { backgroundColor: colors.surface, marginLeft: 8 }], children: _jsx(Text, { style: [styles.optionalText, { color: colors.textSecondary }], children: "\u4EFB\u610F" }) }))] }), _jsx(View, { style: styles.radioOptions, children: question.options.map((option, index) => {
                        const isSelected = value === option.value;
                        return (_jsxs(TouchableOpacity, { style: [styles.radioOption, index > 0 && { marginTop: 8 }], onPress: () => setCustomAnswers({ ...customAnswers, [question.id]: option.value }), children: [_jsx(View, { style: [styles.radioButton, { borderColor: colors.border }], children: isSelected && _jsx(View, { style: [styles.radioButtonInner, { backgroundColor: colors.primary }] }) }), _jsx(Text, { style: [styles.radioOptionLabel, { color: colors.text, marginLeft: 12 }], children: option.label })] }, option.value));
                    }) })] }, question.id));
    };
    const handleSubmit = async () => {
        // Validate required fields
        if (rating === 0) {
            setError('評価を選択してください');
            return;
        }
        if (!subject.trim()) {
            setError('件名を入力してください');
            return;
        }
        if (!content.trim()) {
            setError('本文を入力してください');
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
        // Validate required built-in questions
        for (const question of builtInQuestions) {
            if (question.required) {
                const answer = customAnswers[question.id];
                if (!answer || (typeof answer === 'string' && !answer.trim())) {
                    setError(`${question.label}を入力してください`);
                    return;
                }
            }
        }
        setError(null);
        setLoading(true);
        try {
            await sdk.reviews().submitReview(productId, {
                rating,
                subject,
                content,
                email,
                name: name || undefined,
                nickname: nickname || undefined,
                customAnswers: Object.keys(customAnswers).length > 0 ? customAnswers : undefined,
            });
            // Reset form
            setRating(0);
            setSubject('');
            setContent('');
            setName('');
            setEmail('');
            setNickname('');
            setCustomAnswers({});
            if (onSubmitSuccess) {
                onSubmitSuccess();
            }
            if (onClose) {
                onClose();
            }
        }
        catch (err) {
            let errorMessage = 'レビューの投稿に失敗しました';
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
    return (_jsxs(View, { style: [styles.formAdvanced, { backgroundColor: colors.background, borderColor: colors.border }], children: [_jsxs(View, { style: styles.formGroup, children: [_jsxs(View, { style: styles.labelRow, children: [_jsx(Text, { style: [styles.label, { color: colors.text }], children: "\u8A55\u4FA1" }), _jsx(View, { style: [styles.requiredBadge, { backgroundColor: colors.primary, marginLeft: 8 }], children: _jsx(Text, { style: styles.requiredText, children: "\u5FC5\u9808" }) })] }), renderStarInput()] }), _jsxs(View, { style: styles.formGroup, children: [_jsxs(View, { style: styles.labelRow, children: [_jsx(Text, { style: [styles.label, { color: colors.text }], children: "\u4EF6\u540D" }), _jsx(View, { style: [styles.requiredBadge, { backgroundColor: colors.primary, marginLeft: 8 }], children: _jsx(Text, { style: styles.requiredText, children: "\u5FC5\u9808" }) })] }), _jsx(TextInput, { style: [styles.textInput, { borderColor: colors.border, color: colors.text }], value: subject, onChangeText: setSubject, placeholder: "\u4EF6\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", placeholderTextColor: colors.textSecondary })] }), _jsxs(View, { style: styles.formGroup, children: [_jsxs(View, { style: styles.labelRow, children: [_jsx(Text, { style: [styles.label, { color: colors.text }], children: "\u672C\u6587" }), _jsx(View, { style: [styles.requiredBadge, { backgroundColor: colors.primary, marginLeft: 8 }], children: _jsx(Text, { style: styles.requiredText, children: "\u5FC5\u9808" }) })] }), _jsx(TextInput, { style: [styles.textArea, { borderColor: colors.border, color: colors.text }], value: content, onChangeText: setContent, placeholder: "\u30EC\u30D3\u30E5\u30FC\u672C\u6587\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", placeholderTextColor: colors.textSecondary, multiline: true, numberOfLines: 8, textAlignVertical: "top" })] }), _jsxs(View, { style: styles.formGroup, children: [_jsxs(View, { style: styles.labelRow, children: [_jsx(Text, { style: [styles.label, { color: colors.text }], children: "\u304A\u540D\u524D" }), _jsx(View, { style: [styles.optionalBadge, { backgroundColor: colors.surface, marginLeft: 8 }], children: _jsx(Text, { style: [styles.optionalText, { color: colors.textSecondary }], children: "\u4EFB\u610F" }) })] }), _jsx(TextInput, { style: [styles.textInput, { borderColor: colors.border, color: colors.text }], value: name, onChangeText: setName, placeholder: "\u304A\u540D\u524D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", placeholderTextColor: colors.textSecondary })] }), _jsxs(View, { style: styles.formGroup, children: [_jsxs(View, { style: styles.labelRow, children: [_jsx(Text, { style: [styles.label, { color: colors.text }], children: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9" }), _jsx(View, { style: [styles.requiredBadge, { backgroundColor: colors.primary, marginLeft: 8 }], children: _jsx(Text, { style: styles.requiredText, children: "\u5FC5\u9808" }) })] }), _jsx(TextInput, { style: [styles.textInput, { borderColor: colors.border, color: colors.text }], value: email, onChangeText: setEmail, placeholder: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", placeholderTextColor: colors.textSecondary, keyboardType: "email-address", autoCapitalize: "none" })] }), _jsxs(View, { style: styles.formGroup, children: [_jsxs(View, { style: styles.labelRow, children: [_jsx(Text, { style: [styles.label, { color: colors.text }], children: "\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0" }), _jsx(View, { style: [styles.optionalBadge, { backgroundColor: colors.surface, marginLeft: 8 }], children: _jsx(Text, { style: [styles.optionalText, { color: colors.textSecondary }], children: "\u4EFB\u610F" }) })] }), _jsx(TextInput, { style: [styles.textInput, { borderColor: colors.border, color: colors.text }], value: nickname, onChangeText: setNickname, placeholder: "\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", placeholderTextColor: colors.textSecondary })] }), builtInQuestions.map((question) => {
                if (question.type === 'scale') {
                    return renderScaleQuestion(question);
                }
                else if (question.type === 'radio') {
                    return renderRadioQuestion(question);
                }
                return null;
            }), error && (_jsx(View, { style: styles.errorContainer, children: _jsx(Text, { style: [styles.errorText, { color: colors.error }], children: error }) })), _jsx(TouchableOpacity, { style: [styles.submitButton, { backgroundColor: colors.primary }], onPress: handleSubmit, disabled: loading, children: loading ? (_jsx(ActivityIndicator, { color: "#FFFFFF" })) : (_jsx(Text, { style: styles.submitButtonText, children: "\u6295\u7A3F\u3059\u308B" })) })] }));
};
const styles = StyleSheet.create({
    formAdvanced: {
        width: '100%',
        maxWidth: 600,
        borderWidth: 1,
        borderRadius: 8,
        padding: 20, // 1.25rem = 20px
    },
    formGroup: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
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
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starMargin: {
        marginLeft: 4,
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
    scaleOptions: {
        flexDirection: 'column',
    },
    scaleOption: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scaleBarContainer: {
        flexDirection: 'row',
        width: 96,
    },
    scaleBar: {
        flex: 1,
        height: 8,
        borderRadius: 2,
    },
    scaleOptionLabel: {
        fontSize: 14, // 0.875rem = 14px
        flex: 1,
    },
    radioOptions: {
        flexDirection: 'column',
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    radioOptionLabel: {
        fontSize: 14, // 0.875rem = 14px
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
