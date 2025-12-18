import { HttpClient } from '../utils/HttpClient';
import { Order, OrderRequestParams } from '../types/OrderModels';
/**
 * Order API client for retrieving order information.
 * Provides methods to access order data and associated customer information.
 */
export declare class OrderAPI {
    private http;
    private apiKey;
    private accessToken;
    constructor(http: HttpClient, apiKey: string, accessToken: string);
    /**
     * Retrieves orders with optional filtering and pagination.
     *
     * @param params - Optional query parameters for filtering
     * @param params.from_id - Filter orders from this order ID
     * @param params.from_date - Filter orders from this date (YYYY-MM-DD format)
     * @param params.count - Number of orders per page
     * @param params.page - Page number
     * @param params.retrieve_reviews - Whether to include associated reviews ('1' or '0')
     * @param params.order_id - Filter by specific order ID
     * @returns Promise resolving to an array of orders
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     *
     * @example
     * ```typescript
     * const orders = await sdk.orderAPI().getOrders({
     *   count: '10',
     *   page: '1',
     *   from_date: '2024-01-01'
     * });
     * ```
     */
    getOrders(params?: OrderRequestParams): Promise<Order[]>;
}
