import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook để fetch data với caching
 * @param {Function} fetchFunction - Function để fetch data
 * @param {string} cacheKey - Key để lưu cache
 * @param {number} cacheTime - Thời gian cache (ms), default 5 phút
 * @param {Array} dependencies - Dependencies để trigger refetch
 */
export function useDataWithCache(fetchFunction, cacheKey, cacheTime = 5 * 60 * 1000, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      // Kiểm tra cache
      if (!forceRefresh) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          const now = Date.now();
          if (now - timestamp < cacheTime) {
            setData(cachedData);
            setLoading(false);
            return;
          }
        }
      }

      setLoading(true);
      setError(null);
      
      const result = await fetchFunction();
      
      // Lưu vào cache
      localStorage.setItem(cacheKey, JSON.stringify({
        data: result,
        timestamp: Date.now()
      }));
      
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, cacheKey, cacheTime]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return { data, loading, error, refresh };
}

/**
 * Hook để clear cache
 */
export function useClearCache() {
  return useCallback((pattern = null) => {
    if (pattern) {
      // Clear cache theo pattern
      Object.keys(localStorage).forEach(key => {
        if (key.includes(pattern)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      // Clear tất cả cache
      Object.keys(localStorage).forEach(key => {
        if (key.includes('Cache')) {
          localStorage.removeItem(key);
        }
      });
    }
  }, []);
} 