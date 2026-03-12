import { AxiosRequestConfig } from 'axios';
/**
 * HTTP client for making API requests to the U-KOMI API.
 * Handles request/response transformation and error handling.
 */
export declare class HttpClient {
    private client;
    /**
     * Creates a new HTTP client instance.
     * @param baseUrl - The base URL for the API
     */
    constructor(baseUrl: string);
    /**
     * Makes a GET request to the specified endpoint.
     * @param url - The endpoint URL (relative to base URL)
     * @param config - Optional Axios request configuration
     * @returns Promise resolving to the response data
     * @throws {UKomiApiException} When the API returns an error response
     * @throws {UKomiNetworkException} When a network error occurs
     */
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Makes a POST request with JSON payload.
     * @param url - The endpoint URL (relative to base URL)
     * @param data - The request payload
     * @param config - Optional Axios request configuration
     * @returns Promise resolving to the response data
     * @throws {UKomiApiException} When the API returns an error response
     * @throws {UKomiNetworkException} When a network error occurs
     */
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Makes a POST request and returns the raw response without processing.
     * Useful for endpoints that return non-standard response formats.
     * @param url - The endpoint URL (relative to base URL)
     * @param data - The request payload
     * @param config - Optional Axios request configuration
     * @returns Promise resolving to the raw response data
     * @throws {UKomiApiException} When the API returns an error response
     * @throws {UKomiNetworkException} When a network error occurs
     */
    postRaw<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Makes a POST request with multipart/form-data payload.
     * @param url - The endpoint URL (relative to base URL)
     * @param formData - The FormData object to send
     * @param config - Optional Axios request configuration
     * @returns Promise resolving to the response data
     * @throws {UKomiApiException} When the API returns an error response
     * @throws {UKomiNetworkException} When a network error occurs
     */
    postFormData<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Makes a POST request with application/x-www-form-urlencoded payload.
     * @param url - The endpoint URL (relative to base URL)
     * @param data - Key-value pairs to send as form data
     * @param config - Optional Axios request configuration
     * @returns Promise resolving to the response data
     * @throws {UKomiApiException} When the API returns an error response
     * @throws {UKomiNetworkException} When a network error occurs
     */
    postFormUrlEncoded<T>(url: string, data: Record<string, string>, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Processes API response and extracts data.
     * Handles various response formats used by the U-KOMI API.
     */
    private handleResponse;
    /**
     * Transforms errors into SDK-specific exceptions.
     */
    private handleError;
}
