/**
 * Product data model
 */
export interface Product {
  id: string;
  name: string;
  product_url: string;
  image_url: string;
  description?: string;
  short_description?: string;
  price?: string;
  review_email_priority?: string;
  review_request_email_delay?: number;
  expiration_date?: string;
  tag?: string;
  crated_at?: string;
  updated_at?: string;
  group?: string;
  sku?: string;
  condition?: string;
  availability?: string;
  brand?: string;
  upc?: string;
  mpn?: string;
  isbn?: string;
  ean?: string;
  gtin?: string;
}

/**
 * Products response wrapper
 */
export interface ProductsResponse {
  products: Product[];
}

/**
 * Product review summary
 */
export interface ProductReviewSummary {
  total_reviews?: number;
  average_ratings?: number;
}

/**
 * Product review meta
 */
export interface ProductReviewMeta {
  review_meta: string;
}

/**
 * Product request parameters
 */
export interface ProductRequestParams {
  fromId?: string;
  limit?: number;
  status?: string;
}

/**
 * Product request body
 */
export interface ProductRequestBody {
  access_token: string;
  product?: ProductRequestParams;
}

