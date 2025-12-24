import { HttpClient } from '../utils/HttpClient';
import { UKomiApiException, UKomiException } from '../errors/UKomiException';
import { Order, OrderRequestParams, OrderRequestBody, OrdersResponse, CustomerOrdersResponse, CustomerOrdersRequestBody } from '../types/OrderModels';

/**
 * Order API client for retrieving order information.
 * Provides methods to access order data and associated customer information.
 */
export class OrderAPI {
  constructor(
    private http: HttpClient,
    private apiKey: string,
    private accessToken: string
  ) {}

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
  async getOrders(params?: OrderRequestParams): Promise<Order[]> {
    try {
      const body: OrderRequestBody = {
        access_token: this.accessToken,
        orders: params,
      };

      const response = await this.http.post<OrdersResponse>(`orders/${this.apiKey}/`, body);
      return response.orders || [];
    } catch (error) {
      if (error instanceof UKomiApiException) {
        throw error;
      }
      throw new UKomiException('Network error', error instanceof Error ? error : undefined);
    }
  }

  /**
   * Retrieves customer orders with pagination.
   * 
   * @param customerId - The customer ID to fetch orders for
   * @param page - Page number (default: 1)
   * @param limit - Number of orders per page (default: 10)
   * @returns Promise resolving to customer orders response with metadata
   * @throws {UKomiApiException} When the API returns an error
   * @throws {UKomiException} When a network error occurs
   * 
   * @example
   * ```typescript
   * const response = await sdk.orderAPI().getCustomerOrders('customer-123', 1, 10);
   * console.log('Orders:', response.orders);
   * console.log('Total pages:', response.metadata.total_pages);
   * ```
   */
  async getCustomerOrders(
    customerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<CustomerOrdersResponse> {
    try {
      const body: CustomerOrdersRequestBody = {
        access_token: this.accessToken,
        customer_id: customerId,
        page,
        limit,
      };

      const response = await this.http.post<CustomerOrdersResponse>(
        `orders/${this.apiKey}/customer_order`,
        body
      );
      return response;
    } catch (error) {
      if (error instanceof UKomiApiException) {
        throw error;
      }
      throw new UKomiException('Network error', error instanceof Error ? error : undefined);
    }
  }
}

