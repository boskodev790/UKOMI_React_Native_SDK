import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Linking,
  Alert,
  ViewStyle,
} from 'react-native';
import { UKomiSDK } from '../UKomiSDK';
import { WriteReviewForm } from './WriteReviewForm';

/**
 * Product item in an order
 */
export interface OrderProduct {
  product_id: string;
  product_name: string;
  product_url: string;
  product_image_url?: string;
  token: string | null;
}

/**
 * Order data model
 */
export interface OrderListItem {
  order_id: string;
  order_date: string;
  product_ids?: string;
  products: OrderProduct[];
}

/**
 * Props for the OrderList component
 */
export interface OrderListProps {
  /** The UKomiSDK instance (must be authenticated) */
  sdk: UKomiSDK;
  /** Function to fetch orders. Should return a promise with paginated order data */
  fetchOrders: (page: number, perPage: number) => Promise<{
    data: OrderListItem[];
    current_page: number;
    last_page: number;
  }>;
  /** Number of orders per page (default: 5) */
  ordersPerPage?: number;
  /** Optional: Custom style for the container */
  containerStyle?: ViewStyle;
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
  /** Optional: Callback when a product is pressed */
  onProductPress?: (productUrl: string) => void;
  /** Optional: Translations object */
  translations?: {
    orderHistory?: string;
    orderDate?: string;
    writeReview?: string;
    reviewAlreadySubmitted?: string;
    noAvailableOrders?: string;
    loadingOrders?: string;
    previous?: string;
    next?: string;
    page?: string;
    of?: string;
    noImage?: string;
  };
}

/**
 * OrderList Component
 * 
 * Displays a list of orders with products, allowing users to write reviews.
 * This component handles pagination and displays products from all orders in a flattened list.
 * 
 * @example
 * ```tsx
 * import { OrderList } from '@ukomi/react-native-sdk';
 * 
 * <OrderList 
 *   sdk={ukomiSDK} 
 *   fetchOrders={async (page, perPage) => {
 *     const response = await fetch(`/api/orders?page=${page}&per_page=${perPage}`);
 *     return response.json();
 *   }}
 * />
 * ```
 */
