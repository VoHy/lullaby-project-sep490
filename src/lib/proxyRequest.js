// lib/proxyRequest.js

export async function proxyRequest(path, method = 'GET', options = {}) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';

  // Thiết lập timeout (mặc định 3 giây)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${backendUrl}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
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

    const data = JSON.parse(responseText);

    return {
      ok: true,
      status: response.status,
      data,
    };
  } catch (error) {
    clearTimeout(timeout);

    return {
      ok: false,
      status: 500,
      data: {
        error: `Không thể kết nối đến server: ${error.message}`,
      },
    };
  }
}
