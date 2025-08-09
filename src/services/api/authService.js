// Auth service - Xử lý authentication và authorization
const authService = {
  // Utility function để lấy token từ localStorage
  getAuthToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  // Utility function để tạo headers với token
  getAuthHeaders: () => {
    const token = authService.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  },

  // Đăng nhập với email/phone và password
  login: async (credentials) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Sai thông tin đăng nhập');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Sai thông tin đăng nhập');
    }
  },

  // Đăng ký tài khoản customer mới
  register: async (userData) => {
    try {
      const response = await fetch('/api/accounts/register/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Đăng ký thất bại');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Đăng ký thất bại');
    }
  },

  // Đăng nhập với Google
  loginWithGoogle: async (googleToken) => {
    try {
      const response = await fetch('/api/accounts/login/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Đăng nhập Google thất bại');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Đăng nhập Google thất bại');
    }
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      const response = await fetch('/api/accounts/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gửi yêu cầu đặt lại mật khẩu thất bại');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Gửi yêu cầu đặt lại mật khẩu thất bại');
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
