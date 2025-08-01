import axios from 'axios';

// Hỗ trợ cho cả browser và server-side rendering
const isBrowser = typeof window !== 'undefined';

// Đường dẫn API
// Vì API route tích hợp trong Next.js App Router là /api/...
// baseURL được để trống để request tự động sử dụng domain hiện tại 
// Backend local của bạn chạy trên port 5294
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294'; // fallback nếu chưa set env

console.log('API Base URL:', baseURL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('USE_MOCK:', process.env.NEXT_PUBLIC_USE_MOCK);

// ⚠️ HIỆN TẠI KHÔNG DÙNG AXIOS - ĐANG DÙNG FETCH VỚI PROXY
// const axiosInstance = axios.create({
//   baseURL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000, // Timeout sau 10 giây
// });

// Interceptor để thêm token xác thực vào header
// axiosInstance.interceptors.request.use(
//   (config) => {
//     if (isBrowser) {
//       const token = localStorage.getItem('token');
//       if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     console.error('Request error:', error);
//     return Promise.reject(error);
//   }
// );

// Interceptor để xử lý lỗi response
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('Response error:', error);
    
//     // Xử lý lỗi xác thực (token hết hạn)
//     if (isBrowser && error.response && error.response.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/auth/login';
//     }
    
//     // Chuẩn bị thông báo lỗi
//     let errorMessage = 'Đã xảy ra lỗi khi xử lý yêu cầu';
    
//     if (error.response) {
//       // Lỗi từ server (status code không phải 2xx)
//       errorMessage = error.response.data?.message || `Lỗi ${error.response.status}: ${error.response.statusText}`;
//     } else if (error.request) {
//       // Lỗi không nhận được response từ server
//       errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
//     }
    
//     // Attach error message
//     error.message = errorMessage;
    
//     return Promise.reject(error);
//   }
// );

// ⚠️ HIỆN TẠI KHÔNG DÙNG AXIOS - ĐANG DÙNG FETCH VỚI PROXY
// export default axiosInstance;

// Tạo một axios instance đơn giản cho các service khác có thể cần
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default axiosInstance; 