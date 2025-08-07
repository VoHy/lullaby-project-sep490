// Service Utils - Common utilities for all API services

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
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || defaultMessage);
  }
  return data;
};

/**
 * Generic GET request
 * @param {string} url - API endpoint URL
 * @param {string} errorMessage - Custom error message
 * @returns {Promise<any>} API response data
 */
export const apiGet = async (url, errorMessage = 'Không thể lấy dữ liệu') => {
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleApiResponse(response, errorMessage);
};

/**
 * Generic POST request
 * @param {string} url - API endpoint URL
 * @param {object} data - Request body data
 * @param {string} errorMessage - Custom error message
 * @returns {Promise<any>} API response data
 */
export const apiPost = async (url, data, errorMessage = 'Không thể tạo dữ liệu') => {
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(response, errorMessage);
};

/**
 * Generic PUT request
 * @param {string} url - API endpoint URL
 * @param {object} data - Request body data
 * @param {string} errorMessage - Custom error message
 * @returns {Promise<any>} API response data
 */
export const apiPut = async (url, data, errorMessage = 'Không thể cập nhật dữ liệu') => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(response, errorMessage);
};

/**
 * Generic DELETE request
 * @param {string} url - API endpoint URL
 * @param {string} errorMessage - Custom error message
 * @returns {Promise<any>} API response data
 */
export const apiDelete = async (url, errorMessage = 'Không thể xóa dữ liệu') => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleApiResponse(response, errorMessage);
};
