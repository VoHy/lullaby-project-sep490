// lib/proxyRequest.js

// Nhỏ gọn retry helper với backoff tuyến tính
async function withRetry(fn, { retries = 1, delayMs = 300 }) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < retries) {
        await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
      }
    }
  }
  throw lastErr;
}

export async function proxyRequest(path, method = 'GET', options = {}) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';

  // Thiết lập timeout (mặc định 15 giây, có thể override bằng env hoặc options.timeoutMs)
  const defaultTimeoutMs = Number(process.env.NEXT_PUBLIC_FETCH_TIMEOUT_MS || 15000);
  const effectiveTimeoutMs = Number(options.timeoutMs || defaultTimeoutMs);

  const doFetch = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), effectiveTimeoutMs);

    try {
      const response = await fetch(`${backendUrl}${path}`, {
        method,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
      
          'x-proxy-backend-url': backendUrl,
        },
        ...options,
      });

      clearTimeout(timeout);

      const responseText = await response.text();

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          return {
            ok: false,
            status: response.status,
            data: {
              error: errorData.message || 'Lỗi backend',
            },
          };
        } catch {
          return {
            ok: false,
            status: response.status,
            data: {
              error: `Server error: ${response.status} - ${responseText.substring(0, 100)}`,
            },
          };
        }
      }

      const data = responseText ? JSON.parse(responseText) : null;

      return {
        ok: true,
        status: response.status,
        data,
      };
    } catch (error) {
      clearTimeout(timeout);

      // Gắn nhãn lỗi mạng/timeout rõ ràng hơn
      const isAbort = error?.name === 'AbortError' || /aborted/i.test(error?.message || '');
      const isConnRefused = /ECONNREFUSED|ENOTFOUND|EAI_AGAIN/i.test(error?.message || '');

      const status = isAbort ? 504 : isConnRefused ? 502 : 500;
      const reason = isAbort
        ? `Quá hạn (${effectiveTimeoutMs}ms) khi gọi backend`
        : isConnRefused
          ? 'Không thể kết nối tới backend (refused/not found)'
          : 'Lỗi kết nối đến backend';

  
      try {
        // eslint-disable-next-line no-console
        console.error('[proxyRequest] Error:', {
          path,
          method,
          backendUrl,
          status,
          message: error?.message,
          name: error?.name,
        });
      } catch {}

      return {
        ok: false,
        status,
        data: {
          error: `Không thể kết nối đến server: ${reason}. Chi tiết: ${error?.message || 'unknown'}`,
        },
      };
    }
  };

  // Tự động retry 1 lần cho các lỗi timeout/mạng nhẹ
  const retries = Number(process.env.NEXT_PUBLIC_FETCH_RETRIES || 1);
  return withRetry(doFetch, { retries, delayMs: 250 });
}
