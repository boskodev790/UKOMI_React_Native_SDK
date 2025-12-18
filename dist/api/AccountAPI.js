import { UKomiApiException, UKomiException } from '../errors/UKomiException';
/**
 * Account API client for retrieving account information.
 * Provides methods to access account details and settings.
 */
export class AccountAPI {
    constructor(http, apiKey, accessToken) {
        this.http = http;
        this.apiKey = apiKey;
        this.accessToken = accessToken;
    }
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
    async getAccountBasic() {
        try {
            const account = await this.http.postFormUrlEncoded(`account/${this.apiKey}/view_basic`, {
                access_token: this.accessToken,
            });
            return account;
        }
        catch (error) {
            if (error instanceof UKomiApiException) {
                throw error;
            }
            throw new UKomiException('Network error', error instanceof Error ? error : undefined);
        }
    }
}
