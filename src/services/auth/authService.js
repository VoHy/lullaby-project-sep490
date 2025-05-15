import axiosInstance from '../http/axios';

const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  GOOGLE_LOGIN: '/api/auth/google',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  CHANGE_PASSWORD: '/api/auth/change-password',
  LOGOUT: '/api/auth/logout',
  VERIFY_EMAIL: '/api/auth/verify-email',
};

// Hỗ trợ cho cả browser và server-side rendering
const isBrowser = typeof window !== 'undefined';

export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials);
      if (isBrowser && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Đăng nhập với Google
  loginWithGoogle: async (token) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.GOOGLE_LOGIN, { token });
      if (isBrowser && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, userData);
      // Tự động đăng nhập sau khi đăng ký
      if (isBrowser && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Thay đổi mật khẩu
  changePassword: async (passwordData) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, passwordData);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  // Đăng xuất
  logout: () => {
    if (isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    // Bạn có thể gọi endpoint logout nếu cần
    // return axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
  },

  // Kiểm tra người dùng đã đăng nhập
  isAuthenticated: () => {
    if (!isBrowser) return false;
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser: () => {
    if (!isBrowser) return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Xác minh email
  verifyEmail: async (token) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
      return response.data;
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  },
};

export default authService; 