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
import { Question } from '../types/QuestionModels';

/**
 * Props for the ProductQAList component
 */
export interface ProductQAListProps {
  /** The UKomiSDK instance (must be authenticated) */
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

type SortOption = 'date' | 'helpful';

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
export const ProductQAList: React.FC<ProductQAListProps> = ({
  sdk,
  productId,
  questionsPerPage = 10,
  containerStyle,
  onHelpfulPress,
  colors: customColors,
  showLoading = true,
  t,
}) => {
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

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activeSort, setActiveSort] = useState<SortOption>('date');
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
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

      const allQuestions = await sdk.questions().getProductQuestions(productId);

      // Sort questions
      let sortedQuestions = [...allQuestions];
      if (activeSort === 'date') {
        sortedQuestions.sort((a, b) => {
          const dateA = a.published ? new Date(a.published).getTime() : 0;
          const dateB = b.published ? new Date(b.published).getTime() : 0;
          return dateB - dateA; // Descending (newest first)
        });
      } else if (activeSort === 'helpful') {
        sortedQuestions.sort((a, b) => {
          const countA = helpfulCounts[a.id] || 0;
          const countB = helpfulCounts[b.id] || 0;
          return countB - countA; // Descending (most helpful first)
        });
      }

      setQuestions(sortedQuestions);
      setTotalPages(Math.ceil(sortedQuestions.length / questionsPerPage));
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [sdk, productId, activeSort, helpfulCounts, questionsPerPage]);

  // Initial fetch and refetch on dependencies change
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Helper function to get translated text
  const getText = (key: string, fallback: string): string => {
    return t ? t(key) : fallback;
  };

  // Format date to relative time (e.g., "8 months ago")
  const formatRelativeDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays < 1) return getText('Today', '今日');
      if (diffInDays === 1) return getText('1 day ago', '1日前');
      if (diffInDays < 30) {
        // For translation, use a key with the number
        if (t) {
          return t(`${diffInDays} days ago`) || `${diffInDays}日前`;
        }
        return `${diffInDays}日前`;
      }
      
      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) {
        if (t) {
          return t(`${diffInMonths} months ago`) || `${diffInMonths}か月前`;
        }
        return `${diffInMonths}か月前`;
      }
      
      const diffInYears = Math.floor(diffInMonths / 12);
      if (t) {
        return t(`${diffInYears} years ago`) || `${diffInYears}年前`;
      }
      return `${diffInYears}年前`;
    } catch {
      return dateString;
    }
  };

  // Handle sort option press
  const handleSortPress = (sort: SortOption) => {
    setActiveSort(sort);
    setCurrentPage(1);
  };

  // Get paginated questions
  const getPaginatedQuestions = (): Question[] => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return questions.slice(startIndex, endIndex);
  };

  // Generate page numbers to display (show up to 5 page numbers)
  const getPageNumbers = (): number[] => {
    const maxVisiblePages = 5;
    const pages: number[] = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
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
  const handleHelpfulPress = (questionId: string) => {
    setHelpfulCounts(prev => ({
      ...prev,
      [questionId]: (prev[questionId] || 0) + 1,
    }));
    if (onHelpfulPress) {
      onHelpfulPress(questionId);
    }
  };

  // Get helpful count for a question
  const getHelpfulCount = (questionId: string): number => {
    return helpfulCounts[questionId] || 0;
  };

  // Toggle question expansion
  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Check if question has answer
  const hasAnswer = (question: Question): boolean => {
    return !!question.answer && question.answer.trim().length > 0;
  };

  // Check if questioner is verified buyer
  const isVerifiedBuyer = (question: Question): boolean => {
    return question.label === 'verified_buyer' || question.questioner?.name === 'ご購入者様';
  };

  // Sort options configuration
  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'date', label: getText('Date', '日付順') },
    { key: 'helpful', label: getText('Helpful', 'いいね数順') },
  ];

  const paginatedQuestions = getPaginatedQuestions();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, containerStyle]}>
      {/* Sort Buttons */}
      <View style={styles.sortContainer}>
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
                    <Text style={{ color: '#FFFFFF' }}> ↓</Text>
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
            {getText('Loading questions...', '質問を読み込み中...')}
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      {/* Questions List */}
      {!loading && !error && questions.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {getText('No questions', '質問がありません')}
          </Text>
        </View>
      )}

      {!loading && !error && questions.length > 0 && (
        <>
          <View style={styles.questionsList}>
            {paginatedQuestions.map((question) => {
              const helpfulCount = getHelpfulCount(question.id);
              const isExpanded = expandedQuestions.has(question.id);
              const hasAnswerText = hasAnswer(question);
              const isVerified = isVerifiedBuyer(question);

              return (
                <View key={question.id} style={[styles.qaItem, { borderBottomColor: colors.border }]}>
                  {/* Q&A Header */}
                  <View style={styles.qaHeader}>
                    <Text style={[styles.qaAuthor, { color: colors.text }]}>
                      {isVerified ? getText('Verified Buyer', 'ご購入者様') : question.questioner?.name || getText('Anonymous', '匿名')}
                    </Text>
                    <Text style={[styles.qaDate, { color: colors.textSecondary }]}>
                      {formatRelativeDate(question.published)}
                    </Text>
                  </View>

                  {/* Question */}
                  <View style={styles.questionContainer}>
                    <Text style={[styles.qLabel, { color: colors.primary }]}>Q</Text>
                    <Text style={[styles.questionText, { color: colors.text }]}>
                      {question.question}
                    </Text>
                  </View>

                  {/* Answer (if exists and expanded) */}
                  {hasAnswerText && (
                    <>
                      {isExpanded ? (
                        <View style={[styles.answerContainer, { backgroundColor: colors.surface }]}>
                          <Text style={[styles.aLabel, { color: '#f87171' }]}>A</Text>
                          <Text style={[styles.answerText, { color: colors.text }]}>
                            {question.answer}
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.viewAnswerButton}
                          onPress={() => toggleQuestion(question.id)}
                        >
                          <Text style={[styles.viewAnswerText, { color: colors.primary }]}>
                            {getText('View Answer', '回答を見る')}
                          </Text>
                          <Svg width={16} height={16} viewBox="0 0 24 24">
                            <Path d="M7 10l5 5 5-5z" fill={colors.primary} />
                          </Svg>
                        </TouchableOpacity>
                      )}
                    </>
                  )}

                  {/* Helpful Button */}
                  <TouchableOpacity
                    style={[styles.helpfulButton, { borderColor: colors.border }]}
                    onPress={() => handleHelpfulPress(question.id)}
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
                      {getText('Helpful', '役に立った')} {helpfulCount}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* Pagination */}
          {questions.length > 0 && totalPages > 1 && (
            <View style={styles.pagination}>
              {/* Previous Button */}
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
                  {getText('Previous', '前へ')}
                </Text>
              </TouchableOpacity>

              {/* Page Numbers */}
              <View style={styles.pageNumbersContainer}>
                {getPageNumbers().map((pageNum, index, array) => {
                  const showEllipsisBefore = index > 0 && pageNum - array[index - 1] > 1;
                  const isActive = pageNum === currentPage;

                  return (
                    <React.Fragment key={pageNum}>
                      {showEllipsisBefore && (
                        <Text style={[styles.paginationEllipsis, { color: colors.textSecondary }]}>
                          ...
                        </Text>
                      )}
                      <TouchableOpacity
                        style={[
                          styles.pageNumberButton,
                          {
                            backgroundColor: isActive ? colors.primary : 'transparent',
                            borderColor: colors.border,
                          },
                        ]}
                        onPress={() => setCurrentPage(pageNum)}
                      >
                        <Text
                          style={[
                            styles.pageNumberText,
                            {
                              color: isActive ? '#FFFFFF' : colors.text,
                              fontWeight: isActive ? '600' : '400',
                            },
                          ]}
                        >
                          {pageNum}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  );
                })}
              </View>

              {/* Page Info */}
              {totalPages > 1 && (
                <Text style={[styles.paginationInfo, { color: colors.textSecondary }]}>
                  {currentPage} / {totalPages}
                </Text>
              )}

              {/* Next Button */}
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
                    {
                      color: currentPage === totalPages ? colors.textSecondary : '#FFFFFF',
                    },
                  ]}
                >
                  {getText('Next', '次へ')}
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
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    marginLeft: 32,
    padding: 16,
    borderRadius: 8,
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

