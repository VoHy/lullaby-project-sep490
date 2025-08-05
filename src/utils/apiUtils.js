/**
 * Debounce function để tránh gọi API quá nhiều
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Retry function cho API calls
 */
export async function retryApiCall(apiCall, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

/**
 * Batch API calls để giảm số lượng requests
 */
export async function batchApiCalls(apiCalls, batchSize = 5) {
  const results = [];
  for (let i = 0; i < apiCalls.length; i += batchSize) {
    const batch = apiCalls.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(call => call()));
    results.push(...batchResults);
  }
  return results;
}

/**
 * Cache API responses
 */
const apiCache = new Map();

export function getCachedApiCall(key, ttl = 5 * 60 * 1000) {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  return null;
}

export function setCachedApiCall(key, data) {
  apiCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

/**
 * Optimized API call với cache và retry
 */
export async function optimizedApiCall(apiFunction, cacheKey = null, options = {}) {
  const { useCache = true, retryCount = 2, ttl = 5 * 60 * 1000 } = options;

  // Check cache
  if (useCache && cacheKey) {
    const cached = getCachedApiCall(cacheKey, ttl);
    if (cached) return cached;
  }

  // Make API call with retry
  const result = await retryApiCall(apiFunction, retryCount);
  
  // Cache result
  if (useCache && cacheKey) {
    setCachedApiCall(cacheKey, result);
  }

  return result;
} 