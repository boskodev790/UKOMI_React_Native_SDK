import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
export const StarRating = ({ sdk, productId, starSize = 16, containerStyle, countStyle, showLoading = true, formatCount, }) => {
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchReviews = async () => {
            if (!sdk || !productId) {
                setError('SDK or productId is missing');
                setLoading(false);
                return;
            }
            if (!sdk.isAuthenticated()) {
                setError('SDK is not authenticated');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                // Fetch reviews for the product
                const response = await sdk.reviews().getProductReviews(productId, {
                    count: '1000', // Get all reviews to calculate accurate average
                });
                const reviews = response.review || [];
                if (reviews.length === 0) {
                    setAverageRating(0);
                    setReviewCount(0);
                    setLoading(false);
                    return;
                }
                // Calculate average rating
                const totalScore = reviews.reduce((sum, review) => {
                    const score = parseFloat(review.score) || 0;
                    return sum + score;
                }, 0);
                const avgRating = totalScore / reviews.length;
                // Ensure rating is valid (0-5 range)
                setAverageRating(isNaN(avgRating) || !isFinite(avgRating) ? 0 : Math.max(0, Math.min(5, avgRating)));
                setReviewCount(reviews.length);
            }
            catch (err) {
                console.error('Error fetching reviews:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
                setAverageRating(0);
                setReviewCount(0);
            }
            finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [sdk, productId]);
    // Star SVG path
    const starPath = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';
    // Render a single star SVG
    const renderStar = (isFilled, key) => {
        const fillColor = isFilled ? '#f5c518' : 'transparent';
        const strokeColor = isFilled ? '#f5c518' : '#e0e0e0';
        return (_jsx(Svg, { width: starSize, height: starSize, viewBox: "0 0 24 24", style: key > 0 ? styles.starMargin : undefined, children: _jsx(Path, { d: starPath, fill: fillColor, stroke: strokeColor, strokeWidth: 1.5, strokeLinejoin: "round" }) }, key));
    };
    // Render stars (0-5)
    const renderStars = () => {
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 >= 0.5;
        return (_jsx(View, { style: styles.starsContainer, children: [...Array(5)].map((_, index) => {
                const starNumber = index + 1;
                const isFilled = starNumber <= fullStars || (starNumber === fullStars + 1 && hasHalfStar);
                return renderStar(isFilled, index);
            }) }));
    };
    // Format review count
    const formatReviewCount = (count) => {
        if (formatCount) {
            return formatCount(count);
        }
        return `${count}件`;
    };
    if (loading) {
        if (showLoading) {
            return (_jsx(View, { style: [styles.container, containerStyle], children: _jsx(ActivityIndicator, { size: "small", color: "#f5c518" }) }));
        }
        // If loading but showLoading is false, show empty state
        return (_jsx(View, { style: [styles.container, containerStyle], children: _jsx(Text, { style: styles.errorText, children: "\u2014" }) }));
    }
    return (_jsxs(View, { style: [styles.container, containerStyle], children: [renderStars(), reviewCount > 0 && (_jsx(Text, { style: [styles.count, countStyle, styles.countMargin], children: formatReviewCount(reviewCount) }))] }));
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
    },
    starMargin: {
        marginLeft: 2,
    },
    count: {
        fontSize: 14,
        color: '#666',
    },
    countMargin: {
        marginLeft: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#999',
    },
});
