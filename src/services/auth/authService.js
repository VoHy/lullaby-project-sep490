import axiosInstance from '../http/axios';

const AUTH_ENDPOINTS = {
  LOGIN: '/api/accounts/login',
  REGISTER_NURSING_SPECIALIST: '/api/accounts/register/nursing-specialist',
  REGISTER_MANAGER: '/api/accounts/register/manager',
  REGISTER_RELATIVE: '/api/accounts/register/relative', 
  GET: '/api/accounts/get', // dùng cho get/{id}
  GET_ALL: '/api/accounts/getall',
  UPDATE: '/api/accounts/update', // dùng cho update/{id}
  REMOVE: '/api/accounts/remove', // dùng cho remove/{id}
  DELETE: '/api/accounts/delete', // dùng cho delete/{id}
};

// Hỗ trợ cho cả browser và server-side rendering
const isBrowser = typeof window !== 'undefined';

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      // Validation
      if (!credentials.emailOrPhoneNumber || !credentials.password) {
        throw new Error('Email/SĐT và mật khẩu là bắt buộc');
      }

      const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, {
        emailOrPhoneNumber: credentials.emailOrPhoneNumber,
        password: credentials.password,
      });
      
      if (isBrowser && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Đăng nhập thất bại';
      throw new Error(message);
    }
  },

  // Đăng nhập với Google
  loginWithGoogle: async (token) => {
    try {
      if (!token) {
        throw new Error('Token Google là bắt buộc');
      }

      const response = await axiosInstance.post(AUTH_ENDPOINTS.GOOGLE_LOGIN, { token });
      
      if (isBrowser && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      const message = error.response?.data?.message || error.message || 'Đăng nhập Google thất bại';
      throw new Error(message);
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      // Validation
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('Email, mật khẩu và tên là bắt buộc');
      }
      
      if (!validateEmail(userData.email)) {
        throw new Error('Email không hợp lệ');
      }
      
      if (!validatePassword(userData.password)) {
        throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
      }

      const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, userData);
      
      // Tự động đăng nhập sau khi đăng ký
      if (isBrowser && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      const message = error.response?.data?.message || error.message || 'Đăng ký thất bại';
      throw new Error(message);
    }
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      if (!email) {
        throw new Error('Email là bắt buộc');
      }
      
      if (!validateEmail(email)) {
        throw new Error('Email không hợp lệ');
      }

      const response = await axiosInstance.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      const message = error.response?.data?.message || error.message || 'Gửi email khôi phục thất bại';
      throw new Error(message);
    }
  },

  // Thay đổi mật khẩu
  changePassword: async (passwordData) => {
    try {
      if (!passwordData.oldPassword || !passwordData.newPassword) {
        throw new Error('Mật khẩu cũ và mới là bắt buộc');
      }
      
      if (!validatePassword(passwordData.newPassword)) {
        throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
      }

      const response = await axiosInstance.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, passwordData);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      const message = error.response?.data?.message || error.message || 'Thay đổi mật khẩu thất bại';
      throw new Error(message);
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      // Không cần gọi API logout, chỉ xóa localStorage
    } finally {
      if (isBrowser) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
      }
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      if (!isBrowser) return null;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Không có refresh token');
      }

      const response = await axiosInstance.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { 
        refreshToken 
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Refresh token error:', error);
      // Nếu refresh token fail, logout user
      authService.logout();
      throw error;
    }
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
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Lấy token hiện tại
  getToken: () => {
    if (!isBrowser) return null;
    return localStorage.getItem('token');
  },

  // Cập nhật thông tin người dùng hiện tại
  updateCurrentUser: (userData) => {
    if (!isBrowser) return;
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  },

  // Xác minh email
  verifyEmail: async (token) => {
    try {
      if (!token) {
        throw new Error('Token xác minh là bắt buộc');
      }

      const response = await axiosInstance.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
      return response.data;
    } catch (error) {
      console.error('Verify email error:', error);
      const message = error.response?.data?.message || error.message || 'Xác minh email thất bại';
      throw new Error(message);
    }
  },
};

export default authService; 