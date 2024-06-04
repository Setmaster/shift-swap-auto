import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {getTokenWorkaround} from "@/lib/actions/authActions";

const baseUrl = process.env.API_URL;

/**
 * Retrieves headers for the request, including the authorization token if available.
 */
async function getHeaders() {
    const token = await getTokenWorkaround();
    const headers: any = {'Content-type': 'application/json'};

    if (token) {
        headers.Authorization = 'Bearer ' + token.access_token;
    }
    return headers;
}

/**
 * Handles successful responses from axios requests.
 * @param {AxiosResponse} response - The response object from axios.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
 */
async function handleResponse(response: AxiosResponse, method: string) {
    if (method === 'GET') {
        return response.data;
    }
    if (method === 'POST') {
        return {message: response.statusText, id: response.data.id};
    } else {
        return response.statusText;
    }
}

/**
 * Handles errors from axios requests by extracting and returning a formatted error object.
 * @param {any} error - The error object from axios.
 * @returns {Object} Formatted error object containing status and message.
 */
async function handleError(error: any) {
    const response = error.response;
    const message = response?.data?.errors || response?.data || response?.statusText || "An error occurred";
    return {errors: [{error: {status: response?.status, message}}]};
}

/**
 * Makes an HTTP request using axios with the specified method, url, and body.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
 * @param {string} url - The endpoint URL.
 * @param {Object} [body] - The request payload for POST and PUT methods.
 */
async function request(method: string, url: string, body?: {}) {
    const headers = await getHeaders();
    const requestOptions: AxiosRequestConfig = {
        method,
        url: baseUrl + url,
        headers,
        data: body,
    };

    try {
        const response: AxiosResponse = await axios(requestOptions);
        return handleResponse(response, method);
    } catch (error: any) {
        return handleError(error);
    }
}

// Exporting fetchWrapper object with methods to make HTTP requests.
export const fetchWrapper = {
    get: (url: string) => request('GET', url),
    post: (url: string, body: {}) => request('POST', url, body),
    put: (url: string, body: {}) => request('PUT', url, body),
    delete: (url: string) => request('DELETE', url),
};
