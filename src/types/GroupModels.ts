/**
 * Group filter parameters
 */
export interface GroupFilterParams {
  from_date?: string;
  updated_date?: string;
}

/**
 * Retrieve all groups request body.
 */
export interface GetAllGroupsRequestBody {
  group?: GroupFilterParams;
}

/**
 * Group product item
 */
export interface GroupProduct {
  sku?: number;
  name?: string;
  url?: string;
}

/**
 * View group products request.
 */
export interface ViewGroupProductsRequest {
  group_name: string;
}

