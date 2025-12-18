import { HttpClient } from '../utils/HttpClient';
import { Account } from '../types/AccountModels';
/**
 * Account API client for retrieving account information.
 * Provides methods to access account details and settings.
 */
export declare class AccountAPI {
    private http;
    private apiKey;
    private accessToken;
    constructor(http: HttpClient, apiKey: string, accessToken: string);
    /**
     * Retrieves basic account information including name, URL, and framework.
     *
     * @returns Promise resolving to account information
     * @throws {UKomiApiException} When the API returns an error
     * @throws {UKomiException} When a network error occurs
     *
     * @example
     * ```typescript
     * const account = await sdk.account().getAccountBasic();
     * console.log(account.name);
     * ```
     */
    getAccountBasic(): Promise<Account>;
}
