import axios from 'axios';
import { UKomiApiException, UKomiNetworkException } from '../errors/UKomiException';
/**
 * HTTP client for making API requests to the U-KOMI API.
 * Handles request/response transformation and error handling.
 */
export class HttpClient {
    /**
     * Creates a new HTTP client instance.
     * @param baseUrl - The base URL for the API
     */
    constructor(baseUrl) {
        this.client = axios.create({
            baseURL: baseUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
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
    async get(url, config) {
        try {
            const response = await this.client.get(url, config);
            return this.handleResponse(response.data);
        }
        catch (error) {
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
    async post(url, data, config) {
        try {
            const response = await this.client.post(url, data, config);
            return this.handleResponse(response.data);
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
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
    async postRaw(url, data, config) {
        try {
            const response = await this.client.post(url, data, config);
            if (response.status >= 200 && response.status < 300) {
                return response.data;
            }
            throw new UKomiApiException(response.status, `Request failed with status ${response.status}`);
        }
        catch (error) {
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
    async postFormData(url, formData, config) {
        try {
            const response = await this.client.post(url, formData, {
                ...config,
                headers: {
                    ...config?.headers,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return this.handleResponse(response.data);
        }
        catch (error) {
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
    async postFormUrlEncoded(url, data, config) {
        try {
            const formData = new URLSearchParams();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });
            const response = await this.client.post(url, formData.toString(), {
                ...config,
                headers: {
                    ...config?.headers,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return this.handleResponse(response.data);
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    /**
     * Processes API response and extracts data.
     * Handles various response formats used by the U-KOMI API.
     */
    handleResponse(response) {
        const code = typeof response.code === 'string' ? parseInt(response.code, 10) : response.code;
        const status = response.status;
        if (code === 200 && status === 'OK') {
            const data = response.data ?? response.response;
            if (data !== undefined && data !== null) {
                return data;
            }
            const { data: _unusedData, response: _unusedResponse, ...rest } = response;
            if (rest && Object.keys(rest).length > 0) {
                return rest;
            }
            throw new UKomiApiException(code, 'Empty response: no data/response fields and no other payload');
        }
        else {
            const message = response.message || `Unexpected response (code: ${code}, status: ${status})`;
            throw new UKomiApiException(Number(code), message);
        }
    }
    /**
     * Transforms errors into SDK-specific exceptions.
     */
    handleError(error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error;
            if (axiosError.response) {
                const response = axiosError.response.data;
                const responseCode = response?.code
                    ? (typeof response.code === 'string' ? parseInt(response.code, 10) : response.code)
                    : axiosError.response.status;
                const message = response?.status ?? axiosError.message ?? 'Request failed';
                return new UKomiApiException(responseCode, message);
            }
            else if (axiosError.request) {
                return new UKomiNetworkException('Network error: No response received', error);
            }
        }
        return new UKomiNetworkException(error instanceof Error ? error.message : 'Unknown error', error instanceof Error ? error : undefined);
    }
}
