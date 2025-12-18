import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { UKomiApiException, UKomiNetworkException } from '../errors/UKomiException';
import { ApiResponse } from '../types/ApiResponse';

/**
 * HTTP client for making API requests to the U-KOMI API.
 * Handles authentication, request/response transformation, and error handling.
 */
export class HttpClient {
  private client: AxiosInstance;

  /**
   * Creates a new HTTP client instance.
   * @param baseUrl - The base URL for the API
   * @param accessToken - Optional access token for authenticated requests
   */
  constructor(baseUrl: string, accessToken?: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (accessToken) {
      this.setAccessToken(accessToken);
    }
  }

  /**
   * Updates the access token for authenticated requests.
   * @param accessToken - The access token to use for authentication
   */
  setAccessToken(accessToken: string): void {
    this.client.interceptors.request.clear();
    this.client.interceptors.request.use((config) => {
      if (config.params) {
        config.params.access_token = accessToken;
      } else {
        config.params = { access_token: accessToken };
      }
      return config;
    });
  }

  /**
   * Makes a GET request to the specified endpoint.
   * @param url - The endpoint URL (relative to base URL)
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to the response data
   * @throws {UKomiApiException} When the API returns an error response
   * @throws {UKomiNetworkException} When a network error occurs
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return this.handleResponse(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Makes a POST request with JSON payload.
   * @param url - The endpoint URL (relative to base URL)
   * @param data - The request payload
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to the response data
   * @throws {UKomiApiException} When the API returns an error response
   * @throws {UKomiNetworkException} When a network error occurs
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return this.handleResponse(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Makes a POST request with multipart/form-data payload.
   * @param url - The endpoint URL (relative to base URL)
   * @param formData - The FormData object to send
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to the response data
   * @throws {UKomiApiException} When the API returns an error response
   * @throws {UKomiNetworkException} When a network error occurs
   */
  async postFormData<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return this.handleResponse(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Makes a POST request with application/x-www-form-urlencoded payload.
   * @param url - The endpoint URL (relative to base URL)
   * @param data - Key-value pairs to send as form data
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to the response data
   * @throws {UKomiApiException} When the API returns an error response
   * @throws {UKomiNetworkException} When a network error occurs
   */
  async postFormUrlEncoded<T>(
    url: string,
    data: Record<string, string>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const formData = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await this.client.post<ApiResponse<T>>(
        url,
        formData.toString(),
        {
          ...config,
          headers: {
            ...config?.headers,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return this.handleResponse(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Processes API response and extracts data.
   * Handles various response formats used by the U-KOMI API.
   */
  private handleResponse<T>(response: ApiResponse<T>): T {
    const code = typeof response.code === 'string' ? parseInt(response.code, 10) : response.code;
    const status = response.status;

    if (code === 200 && status === 'OK') {
      const data = response.data ?? response.response;

      if (data !== undefined && data !== null) {
        return data;
      }

      const { data: _unusedData, response: _unusedResponse, ...rest } = response as any;
      if (rest && Object.keys(rest).length > 0) {
        return rest as T;
      }

      throw new UKomiApiException(
        code,
        'Empty response: no data/response fields and no other payload'
      );
    } else {
      const message = (response as any).message || `Unexpected response (code: ${code}, status: ${status})`;
      throw new UKomiApiException(Number(code), message);
    }
  }

  /**
   * Transforms errors into SDK-specific exceptions.
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<any>>;
      if (axiosError.response) {
        const response = axiosError.response.data;
        const responseCode = response?.code 
          ? (typeof response.code === 'string' ? parseInt(response.code, 10) : response.code)
          : axiosError.response.status;
        const message = response?.status ?? axiosError.message ?? 'Request failed';
        return new UKomiApiException(responseCode, message);
      } else if (axiosError.request) {
        return new UKomiNetworkException('Network error: No response received', error);
      }
    }
    return new UKomiNetworkException(
      error instanceof Error ? error.message : 'Unknown error',
      error instanceof Error ? error : undefined
    );
  }
}

