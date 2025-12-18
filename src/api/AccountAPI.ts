import { HttpClient } from '../utils/HttpClient';
import { UKomiApiException, UKomiException } from '../errors/UKomiException';
import { Account } from '../types/AccountModels';

/**
 * Account API client for retrieving account information.
 * Provides methods to access account details and settings.
 */
export class AccountAPI {
  constructor(
    private http: HttpClient,
    private apiKey: string,
    private accessToken: string
  ) {}

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
  async getAccountBasic(): Promise<Account> {
    try {
      const account = await this.http.postFormUrlEncoded<Account>(
        `account/${this.apiKey}/view_basic`,
        {
          access_token: this.accessToken,
        }
      );
      return account;
    } catch (error) {
      if (error instanceof UKomiApiException) {
        throw error;
      }
      throw new UKomiException('Network error', error instanceof Error ? error : undefined);
    }
  }
}

