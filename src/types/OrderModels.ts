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

/**
 * Customer order product
 */
export interface CustomerOrderProduct {
  product_id: string;
  product_name: string;
  product_url: string;
  product_image_url: string;
  token: string | null;
}

/**
 * Customer order data model
 */
export interface CustomerOrder {
  order_id: string;
  order_date: string;
  product_ids: string;
  products: CustomerOrderProduct[];
}

/**
 * Customer orders request body
 */
export interface CustomerOrdersRequestBody {
  access_token: string;
  customer_id: string;
  page: number;
  limit: number;
}

/**
 * Customer orders metadata
 */
export interface CustomerOrdersMetadata {
  total_orders: number;
  page: number;
  total_pages: number;
}

/**
 * Raw API response from customer_order endpoint
 */
export interface CustomerOrdersApiResponse {
  status: string;
  orders: CustomerOrder[];
  metadata?: CustomerOrdersMetadata;
}

/**
 * Customer orders response
 */
export interface CustomerOrdersResponse {
  orders: CustomerOrder[];
  metadata: CustomerOrdersMetadata;
}

