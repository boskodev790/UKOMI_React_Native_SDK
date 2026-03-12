import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image, Linking, Alert, } from 'react-native';
import { UKomiApiException, UKomiException } from '../errors/UKomiException';
import { WriteReviewForm } from './WriteReviewForm';
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
export const OrderList = ({ sdk, customerId, ordersPerPage = 5, containerStyle, colors: customColors, onProductPress, writeReviewFormProps, }) => {
    const colors = { ...defaultColors, ...customColors };
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [error, setError] = useState(null);
    const fetchOrders = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await sdk.orderAPI().getCustomerOrders(customerId, page, ordersPerPage);
            setOrders(response.orders || []);
            setCurrentPage(response.metadata.page || 1);
            setTotalPages(response.metadata.total_pages || 1);
        }
        catch (err) {
            let errorMessage = 'Failed to load orders';
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
            console.error('Error fetching orders:', err);
        }
        finally {
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
    const handleProductUrlPress = (productUrl) => {
        if (onProductPress) {
            onProductPress(productUrl);
        }
        else {
            Linking.openURL(productUrl).catch((err) => {
                console.error('Failed to open URL:', err);
                Alert.alert('Error', 'Failed to open product link');
            });
        }
    };
    const handleWriteReview = (product) => {
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
    const formatDate = (dateString) => {
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
        return (_jsxs(View, { style: styles.paginationContainer, children: [_jsx(TouchableOpacity, { style: [
                        styles.paginationButton,
                        {
                            backgroundColor: currentPage === 1 ? colors.border : colors.primary,
                            borderColor: colors.border,
                        },
                    ], onPress: handlePreviousPage, disabled: currentPage === 1, children: _jsx(Text, { style: [
                            styles.paginationButtonText,
                            {
                                color: currentPage === 1 ? colors.textSecondary : '#FFFFFF',
                            },
                        ], children: "Previous" }) }), _jsx(View, { style: [
                        styles.pageInfo,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ], children: _jsxs(Text, { style: [styles.pageText, { color: colors.text }], children: ["Page ", currentPage, " / ", totalPages] }) }), _jsx(TouchableOpacity, { style: [
                        styles.paginationButton,
                        {
                            backgroundColor: currentPage === totalPages ? colors.border : colors.primary,
                            borderColor: colors.border,
                        },
                    ], onPress: handleNextPage, disabled: currentPage === totalPages, children: _jsx(Text, { style: [
                            styles.paginationButtonText,
                            {
                                color: currentPage === totalPages ? colors.textSecondary : '#FFFFFF',
                            },
                        ], children: "Next" }) })] }));
    };
    // Render individual product items
    const renderProductItem = (product, order, index) => (_jsx(View, { style: [styles.productItem, { borderBottomColor: colors.border }], children: _jsxs(View, { style: styles.productContent, children: [_jsx(View, { style: styles.productImageContainer, children: product.product_image_url ? (_jsx(Image, { source: { uri: product.product_image_url }, style: styles.productImage, resizeMode: "cover" })) : (_jsx(View, { style: [
                            styles.placeholderImage,
                            { backgroundColor: colors.border },
                        ], children: _jsx(Text, { style: [styles.noImageText, { color: colors.textSecondary }], children: "No image" }) })) }), _jsxs(View, { style: styles.productDetails, children: [_jsx(TouchableOpacity, { onPress: () => handleProductUrlPress(product.product_url), children: _jsx(Text, { style: [styles.productName, { color: colors.text }], numberOfLines: 2, children: product.product_name }) }), _jsxs(Text, { style: [styles.orderDateText, { color: colors.textSecondary }], children: ["Order Date: ", formatDate(order.order_date)] }), _jsx(View, { style: styles.productActions, children: _jsx(TouchableOpacity, { style: [
                                    styles.reviewButton,
                                    {
                                        backgroundColor: product.token ? colors.primary : colors.border,
                                        opacity: product.token ? 1 : 0.5,
                                    },
                                ], onPress: () => product.token && handleWriteReview(product), disabled: !product.token, children: _jsx(Text, { style: [
                                        styles.reviewButtonText,
                                        {
                                            color: product.token ? '#FFFFFF' : colors.textSecondary,
                                        },
                                    ], children: product.token ? 'Write a Review' : 'Review Already Submitted' }) }) })] })] }) }, `${order.order_id}-${product.product_id}-${index}`));
    if (loading) {
        return (_jsxs(View, { style: [
                styles.loadingContainer,
                containerStyle,
                { backgroundColor: colors.background },
            ], children: [_jsx(ActivityIndicator, { size: "large", color: colors.primary }), _jsx(Text, { style: [styles.loadingText, { color: colors.textSecondary }], children: "Loading orders..." })] }));
    }
    if (error) {
        return (_jsxs(View, { style: [
                styles.errorContainer,
                containerStyle,
                { backgroundColor: colors.background },
            ], children: [_jsx(Text, { style: [styles.errorText, { color: colors.error }], children: error }), _jsx(TouchableOpacity, { style: [styles.retryButton, { backgroundColor: colors.primary }], onPress: () => fetchOrders(currentPage), children: _jsx(Text, { style: styles.retryButtonText, children: "Retry" }) })] }));
    }
    // Show WriteReviewForm if a product is selected
    if (selectedProduct) {
        return (_jsxs(View, { style: [
                styles.container,
                containerStyle,
                { backgroundColor: colors.background },
            ], children: [_jsx(TouchableOpacity, { style: styles.backButton, onPress: handleBackToOrderHistory, children: _jsx(Text, { style: [styles.backButtonText, { color: colors.primary }], children: "\u2190 Back to Order History" }) }), _jsx(WriteReviewForm, { sdk: sdk, productId: selectedProduct.productId, onClose: handleBackToOrderHistory, onSubmitSuccess: handleBackToOrderHistory, colors: colors, ...writeReviewFormProps })] }));
    }
    // Flatten orders to show products individually
    const productItems = orders.flatMap((order) => order.products.map((product) => ({ product, order })));
    return (_jsxs(View, { style: [
            styles.container,
            containerStyle,
            { backgroundColor: colors.background },
        ], children: [_jsx(Text, { style: [styles.sectionTitle, { color: colors.text }], children: "Order History" }), productItems.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(ScrollView, { style: styles.scrollView, showsVerticalScrollIndicator: false, contentContainerStyle: styles.listContainer, children: productItems.map(({ product, order }, index) => renderProductItem(product, order, index)) }), renderPagination()] })) : (_jsx(View, { style: styles.emptyContainer, children: _jsx(Text, { style: [styles.emptyText, { color: colors.textSecondary }], children: "No available Orders" }) }))] }));
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
