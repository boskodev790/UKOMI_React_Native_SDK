/**
 * Order item
 */
export interface OrderItem {
  productId: string;
  productName?: string;
  quantity?: number;
  price?: string;
  sku?: string;
}

/**
 * Order data model
 */
export interface Order {
  id?: string;
  orderId: string;
  customerId?: string;
  customerEmail?: string;
  customerName?: string;
  status?: string;
  totalAmount?: string;
  currency?: string;
  orderDate?: string;
  items?: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Orders response wrapper
 */
export interface OrdersResponse {
  orders?: Order[];
}

/**
 * Order request parameters
 */
export interface OrderRequestParams {
  from_id?: string;
  from_date?: string;
  count?: string;
  page?: string;
  retrieve_reviews?: string;
  order_id?: string;
}

/**
 * Order request body
 */
export interface OrderRequestBody {
  access_token: string;
  orders?: OrderRequestParams;
}

