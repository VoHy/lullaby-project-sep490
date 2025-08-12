// Service Utils - Common utilities for all API services
import { API_BASE_URL } from '../../config/api';

/**
 * Utility function để tạo full URL từ endpoint
 * @param {string} endpoint - API endpoint
 * @returns {string} Full API URL
 */
export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * Utility function để lấy token từ localStorage
 * @returns {string|null} JWT token hoặc null nếu không có
 */
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Utility function để tạo headers với token
 * @returns {object} Headers object với Content-Type và Authorization
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Generic error handler cho API responses
 * @param {Response} response - Fetch response object
 * @param {string} defaultMessage - Default error message
 * @returns {Promise<any>} Parsed JSON data hoặc throw error
 */
export const handleApiResponse = async (response, defaultMessage = 'API request failed') => {
  const text = await response.text();
  if (!response.ok) {
    const data = text ? (() => { try { return JSON.parse(text); } catch { return { raw: text }; } })() : null;
    const message = data?.error || data?.message || data?.raw || defaultMessage;
    throw new Error(message);
  }
  // Nếu là string và bắt đầu bằng https://, trả về nguyên text, không parse JSON
  if (text && typeof text === 'string' && text.trim().startsWith('https://')) {
    return text.trim();
  }
  // Nếu không phải URL, thử parse JSON
  const data = text ? (() => { try { return JSON.parse(text); } catch { return { raw: text }; } })() : null;
  return data;
};

// Simple in-memory GET cache with TTL and in-flight deduplication
const GET_CACHE = new Map(); // key: url, value: { at: number, data: any }
const INFLIGHT = new Map(); // key: url, value: Promise
const DEFAULT_GET_TTL_MS = Number(process.env.NEXT_PUBLIC_API_GET_CACHE_TTL_MS || 60_000);

const isFresh = (entry, ttlMs) => entry && (Date.now() - entry.at) < ttlMs;

export const invalidateAllGetCache = () => {
  GET_CACHE.clear();
};

/**
 * Generic GET request
 * @param {string} endpoint - API endpoint (relative path)
 * @param {string} errorMessage - Custom error message
 * @returns {Promise<any>} API response data
 */
export const apiGet = async (endpoint, errorMessage = 'Không thể lấy dữ liệu', options = {}) => {
  const url = createApiUrl(endpoint);
  const { cache = true, ttlMs = DEFAULT_GET_TTL_MS } = options || {};

  if (cache) {
    const cached = GET_CACHE.get(url);
    if (isFresh(cached, ttlMs)) {
      return cached.data;
    }
    const running = INFLIGHT.get(url);
    if (running) return running;
  }

  const promise = (async () => {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleApiResponse(response, errorMessage);
    if (cache) {
      GET_CACHE.set(url, { at: Date.now(), data });
    }
    INFLIGHT.delete(url);
    return data;
  })();

  if (cache) INFLIGHT.set(url, promise);
  return promise;
};

/**
 * Generic POST request
 * @param {string} endpoint - API endpoint (relative path)
 * @param {object} data - Request body data
 * @param {string} errorMessage - Custom error message
 * @returns {Promise<any>} API response data
 */
export const apiPost = async (endpoint, data, errorMessage = 'Không thể tạo dữ liệu') => {
  const url = createApiUrl(endpoint);
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  const result = await handleApiResponse(response, errorMessage);
  invalidateAllGetCache();
  return result;
};

/**
 * Generic PUT request
 * @param {string} endpoint - API endpoint (relative path)
 * @param {object} data - Request body data
 * @param {string} errorMessage - Custom error message
 * @returns {Promise<any>} API response data
 */
export const apiPut = async (endpoint, data, errorMessage = 'Không thể cập nhật dữ liệu') => {
  const url = createApiUrl(endpoint);
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  const result = await handleApiResponse(response, errorMessage);
  invalidateAllGetCache();
  return result;
};

/**
 * Generic DELETE request
 * @param {string} endpoint - API endpoint (relative path)
 * @param {string} errorMessage - Custom error message
 * @returns {Promise<any>} API response data
 */
export const apiDelete = async (endpoint, errorMessage = 'Không thể xóa dữ liệu') => {
  const url = createApiUrl(endpoint);
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const result = await handleApiResponse(response, errorMessage);
  invalidateAllGetCache();
  return result;
};
