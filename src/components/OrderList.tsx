import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  ViewStyle,
} from 'react-native';
import { UKomiSDK } from '../UKomiSDK';
import { UKomiApiException, UKomiException } from '../errors/UKomiException';
import { CustomerOrder, CustomerOrderProduct } from '../types/OrderModels';
import { WriteReviewForm, WriteReviewFormProps } from './WriteReviewForm';

/**
 * Props for the OrderList component
 */
export interface OrderListProps {
  /** The UKomiSDK instance (must be authenticated) */
  sdk: UKomiSDK;
  /** The customer ID to fetch orders for */
  customerId: string;
  /** Number of orders per page (default: 5) */
  ordersPerPage?: number;
  /** Optional: Custom style for the container */
  containerStyle?: ViewStyle;
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
  /** Optional: Callback when a product URL is pressed */
  onProductPress?: (productUrl: string) => void;
  /** Optional: Custom WriteReviewForm props to override defaults */
  writeReviewFormProps?: Partial<WriteReviewFormProps>;
}

// Default colors (dark theme)
const defaultColors = {
  background: '#1a1a1a',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  primary: '#3b82f6',
  border: '#333333',
  surface: '#2a2a2a',
  error: '#ef4444',
};

/**
 * OrderList Component
 * 
 * Displays a list of customer orders with products, allowing users to write reviews.
 * Integrates with WriteReviewForm from the SDK for review submission.
 * 
 * Features:
 * - Fetches orders using U-KOMI API directly
 * - Built-in pagination
 * - Product images and details
 * - Write review functionality
 * - Customizable theming
 * 
 * @example
 * ```tsx
 * import { OrderList } from '@ukomi/react-native-sdk';
 * 
 * <OrderList 
 *   sdk={ukomiSDK} 
 *   customerId="customer-123"
 *   ordersPerPage={5}
 * />
 * ```
 */
export const OrderList: React.FC<OrderListProps> = ({
  sdk,
  customerId,
  ordersPerPage = 5,
  containerStyle,
  colors: customColors,
  onProductPress,
  writeReviewFormProps,
}) => {
  const colors = { ...defaultColors, ...customColors };

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: string;
    token: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await sdk.orderAPI().getCustomerOrders(customerId, page, ordersPerPage);
      setOrders(response.orders || []);
      setCurrentPage(response.metadata.page || 1);
      setTotalPages(response.metadata.total_pages || 1);
    } catch (err) {
      let errorMessage = 'Failed to load orders';
      if (err instanceof UKomiApiException) {
        errorMessage = err.message || errorMessage;
      } else if (err instanceof UKomiException) {
        errorMessage = err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchOrders(currentPage);
    }
  }, [customerId, currentPage]);

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

  const handleProductUrlPress = (productUrl: string) => {
    if (onProductPress) {
      onProductPress(productUrl);
    } else {
      Linking.openURL(productUrl).catch((err) => {
        console.error('Failed to open URL:', err);
        Alert.alert('Error', 'Failed to open product link');
      });
    }
  };

  const handleWriteReview = (product: CustomerOrderProduct) => {
    if (product.token) {
      setSelectedProduct({
        productId: product.product_id,
        token: product.token,
      });
    }
  };

  const handleBackToOrderHistory = () => {
    setSelectedProduct(null);
    // Refresh orders after review submission
    fetchOrders(currentPage);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            {
              backgroundColor: currentPage === 1 ? colors.border : colors.primary,
              borderColor: colors.border,
            },
          ]}
          onPress={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <Text
            style={[
              styles.paginationButtonText,
              {
                color: currentPage === 1 ? colors.textSecondary : '#FFFFFF',
              },
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.pageInfo,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.pageText, { color: colors.text }]}>
            Page {currentPage} / {totalPages}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.paginationButton,
            {
              backgroundColor:
                currentPage === totalPages ? colors.border : colors.primary,
              borderColor: colors.border,
            },
          ]}
          onPress={handleNextPage}
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
            Next
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render individual product items
  const renderProductItem = (
    product: CustomerOrderProduct,
    order: CustomerOrder,
    index: number
  ) => (
    <View
      key={`${order.order_id}-${product.product_id}-${index}`}
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
            <View
              style={[
                styles.placeholderImage,
                { backgroundColor: colors.border },
              ]}
            >
              <Text style={[styles.noImageText, { color: colors.textSecondary }]}>
                No image
              </Text>
            </View>
          )}
        </View>

        <View style={styles.productDetails}>
          <TouchableOpacity
            onPress={() => handleProductUrlPress(product.product_url)}
          >
            <Text
              style={[styles.productName, { color: colors.text }]}
              numberOfLines={2}
            >
              {product.product_name}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.orderDateText, { color: colors.textSecondary }]}>
            Order Date: {formatDate(order.order_date)}
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
              onPress={() => product.token && handleWriteReview(product)}
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
                {product.token ? 'Write a Review' : 'Review Already Submitted'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          containerStyle,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading orders...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.errorContainer,
          containerStyle,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={() => fetchOrders(currentPage)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show WriteReviewForm if a product is selected
  if (selectedProduct) {
    return (
      <View
        style={[
          styles.container,
          containerStyle,
          { backgroundColor: colors.background },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToOrderHistory}
        >
          <Text style={[styles.backButtonText, { color: colors.primary }]}>
            ← Back to Order History
          </Text>
        </TouchableOpacity>
        <WriteReviewForm
          sdk={sdk}
          productId={selectedProduct.productId}
          onClose={handleBackToOrderHistory}
          onSubmitSuccess={handleBackToOrderHistory}
          colors={colors}
          {...writeReviewFormProps}
        />
      </View>
    );
  }

  // Flatten orders to show products individually
  const productItems = orders.flatMap((order) =>
    order.products.map((product) => ({ product, order }))
  );

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Order History</Text>

      {productItems.length > 0 ? (
        <>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          >
            {productItems.map(({ product, order }, index) =>
              renderProductItem(product, order, index)
            )}
          </ScrollView>
          {renderPagination()}
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No available Orders
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
    gap: 16,
  },
  productImageContainer: {
    flexShrink: 0,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 8,
  },
  reviewButtonText: {
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  paginationButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  paginationButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pageInfo: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  pageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

