import { UKomiApiException, UKomiException } from '../errors/UKomiException';
/**
 * Group API client for managing product groups.
 * Provides methods to retrieve groups and their associated products.
 */
export class GroupAPI {
    constructor(http, apiKey, accessToken) {
        this.http = http;
        this.apiKey = apiKey;
        this.accessToken = accessToken;
    }
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
    async getAllGroups(params) {
        try {
            const groupParams = params?.fromDate || params?.updatedDate
                ? {
                    from_date: params.fromDate,
                    updated_date: params.updatedDate,
                }
                : undefined;
            const request = {
                access_token: this.accessToken,
                group: groupParams,
            };
            const response = await this.http.post(`groups/${this.apiKey}/`, request);
            return response.groups || [];
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
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
    async getGroupProducts(groupName) {
        try {
            const request = {
                access_token: this.accessToken,
                group_name: groupName,
            };
            const response = await this.http.post(`groups/${this.apiKey}/view`, request);
            return response.products || [];
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
}
