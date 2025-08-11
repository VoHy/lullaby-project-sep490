// Auth service - Xử lý authentication và authorization
import { API_ENDPOINTS } from '../../config/api';
import { apiPost, getAuthToken, getAuthHeaders } from './serviceUtils';

const authService = {
  // Utility function để lấy token từ localStorage
  getAuthToken,

  // Utility function để tạo headers với token
  getAuthHeaders,

  // Đăng nhập với email/phone và password
  login: async (credentials) => {
    try {
      return await apiPost(API_ENDPOINTS.LOGIN, credentials, 'Sai thông tin đăng nhập');
    } catch (error) {
      throw new Error(error.message || 'Sai thông tin đăng nhập');
    }
  },

  // Đăng ký tài khoản customer mới
  register: async (userData) => {
    try {
      return await apiPost(`${API_ENDPOINTS.ACCOUNTS}/register/customer`, userData, 'Không thể đăng ký tài khoản');
    } catch (error) {
      throw new Error(error.message || 'Đăng ký thất bại');
    }
  },

  // Đăng nhập với Google: backend yêu cầu { fullName, email }
  loginWithGoogle: async ({ fullName, email }) => {
    try {
      return await apiPost(
        `${API_ENDPOINTS.ACCOUNTS}/login/google`,
        { fullName, email },
        'Đăng nhập Google thất bại'
      );
    } catch (error) {
      throw new Error(error.message || 'Đăng nhập Google thất bại');
    }
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      return await apiPost(`${API_ENDPOINTS.ACCOUNTS}/reset-password`, { email }, 'Gửi yêu cầu đặt lại mật khẩu thất bại');
    } catch (error) {
      throw new Error(error.message || 'Gửi yêu cầu đặt lại mật khẩu thất bại');
    }
  },

  // Đổi mật khẩu theo API mới: { emailOrPhoneNumber, oldPassword, newPassword }
  resetPassword: async ({ emailOrPhoneNumber, oldPassword, newPassword }) => {
    try {
      return await apiPost(
        `${API_ENDPOINTS.ACCOUNTS}/reset-password`,
        { emailOrPhoneNumber, oldPassword, newPassword },
        'Đặt lại mật khẩu thất bại'
      );
    } catch (error) {
      throw new Error(error.message || 'Đặt lại mật khẩu thất bại');
    }
  },

  // Đăng xuất
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};

export default authService;
