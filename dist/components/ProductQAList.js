import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Image, } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
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
export const ProductQAList = ({ sdk, productId, questionsPerPage = 10, containerStyle, onHelpfulPress, colors: customColors, showLoading = true, t, }) => {
    // Default colors (can be overridden) - Dark theme by default
    const colors = {
        background: customColors?.background || '#000000',
        text: customColors?.text || '#FFFFFF',
        textSecondary: customColors?.textSecondary || '#CCCCCC',
        primary: customColors?.primary || '#3b82f6',
        border: customColors?.border || '#333333',
        surface: customColors?.surface || '#1a1a1a',
        error: customColors?.error || '#ef4444',
    };
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeSort, setActiveSort] = useState('date');
    const [helpfulCounts, setHelpfulCounts] = useState({});
    const [expandedQuestions, setExpandedQuestions] = useState(new Set());
    // Fetch questions
    const fetchQuestions = useCallback(async () => {
        if (!sdk || !productId) {
            setError('SDK or productId is missing');
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const allQuestions = await sdk.questions().getProductQuestions(productId);
            // Sort questions
            let sortedQuestions = [...allQuestions];
            if (activeSort === 'date') {
                sortedQuestions.sort((a, b) => {
                    const dateA = a.published ? new Date(a.published).getTime() : 0;
                    const dateB = b.published ? new Date(b.published).getTime() : 0;
                    return dateB - dateA; // Descending (newest first)
                });
            }
            else if (activeSort === 'helpful') {
                sortedQuestions.sort((a, b) => {
                    const countA = helpfulCounts[a.id] || 0;
                    const countB = helpfulCounts[b.id] || 0;
                    return countB - countA; // Descending (most helpful first)
                });
            }
            setQuestions(sortedQuestions);
            setTotalPages(Math.ceil(sortedQuestions.length / questionsPerPage));
        }
        catch (err) {
            console.error('Error fetching questions:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch questions');
            setQuestions([]);
        }
        finally {
            setLoading(false);
        }
    }, [sdk, productId, activeSort, helpfulCounts, questionsPerPage]);
    // Initial fetch and refetch on dependencies change
    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);
    // Format date to relative time (e.g., "8 months ago")
    const formatRelativeDate = (dateString) => {
        if (!dateString)
            return '';
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInMs = now.getTime() - date.getTime();
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
            if (diffInDays < 1)
                return '今日';
            if (diffInDays === 1)
                return '1日前';
            if (diffInDays < 30) {
                return `${diffInDays}日前`;
            }
            const diffInMonths = Math.floor(diffInDays / 30);
            if (diffInMonths < 12) {
                return `${diffInMonths}か月前`;
            }
            const diffInYears = Math.floor(diffInMonths / 12);
            return `${diffInYears}年前`;
        }
        catch {
            return dateString;
        }
    };
    // Handle sort option press
    const handleSortPress = (sort) => {
        setActiveSort(sort);
        setCurrentPage(1);
    };
    // Get paginated questions
    const getPaginatedQuestions = () => {
        const startIndex = (currentPage - 1) * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;
        return questions.slice(startIndex, endIndex);
    };
    // Generate page numbers to display (show up to 5 page numbers)
    const getPageNumbers = () => {
        const maxVisiblePages = 5;
        const pages = [];
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push(totalPages);
            }
            else if (currentPage >= totalPages - 2) {
                pages.push(1);
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            }
            else {
                pages.push(1);
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push(totalPages);
            }
        }
        return pages;
    };
    // Handle helpful button press
    const handleHelpfulPress = (questionId) => {
        setHelpfulCounts(prev => ({
            ...prev,
            [questionId]: (prev[questionId] || 0) + 1,
        }));
        if (onHelpfulPress) {
            onHelpfulPress(questionId);
        }
    };
    // Get helpful count for a question
    const getHelpfulCount = (questionId) => {
        return helpfulCounts[questionId] || 0;
    };
    // Toggle question expansion
    const toggleQuestion = (questionId) => {
        setExpandedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            }
            else {
                newSet.add(questionId);
            }
            return newSet;
        });
    };
    // Check if question has answer
    const hasAnswer = (question) => {
        return !!question.answer && question.answer.trim().length > 0;
    };
    // Check if questioner is verified buyer
    const isVerifiedBuyer = (question) => {
        return question.label === 'verified_buyer' || question.questioner?.name === 'ご購入者様';
    };
    // Sort options configuration
    const sortOptions = [
        { key: 'date', label: '日付順' },
        { key: 'helpful', label: 'いいね数順' },
    ];
    const paginatedQuestions = getPaginatedQuestions();
    return (_jsxs(View, { style: [styles.container, { backgroundColor: colors.background }, containerStyle], children: [_jsx(View, { style: styles.sortContainer, children: _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, style: styles.sortOptionsContainer, contentContainerStyle: styles.sortOptionsContent, children: sortOptions.map((option) => {
                        const isActive = activeSort === option.key;
                        const showArrow = isActive && option.key === 'date';
                        return (_jsx(TouchableOpacity, { style: [
                                styles.sortButton,
                                {
                                    backgroundColor: isActive ? colors.primary : colors.surface,
                                    borderColor: colors.border,
                                },
                            ], onPress: () => handleSortPress(option.key), children: _jsxs(Text, { style: [
                                    styles.sortButtonText,
                                    { color: isActive ? '#FFFFFF' : colors.text },
                                ], children: [option.label, showArrow && (_jsx(Text, { style: { color: '#FFFFFF' }, children: " \u2193" }))] }) }, option.key));
                    }) }) }), loading && showLoading && (_jsxs(View, { style: styles.loadingContainer, children: [_jsx(ActivityIndicator, { size: "large", color: colors.primary }), _jsx(Text, { style: [styles.loadingText, { color: colors.textSecondary }], children: "\u8CEA\u554F\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D..." })] })), error && !loading && (_jsx(View, { style: styles.errorContainer, children: _jsx(Text, { style: [styles.errorText, { color: colors.error }], children: error }) })), !loading && !error && questions.length === 0 && (_jsx(View, { style: styles.emptyContainer, children: _jsx(Text, { style: [styles.emptyText, { color: colors.textSecondary }], children: "\u8CEA\u554F\u304C\u3042\u308A\u307E\u305B\u3093" }) })), !loading && !error && questions.length > 0 && (_jsxs(_Fragment, { children: [_jsx(View, { style: styles.questionsList, children: paginatedQuestions.map((question) => {
                            const helpfulCount = getHelpfulCount(question.id);
                            const isExpanded = expandedQuestions.has(question.id);
                            const hasAnswerText = hasAnswer(question);
                            const isVerified = isVerifiedBuyer(question);
                            return (_jsxs(View, { style: [styles.qaItem, { borderBottomColor: colors.border }], children: [_jsxs(View, { style: styles.qaHeader, children: [_jsx(Text, { style: [styles.qaAuthor, { color: colors.text }], children: isVerified ? 'ご購入者様' : question.questioner?.name || '匿名' }), _jsx(Text, { style: [styles.qaDate, { color: colors.textSecondary }], children: formatRelativeDate(question.published) })] }), _jsxs(View, { style: styles.questionContainer, children: [_jsx(Text, { style: [styles.qLabel, { color: colors.primary }], children: "Q" }), _jsx(Text, { style: [styles.questionText, { color: colors.text }], children: question.question })] }), hasAnswerText && (_jsx(_Fragment, { children: isExpanded ? (_jsxs(View, { style: [styles.answerContainer, { backgroundColor: colors.surface }], children: [_jsxs(View, { style: styles.answerHeader, children: [_jsx(View, { style: styles.answerAvatarContainer, children: question.answerer?.avatar ? (_jsx(Image, { source: { uri: question.answerer.avatar }, style: styles.answerImage })) : (_jsx(View, { style: [styles.answerImagePlaceholder, { backgroundColor: colors.border }], children: _jsxs(Svg, { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", children: [_jsx(Circle, { cx: "12", cy: "8", r: "4", stroke: colors.textSecondary, strokeWidth: "1.5" }), _jsx(Path, { d: "M6 21c0-3.314 2.686-6 6-6s6 2.686 6 6", stroke: colors.textSecondary, strokeWidth: "1.5", strokeLinecap: "round" })] }) })) }), _jsx(TouchableOpacity, { style: styles.closeButton, onPress: () => toggleQuestion(question.id), children: _jsx(Svg, { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", children: _jsx(Path, { d: "M18 6L6 18M6 6l12 12", stroke: colors.textSecondary, strokeWidth: "2", strokeLinecap: "round" }) }) })] }), _jsxs(View, { style: styles.answerContent, children: [_jsx(Text, { style: [styles.aLabel, { color: '#f87171' }], children: "A" }), _jsx(Text, { style: [styles.answerText, { color: colors.text }], children: question.answer })] })] })) : (_jsxs(TouchableOpacity, { style: styles.viewAnswerButton, onPress: () => toggleQuestion(question.id), children: [_jsx(Text, { style: [styles.viewAnswerText, { color: colors.primary }], children: "\u56DE\u7B54\u3092\u898B\u308B" }), _jsx(Svg, { width: 16, height: 16, viewBox: "0 0 24 24", children: _jsx(Path, { d: "M7 10l5 5 5-5z", fill: colors.primary }) })] })) })), _jsxs(TouchableOpacity, { style: [styles.helpfulButton, { borderColor: colors.border }], onPress: () => handleHelpfulPress(question.id), children: [_jsx(Svg, { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", children: _jsx(Path, { d: "M7 22V11M2 13v2c0 3.771 0 5.657 1.172 6.828C4.343 23 6.229 23 10 23h1.5c2.485 0 4.728-.895 6.284-2.34.597-.556.793-1.127.844-1.91.025-.388.025-.811.025-1.25v-.5c0-2.828 0-4.243-.879-5.121C17.243 9 15.828 9 13 9h-1.5c-.464 0-.697 0-.888-.038a2 2 0 01-1.574-1.574C9 7.197 9 6.964 9 6.5V5c0-.943 0-1.414-.293-1.707C8.414 3 7.943 3 7 3c-.943 0-1.414 0-1.707.293C5 3.586 5 4.057 5 5v8", stroke: colors.textSecondary, strokeWidth: 1.5, strokeLinecap: "round" }) }), _jsxs(Text, { style: [styles.helpfulText, { color: colors.textSecondary }], children: ["\u5F79\u306B\u7ACB\u3063\u305F ", helpfulCount] })] })] }, question.id));
                        }) }), questions.length > 0 && totalPages > 1 && (_jsxs(View, { style: styles.pagination, children: [_jsx(TouchableOpacity, { style: [
                                    styles.paginationButton,
                                    {
                                        backgroundColor: currentPage === 1 ? colors.surface : colors.primary,
                                        opacity: currentPage === 1 ? 0.5 : 1,
                                    },
                                ], onPress: () => setCurrentPage(prev => Math.max(1, prev - 1)), disabled: currentPage === 1, children: _jsx(Text, { style: [
                                        styles.paginationButtonText,
                                        { color: currentPage === 1 ? colors.textSecondary : '#FFFFFF' },
                                    ], children: "\u524D\u3078" }) }), _jsx(View, { style: styles.pageNumbersContainer, children: getPageNumbers().map((pageNum, index, array) => {
                                    const showEllipsisBefore = index > 0 && pageNum - array[index - 1] > 1;
                                    const isActive = pageNum === currentPage;
                                    return (_jsxs(React.Fragment, { children: [showEllipsisBefore && (_jsx(Text, { style: [styles.paginationEllipsis, { color: colors.textSecondary }], children: "..." })), _jsx(TouchableOpacity, { style: [
                                                    styles.pageNumberButton,
                                                    {
                                                        backgroundColor: isActive ? colors.primary : 'transparent',
                                                        borderColor: colors.border,
                                                    },
                                                ], onPress: () => setCurrentPage(pageNum), children: _jsx(Text, { style: [
                                                        styles.pageNumberText,
                                                        {
                                                            color: isActive ? '#FFFFFF' : colors.text,
                                                            fontWeight: isActive ? '600' : '400',
                                                        },
                                                    ], children: pageNum }) })] }, pageNum));
                                }) }), totalPages > 1 && (_jsxs(Text, { style: [styles.paginationInfo, { color: colors.textSecondary }], children: [currentPage, " / ", totalPages] })), _jsx(TouchableOpacity, { style: [
                                    styles.paginationButton,
                                    {
                                        backgroundColor: currentPage === totalPages ? colors.surface : colors.primary,
                                        opacity: currentPage === totalPages ? 0.5 : 1,
                                    },
                                ], onPress: () => setCurrentPage(prev => Math.min(totalPages, prev + 1)), disabled: currentPage === totalPages, children: _jsx(Text, { style: [
                                        styles.paginationButtonText,
                                        {
                                            color: currentPage === totalPages ? colors.textSecondary : '#FFFFFF',
                                        },
                                    ], children: "\u6B21\u3078" }) })] }))] }))] }));
};
const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 16,
        paddingBottom: 16,
    },
    sortContainer: {
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    sortOptionsContainer: {
        flex: 1,
    },
    sortOptionsContent: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    sortButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
        minHeight: 36,
        justifyContent: 'center',
    },
    answerImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    answerImagePlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sortButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    loadingContainer: {
        paddingVertical: 32,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
    },
    errorContainer: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 14,
    },
    emptyContainer: {
        paddingVertical: 32,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
    questionsList: {
        width: '100%',
        paddingHorizontal: 16,
    },
    qaItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    qaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    qaAuthor: {
        fontSize: 14,
        fontWeight: '500',
    },
    qaDate: {
        fontSize: 14,
    },
    questionContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    qLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 28,
    },
    questionText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 22,
    },
    answerContainer: {
        marginTop: 12,
        marginLeft: 32,
        padding: 16,
        borderRadius: 8,
    },
    answerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    answerAvatarContainer: {
        marginRight: 8,
    },
    answerContent: {
        flexDirection: 'row',
        gap: 12,
    },
    aLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 28,
    },
    answerText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 22,
    },
    closeButton: {
        padding: 4,
    },
    viewAnswerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    viewAnswerText: {
        fontSize: 14,
        fontWeight: '500',
    },
    helpfulButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
        marginTop: 12,
    },
    helpfulText: {
        fontSize: 13,
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 24,
        paddingTop: 20,
        paddingBottom: 8,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    paginationButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        minWidth: 70,
        alignItems: 'center',
    },
    paginationButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    pageNumbersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flex: 1,
        justifyContent: 'center',
    },
    pageNumberButton: {
        minWidth: 36,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    pageNumberText: {
        fontSize: 14,
        fontWeight: '400',
    },
    paginationEllipsis: {
        fontSize: 14,
        paddingHorizontal: 4,
    },
    paginationInfo: {
        fontSize: 13,
        fontWeight: '400',
        minWidth: 60,
        textAlign: 'center',
    },
});
