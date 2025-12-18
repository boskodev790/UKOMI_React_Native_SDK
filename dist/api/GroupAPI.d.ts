import { HttpClient } from '../utils/HttpClient';
import { GroupProduct } from '../types/GroupModels';
/**
 * Group API client for managing product groups.
 * Provides methods to retrieve groups and their associated products.
 */
export declare class GroupAPI {
    private http;
    private apiKey;
    private accessToken;
    constructor(http: HttpClient, apiKey: string, accessToken: string);
    /**
     * Retrieves all product groups with optional date filtering.
     *
     * @param params - Optional filter parameters
     * @param params.fromDate - Filter groups created from this date (YYYY-MM-DD format)
     * @param params.updatedDate - Filter groups updated from this date
     * @returns Promise resolving to an array of group names
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     *
     * @example
     * ```typescript
     * const groups = await sdk.groups().getAllGroups({
     *   fromDate: '2024-01-01'
     * });
     * ```
     */
    getAllGroups(params?: {
        fromDate?: string;
        updatedDate?: string;
    }): Promise<string[]>;
    /**
     * Retrieves all products belonging to a specific group.
     *
     * @param groupName - The name of the group to get products for
     * @returns Promise resolving to an array of group products
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     *
     * @example
     * ```typescript
     * const products = await sdk.groups().getGroupProducts('electronics');
     * products.forEach(p => console.log(p.name));
     * ```
     */
    getGroupProducts(groupName: string): Promise<GroupProduct[]>;
}
