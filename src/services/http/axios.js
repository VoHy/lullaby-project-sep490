import axios from 'axios';

// Hỗ trợ cho cả browser và server-side rendering
const isBrowser = typeof window !== 'undefined';

// Đường dẫn API
// Vì API route tích hợp trong Next.js App Router là /api/...
// baseURL được để trống để request tự động sử dụng domain hiện tại 
const baseURL = '';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout sau 10 giây
});

// Interceptor để thêm token xác thực vào header
axiosInstance.interceptors.request.use(
  (config) => {
    if (isBrowser) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    
    // Xử lý lỗi xác thực (token hết hạn)
    if (isBrowser && error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    
    // Chuẩn bị thông báo lỗi
    let errorMessage = 'Đã xảy ra lỗi khi xử lý yêu cầu';
    
    if (error.response) {
      // Lỗi từ server (status code không phải 2xx)
      errorMessage = error.response.data?.message || `Lỗi ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      // Lỗi không nhận được response từ server
      errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
    }
    
    // Attach error message
    error.message = errorMessage;
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 