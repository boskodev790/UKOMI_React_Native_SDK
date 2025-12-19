import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { UKomiSDK } from '../UKomiSDK';
import { Review } from '../types/ReviewModels';

/**
 * Props for the ProductReviewList component
 */
export interface ProductReviewListProps {
  /** The UKomiSDK instance (must be authenticated) */
  sdk: UKomiSDK;
  /** The product ID to fetch reviews for */
  productId: string;
  /** Number of reviews per page (default: 10) */
  reviewsPerPage?: number;
  /** Optional: Custom style for the container */
  containerStyle?: ViewStyle;
  /** Optional: Custom title text (default: Japanese) */
  title?: string;
  /** Optional: Show tabs for Reviews/Q&A (default: false) */
  showTabs?: boolean;
  /** Optional: Callback when a review is marked as helpful */
  onHelpfulPress?: (reviewId: string) => void;
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
  /** Optional: Show loading indicator (default: true) */
  showLoading?: boolean;
}

type SortOption = 'date' | 'rating' | 'helpful' | 'verified' | 'media';
type SortOrder = 'asc' | 'desc';

/**
 * ProductReviewList Component
 * 
 * Displays a list of product reviews with sorting, filtering, and pagination.
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
 */
export const ProductReviewList: React.FC<ProductReviewListProps> = ({
  sdk,
  productId,
  reviewsPerPage = 10,
  containerStyle,
  title = 'お客様レビュー（口コミ、評価）',
  showTabs = false,
  onHelpfulPress,
  colors: customColors,
  showLoading = true,
}) => {
  // Default colors (can be overridden)
  const colors = {
    background: customColors?.background || '#FFFFFF',
    text: customColors?.text || '#000000',
    textSecondary: customColors?.textSecondary || '#666666',
    primary: customColors?.primary || '#3b82f6',
    border: customColors?.border || '#e5e5e5',
    surface: customColors?.surface || '#f5f5f5',
    error: customColors?.error || '#ef4444',
  };

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'reviews' | 'qa'>('reviews');
  const [activeSort, setActiveSort] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});

  // Star SVG path
  const starPath = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';

  // Fetch reviews
  const fetchReviews = useCallback(async (page: number, sort: SortOption, order: SortOrder) => {
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
      } else if (sort === 'media') {
        filteredReviews = fetchedReviews.filter(r => r.review_images && r.review_images.length > 0);
      }

      setReviews(filteredReviews);
      
      // Estimate total pages (API doesn't return total, so we'll use a heuristic)
      // If we get fewer reviews than requested, we're on the last page
      if (filteredReviews.length < reviewsPerPage) {
        setTotalPages(page);
      } else {
        // Estimate: assume there might be more pages
        setTotalPages(page + 1);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [sdk, productId, reviewsPerPage]);

  // Initial fetch and refetch on dependencies change
  useEffect(() => {
    fetchReviews(currentPage, activeSort, sortOrder);
  }, [currentPage, activeSort, sortOrder, fetchReviews]);

  // Render a single star
  const renderStar = (isFilled: boolean, key: number, size: number = 16) => {
    const fillColor = isFilled ? '#f5c518' : 'transparent';
    const strokeColor = isFilled ? '#f5c518' : '#e0e0e0';
    
    return (
      <Svg
        key={key}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={key > 0 ? { marginLeft: 2 } : undefined}
      >
        <Path
          d={starPath}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </Svg>
    );
  };

  // Render stars for a rating
  const renderStars = (rating: number, size: number = 16) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= fullStars || (starNumber === fullStars + 1 && hasHalfStar);
          return renderStar(isFilled, index, size);
        })}
      </View>
    );
  };

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    } catch {
      return dateString;
    }
  };

  // Handle sort option press
  const handleSortPress = (sort: SortOption) => {
    if (sort === activeSort) {
      // Toggle order if same sort is pressed
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setActiveSort(sort);
      setSortOrder('desc'); // Default to descending
      setCurrentPage(1); // Reset to first page
    }
  };

  // Handle helpful button press
  const handleHelpfulPress = (reviewId: string) => {
    setHelpfulCounts(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    if (onHelpfulPress) {
      onHelpfulPress(reviewId);
    }
  };

  // Get helpful count for a review
  const getHelpfulCount = (reviewId: string): number => {
    return helpfulCounts[reviewId] || 0; // Default to 0 if not set
  };

  // Sort options configuration
  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'date', label: '日付順' },
    { key: 'rating', label: '評価順' },
    { key: 'helpful', label: '役に立った' },
    { key: 'verified', label: '購入確認済み' },
    { key: 'media', label: 'メディア付き' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, containerStyle]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              fill={colors.text}
            />
          </Svg>
          <Text style={[styles.headerText, { color: colors.text }]}>{title}</Text>
        </View>
      </View>

      {/* Tabs */}
      {showTabs && (
        <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && [styles.activeTab, { borderBottomColor: colors.primary }]]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'reviews' ? colors.primary : colors.textSecondary },
              ]}
            >
              レビュー
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'qa' && [styles.activeTab, { borderBottomColor: colors.primary }]]}
            onPress={() => setActiveTab('qa')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'qa' ? colors.primary : colors.textSecondary },
              ]}
            >
              Q&A
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filters and Sort */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            // TODO: Implement advanced filter modal
          }}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="#FFFFFF"
            />
          </Svg>
          <Text style={styles.filterButtonText}>詳細フィルター</Text>
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Path d="M7 10l5 5 5-5z" fill="#FFFFFF" />
          </Svg>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sortOptionsContainer}
          contentContainerStyle={styles.sortOptionsContent}
        >
          {sortOptions.map((option) => {
            const isActive = activeSort === option.key;
            const showArrow = isActive && option.key === 'date';
            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortButton,
                  {
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => handleSortPress(option.key)}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    { color: isActive ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {option.label}
                  {showArrow && (
                    <Text style={{ color: '#FFFFFF' }}> {sortOrder === 'desc' ? '↓' : '↑'}</Text>
                  )}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Loading State */}
      {loading && showLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            レビューを読み込み中...
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      {/* Reviews List */}
      {!loading && !error && reviews.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            レビューがありません
          </Text>
        </View>
      )}

      {!loading && !error && reviews.length > 0 && (
        <>
          <View style={styles.reviewsList}>
            {reviews.map((review) => {
              const rating = parseFloat(review.score) || 0;
              const isVerified = review.reviewer_type === 'verified_buyer';
              const helpfulCount = getHelpfulCount(review.id);

              return (
                <View key={review.id} style={[styles.reviewItem, { borderBottomColor: colors.border }]}>
                  {/* Review Header */}
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewHeaderLeft}>
                      {renderStars(rating, 18)}
                      <View style={styles.reviewerInfo}>
                        {isVerified && (
                          <>
                            <Text style={[styles.reviewerText, { color: colors.text }]}>
                              ご購入者様
                            </Text>
                            <View style={[styles.verifiedBadge, { backgroundColor: '#10b981' }]}>
                              <Text style={styles.verifiedBadgeText}>購入確認済み</Text>
                            </View>
                          </>
                        )}
                        {!isVerified && (
                          <Text style={[styles.reviewerText, { color: colors.text }]}>
                            {review.nickname || review.name || '匿名'}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
                      {formatDate(review.created_at)}
                    </Text>
                  </View>

                  {/* Review Content */}
                  <Text style={[styles.reviewContent, { color: colors.text }]}>
                    {review.content || review.title || ''}
                  </Text>

                  {/* Helpful Button */}
                  <TouchableOpacity
                    style={styles.helpfulButton}
                    onPress={() => handleHelpfulPress(review.id)}
                  >
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M7 22V11M2 13v2c0 3.771 0 5.657 1.172 6.828C4.343 23 6.229 23 10 23h1.5c2.485 0 4.728-.895 6.284-2.34.597-.556.793-1.127.844-1.91.025-.388.025-.811.025-1.25v-.5c0-2.828 0-4.243-.879-5.121C17.243 9 15.828 9 13 9h-1.5c-.464 0-.697 0-.888-.038a2 2 0 01-1.574-1.574C9 7.197 9 6.964 9 6.5V5c0-.943 0-1.414-.293-1.707C8.414 3 7.943 3 7 3c-.943 0-1.414 0-1.707.293C5 3.586 5 4.057 5 5v8"
                        stroke={colors.textSecondary}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                      />
                    </Svg>
                    <Text style={[styles.helpfulText, { color: colors.textSecondary }]}>
                      役に立った {helpfulCount}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* Pagination */}
          {totalPages > 1 && (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  {
                    backgroundColor: currentPage === 1 ? colors.surface : colors.primary,
                    opacity: currentPage === 1 ? 0.5 : 1,
                  },
                ]}
                onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <Text
                  style={[
                    styles.paginationButtonText,
                    { color: currentPage === 1 ? colors.textSecondary : '#FFFFFF' },
                  ]}
                >
                  前へ
                </Text>
              </TouchableOpacity>

              <Text style={[styles.paginationInfo, { color: colors.text }]}>
                {currentPage} / {totalPages} ページ
              </Text>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  {
                    backgroundColor: currentPage === totalPages ? colors.surface : colors.primary,
                    opacity: currentPage === totalPages ? 0.5 : 1,
                  },
                ]}
                onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <Text
                  style={[
                    styles.paginationButtonText,
                    { color: currentPage === totalPages ? colors.textSecondary : '#FFFFFF' },
                  ]}
                >
                  次へ
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
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
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  reviewsList: {
    width: '100%',
  },
  reviewItem: {
    paddingVertical: 16,
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
    lineHeight: 20,
    marginBottom: 8,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  helpfulText: {
    fontSize: 12,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 24,
    paddingTop: 16,
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  paginationButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  paginationInfo: {
    fontSize: 14,
    fontWeight: '500',
  },
});