export const OrderList: React.FC<OrderListProps> = ({
  sdk,
  fetchOrders,
  ordersPerPage = 5,
  containerStyle,
  colors: customColors,
  showLoading = true,
  onProductPress,
  translations = {},
}) => {
  const colors = {
    background: customColors?.background || '#FFFFFF',
    text: customColors?.text || '#000000',
    textSecondary: customColors?.textSecondary || '#666666',
    primary: customColors?.primary || '#3b82f6',
    border: customColors?.border || '#e5e5e5',
    surface: customColors?.surface || '#F5F5F5',
    error: customColors?.error || '#ef4444',
  };

  const t = {
    orderHistory: translations.orderHistory || 'Order History',
    orderDate: translations.orderDate || 'Order Date',
    writeReview: translations.writeReview || 'Write a Review',
    reviewAlreadySubmitted: translations.reviewAlreadySubmitted || 'Review Already Submitted',
    noAvailableOrders: translations.noAvailableOrders || 'No available Orders',
    loadingOrders: translations.loadingOrders || 'Loading orders...',
    previous: translations.previous || 'Previous',
    next: translations.next || 'Next',
    page: translations.page || 'Page',
    of: translations.of || 'of',
    noImage: translations.noImage || 'No image',
  };

  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage]);

  const loadOrders = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetchOrders(page, ordersPerPage);
      setOrders(response.data || []);
      setCurrentPage(response.current_page || 1);
      setTotalPages(response.last_page || 1);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert(t.orderHistory, 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleProductPress = async (productUrl: string) => {
    if (onProductPress) {
      onProductPress(productUrl);
    } else {
      try {
        await Linking.openURL(productUrl);
      } catch (err) {
        console.error('Failed to open URL:', err);
        Alert.alert('Error', 'Failed to open product link');
      }
    }
  };

  const handleWriteReview = (token: string, productId: string) => {
    setSelectedToken(token);
    setSelectedProductId(productId);
  };

  const handleBackToOrderList = () => {
    setSelectedToken(null);
    setSelectedProductId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // Flatten orders to show products individually
  const productItems = orders.flatMap(order =>
    order.products.map((product, index) => ({
      product,
      order,
      key: `${order.order_id}-${product.product_id}-${index}`,
    }))
  );

  // Show WriteReviewForm if a token is selected
  if (selectedToken && selectedProductId) {
    return (
      <WriteReviewForm
        sdk={sdk}
        productId={selectedProductId}
        verificationToken={selectedToken}
        onClose={handleBackToOrderList}
        onSubmitSuccess={handleBackToOrderList}
        colors={colors}
        hideUserFields={true}
      />
    );
  }

  if (loading && showLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          {t.loadingOrders}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, containerStyle]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t.orderHistory}
      </Text>

      {productItems.length > 0 ? (
        <>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          >
            {productItems.map(({ product, order, key }) => (
              <View
                key={key}
                style={[styles.productItem, { borderBottomColor: colors.border }]}
              >
                <View style={styles.productContent}>
                  <View style={styles.productImageContainer}>
                    {product.product_image_url ? (
                      <Image
                        source={{ uri: product.product_image_url }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.placeholderImage, { backgroundColor: colors.border }]}>
                        <Text style={[styles.noImageText, { color: colors.textSecondary }]}>
                          {t.noImage}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.productDetails}>
                    <TouchableOpacity onPress={() => handleProductPress(product.product_url)}>
                      <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
                        {product.product_name}
                      </Text>
                    </TouchableOpacity>

                    <Text style={[styles.orderDateText, { color: colors.textSecondary }]}>
                      {t.orderDate}: {formatDate(order.order_date)}
                    </Text>

                    <View style={styles.productActions}>
                      <TouchableOpacity
                        style={[
                          styles.reviewButton,
                          {
                            backgroundColor: product.token ? colors.primary : colors.border,
                            opacity: product.token ? 1 : 0.5,
                          },
                        ]}
                        onPress={() =>
                          product.token && handleWriteReview(product.token, product.product_id)
                        }
                        disabled={!product.token}
                      >
                        <Text
                          style={[
                            styles.reviewButtonText,
                            {
                              color: product.token ? '#FFFFFF' : colors.textSecondary,
                            },
                          ]}
                        >
                          {product.token ? t.writeReview : t.reviewAlreadySubmitted}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {totalPages > 1 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  {
                    backgroundColor: currentPage > 1 ? colors.primary : colors.border,
                    opacity: currentPage > 1 ? 1 : 0.5,
                  },
                ]}
                onPress={handlePreviousPage}
                disabled={currentPage <= 1}
              >
                <Text
                  style={[
                    styles.paginationButtonText,
                    {
                      color: currentPage > 1 ? '#FFFFFF' : colors.textSecondary,
                    },
                  ]}
                >
                  {t.previous}
                </Text>
              </TouchableOpacity>

              <Text style={[styles.paginationInfo, { color: colors.text }]}>
                {t.page} {currentPage} {t.of} {totalPages}
              </Text>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  {
                    backgroundColor: currentPage < totalPages ? colors.primary : colors.border,
                    opacity: currentPage < totalPages ? 1 : 0.5,
                  },
                ]}
                onPress={handleNextPage}
                disabled={currentPage >= totalPages}
              >
                <Text
                  style={[
                    styles.paginationButtonText,
                    {
                      color: currentPage < totalPages ? '#FFFFFF' : colors.textSecondary,
                    },
                  ]}
                >
                  {t.next}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t.noAvailableOrders}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 16,
  },
  productItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  productContent: {
    flexDirection: 'row',
  },
  productImageContainer: {
    flexShrink: 0,
    marginRight: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 20,
  },
  orderDateText: {
    fontSize: 14,
    marginBottom: 12,
  },
  productActions: {
    marginTop: 4,
  },
  reviewButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

