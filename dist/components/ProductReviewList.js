import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
export const ProductReviewList = ({ sdk, productId, reviewsPerPage = 10, containerStyle, onHelpfulPress, colors: customColors, showLoading = true, }) => {
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
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(true);
    const [activeTab, setActiveTab] = useState('reviews');
    const [activeSort, setActiveSort] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [helpfulCounts, setHelpfulCounts] = useState({});
    // Star SVG path
    const starPath = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';
    // Fetch reviews
    const fetchReviews = useCallback(async (page, sort, order) => {
        if (!sdk || !productId) {
            setError('SDK or productId is missing');
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            // Map sort option to API sort field
            const sortField = sort === 'date' ? 'date' : sort === 'rating' ? 'score' : 'date';
            const response = await sdk.reviews().getProductReviews(productId, {
                count: reviewsPerPage,
                page: page,
                sort: sortField,
                sortOrder: order,
            });
            const fetchedReviews = response.review || [];
            // Apply client-side filtering for verified/media if needed
            let filteredReviews = fetchedReviews;
            if (sort === 'verified') {
                filteredReviews = fetchedReviews.filter(r => r.reviewer_type === 'verified_buyer');
            }
            else if (sort === 'media') {
                filteredReviews = fetchedReviews.filter(r => r.review_images && r.review_images.length > 0);
            }
            setReviews(filteredReviews);
            // Estimate total pages (API doesn't return total, so we'll use a heuristic)
            // If we get fewer reviews than requested, we're on the last page
            if (filteredReviews.length < reviewsPerPage) {
                setTotalPages(page);
            }
            else {
                // Estimate: assume there might be more pages
                setTotalPages(page + 1);
            }
        }
        catch (err) {
            console.error('Error fetching reviews:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
            setReviews([]);
        }
        finally {
            setLoading(false);
        }
    }, [sdk, productId, reviewsPerPage]);
    // Initial fetch and refetch on dependencies change
    useEffect(() => {
        fetchReviews(currentPage, activeSort, sortOrder);
    }, [currentPage, activeSort, sortOrder, fetchReviews]);
    // Render a single star
    const renderStar = (isFilled, key, size = 16) => {
        const fillColor = isFilled ? '#f5c518' : 'transparent';
        const strokeColor = isFilled ? '#f5c518' : '#e0e0e0';
        return (_jsx(Svg, { width: size, height: size, viewBox: "0 0 24 24", style: key > 0 ? { marginLeft: 2 } : undefined, children: _jsx(Path, { d: starPath, fill: fillColor, stroke: strokeColor, strokeWidth: 1.5, strokeLinejoin: "round" }) }, key));
    };
    // Render stars for a rating
    const renderStars = (rating, size = 16) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        return (_jsx(View, { style: styles.starsContainer, children: [...Array(5)].map((_, index) => {
                const starNumber = index + 1;
                const isFilled = starNumber <= fullStars || (starNumber === fullStars + 1 && hasHalfStar);
                return renderStar(isFilled, index, size);
            }) }));
    };
    // Format date
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        }
        catch {
            return dateString;
        }
    };
    // Handle sort option press
    const handleSortPress = (sort) => {
        if (sort === activeSort) {
            // Toggle order if same sort is pressed
            setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
        }
        else {
            setActiveSort(sort);
            setSortOrder('desc'); // Default to descending
            setCurrentPage(1); // Reset to first page
            setTotalPages(1); // Reset total pages
            setHasMorePages(true); // Reset has more pages
        }
    };
    // Generate page numbers to display (show up to 5 page numbers)
    const getPageNumbers = () => {
        const maxVisiblePages = 5;
        const pages = [];
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            // Show smart pagination with ellipsis
            if (currentPage <= 3) {
                // Show first 4 pages + last page
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push(totalPages);
            }
            else if (currentPage >= totalPages - 2) {
                // Show first page + last 4 pages
                pages.push(1);
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            }
            else {
                // Show first page + current-1, current, current+1 + last page
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
    const handleHelpfulPress = (reviewId) => {
        setHelpfulCounts(prev => ({
            ...prev,
            [reviewId]: (prev[reviewId] || 0) + 1,
        }));
        if (onHelpfulPress) {
            onHelpfulPress(reviewId);
        }
    };
    // Get helpful count for a review
    const getHelpfulCount = (reviewId) => {
        return helpfulCounts[reviewId] || 0; // Default to 0 if not set
    };
    // Sort options configuration
    const sortOptions = [
        { key: 'date', label: '日付順' },
        { key: 'rating', label: '評価順' },
        { key: 'helpful', label: '役に立った' },
        { key: 'verified', label: '購入確認済み' },
        { key: 'media', label: 'メディア付き' },
    ];
    return (_jsxs(View, { style: [styles.container, { backgroundColor: colors.background }, containerStyle], children: [_jsx(View, { style: styles.filtersContainer, children: _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, style: styles.sortOptionsContainer, contentContainerStyle: styles.sortOptionsContent, children: sortOptions.map((option) => {
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
                                ], children: [option.label, showArrow && (_jsxs(Text, { style: { color: '#FFFFFF' }, children: [" ", sortOrder === 'desc' ? '↓' : '↑'] }))] }) }, option.key));
                    }) }) }), loading && showLoading && (_jsxs(View, { style: styles.loadingContainer, children: [_jsx(ActivityIndicator, { size: "large", color: colors.primary }), _jsx(Text, { style: [styles.loadingText, { color: colors.textSecondary }], children: "\u30EC\u30D3\u30E5\u30FC\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D..." })] })), error && !loading && (_jsx(View, { style: styles.errorContainer, children: _jsx(Text, { style: [styles.errorText, { color: colors.error }], children: error }) })), !loading && !error && reviews.length === 0 && (_jsx(View, { style: styles.emptyContainer, children: _jsx(Text, { style: [styles.emptyText, { color: colors.textSecondary }], children: "\u30EC\u30D3\u30E5\u30FC\u304C\u3042\u308A\u307E\u305B\u3093" }) })), !loading && !error && reviews.length > 0 && (_jsxs(_Fragment, { children: [_jsx(View, { style: styles.reviewsList, children: reviews.map((review) => {
                            const rating = parseFloat(review.score) || 0;
                            const isVerified = review.reviewer_type === 'verified_buyer';
                            const helpfulCount = getHelpfulCount(review.id);
                            return (_jsxs(View, { style: [styles.reviewItem, { borderBottomColor: colors.border }], children: [_jsxs(View, { style: styles.reviewHeader, children: [_jsxs(View, { style: styles.reviewHeaderLeft, children: [renderStars(rating, 18), _jsxs(View, { style: styles.reviewerInfo, children: [isVerified && (_jsxs(_Fragment, { children: [_jsx(Text, { style: [styles.reviewerText, { color: colors.text }], children: "\u3054\u8CFC\u5165\u8005\u69D8" }), _jsx(View, { style: [styles.verifiedBadge, { backgroundColor: '#10b981' }], children: _jsx(Text, { style: styles.verifiedBadgeText, children: "\u8CFC\u5165\u78BA\u8A8D\u6E08\u307F" }) })] })), !isVerified && (_jsx(Text, { style: [styles.reviewerText, { color: colors.text }], children: review.nickname || review.name || '匿名' }))] })] }), _jsx(Text, { style: [styles.reviewDate, { color: colors.textSecondary }], children: formatDate(review.created_at) })] }), _jsx(Text, { style: [styles.reviewContent, { color: colors.text }], children: review.content || review.title || '' }), _jsxs(TouchableOpacity, { style: styles.helpfulButton, onPress: () => handleHelpfulPress(review.id), children: [_jsx(Svg, { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", children: _jsx(Path, { d: "M7 22V11M2 13v2c0 3.771 0 5.657 1.172 6.828C4.343 23 6.229 23 10 23h1.5c2.485 0 4.728-.895 6.284-2.34.597-.556.793-1.127.844-1.91.025-.388.025-.811.025-1.25v-.5c0-2.828 0-4.243-.879-5.121C17.243 9 15.828 9 13 9h-1.5c-.464 0-.697 0-.888-.038a2 2 0 01-1.574-1.574C9 7.197 9 6.964 9 6.5V5c0-.943 0-1.414-.293-1.707C8.414 3 7.943 3 7 3c-.943 0-1.414 0-1.707.293C5 3.586 5 4.057 5 5v8", stroke: colors.textSecondary, strokeWidth: 1.5, strokeLinecap: "round" }) }), _jsxs(Text, { style: [styles.helpfulText, { color: colors.textSecondary }], children: ["\u5F79\u306B\u7ACB\u3063\u305F ", helpfulCount] })] })] }, review.id));
                        }) }), reviews.length > 0 && (hasMorePages || currentPage > 1) && (_jsxs(View, { style: styles.pagination, children: [_jsx(TouchableOpacity, { style: [
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
                                }) }), totalPages > 1 && (_jsxs(Text, { style: [styles.paginationInfo, { color: colors.textSecondary }], children: [currentPage, " / ", hasMorePages && currentPage === totalPages ? '...' : totalPages] })), _jsx(TouchableOpacity, { style: [
                                    styles.paginationButton,
                                    {
                                        backgroundColor: !hasMorePages && currentPage === totalPages ? colors.surface : colors.primary,
                                        opacity: !hasMorePages && currentPage === totalPages ? 0.5 : 1,
                                    },
                                ], onPress: () => {
                                    if (hasMorePages || currentPage < totalPages) {
                                        setCurrentPage(prev => prev + 1);
                                    }
                                }, disabled: !hasMorePages && currentPage === totalPages, children: _jsx(Text, { style: [
                                        styles.paginationButtonText,
                                        {
                                            color: !hasMorePages && currentPage === totalPages ? colors.textSecondary : '#FFFFFF',
                                        },
                                    ], children: "\u6B21\u3078" }) })] }))] }))] }));
};
const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 16,
        paddingBottom: 16,
    },
    header: {
        paddingBottom: 12,
        borderBottomWidth: 1,
        marginBottom: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
    },
    tabs: {
        flexDirection: 'row',
        gap: 16,
        borderBottomWidth: 1,
        marginBottom: 16,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
    // borderBottomColor set dynamically
    },
    tabText: {
        fontSize: 14,
    },
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
        gap: 12,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 6,
    },
    filterButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    sortOptionsContainer: {
        flex: 1,
    },
    sortOptionsContent: {
        flexDirection: 'row',
        gap: 8,
    },
    sortButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        minHeight: 36,
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
    reviewsList: {
        width: '100%',
        paddingHorizontal: 16,
    },
    reviewItem: {
        paddingVertical: 20,
        borderBottomWidth: 1,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    reviewHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    reviewerText: {
        fontSize: 14,
        fontWeight: '500',
    },
    verifiedBadge: {
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 4,
    },
    verifiedBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '500',
    },
    reviewDate: {
        fontSize: 14,
    },
    reviewContent: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 12,
        marginTop: 4,
    },
    helpfulButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 4,
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
