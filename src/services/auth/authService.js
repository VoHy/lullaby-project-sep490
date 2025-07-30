import accounts from '../../mock/Account';
import axiosInstance from '../http/axios';

const isBrowser = typeof window !== 'undefined';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const authService = {
  login: async (credentials) => {
    if (USE_MOCK) {
      const user = accounts.find(
        acc => (acc.email === credentials.emailOrPhoneNumber || acc.phone_number === credentials.emailOrPhoneNumber) &&
          (acc.password === credentials.password || credentials.password === 'password') // Allow simple password for testing
      );
      if (!user) throw new Error('Sai thông tin đăng nhập');
      if (isBrowser) {
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(user));
      }
      return Promise.resolve({ token: 'mock-token', user });
    }

    // Sử dụng API thật
    try {
      console.log('Sending login request to:', '/api/login');
      console.log('Request data:', {
        emailOrPhoneNumber: credentials.emailOrPhoneNumber,
        password: credentials.password
      });

      // Sử dụng proxy để bypass CORS
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrPhoneNumber: credentials.emailOrPhoneNumber,
          password: credentials.password
        })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Sai thông tin đăng nhập');
      }

      const { token, account } = data;
      if (isBrowser) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(account));
      }
      return { token, account };
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      throw new Error(error.message || 'Sai thông tin đăng nhập');
    }
  },

  register: async (userData) => {
    if (USE_MOCK) {
      if (!userData.fullName || !userData.phoneNumber || !userData.email || !userData.password) {
        throw new Error('Họ tên, số điện thoại, email và mật khẩu là bắt buộc');
      }
      // Giả lập đăng ký thành công
      const newAccount = {
        accountID: accounts.length + 1,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        password: userData.password,
        avatarUrl: userData.avatarUrl || '',
        createAt: new Date().toISOString(),
        status: 'active',
        roleID: userData.role_id || 4, // Default to Customer (4)
        deletedAt: null
      };
      if (isBrowser) {
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(newAccount));
      }
      return Promise.resolve({ token: 'mock-token', account: newAccount });
    }

    // Sử dụng API thật
    try {
      if (!userData.fullName || !userData.phoneNumber || !userData.email || !userData.password) {
        throw new Error('Họ tên, số điện thoại, email và mật khẩu là bắt buộc');
      }

      console.log('Sending registration request to:', '/api/accounts/register/customer');
      console.log('Request data:', {
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        password: userData.password,
        avatarUrl: userData.avatarUrl || ''
      });

      // Sử dụng proxy để bypass CORS
      const response = await fetch('/api/accounts/register/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          email: userData.email,
          password: userData.password,
          avatarUrl: userData.avatarUrl || ''
        })
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Đăng ký thất bại');
      }

      const { account } = data;

      // Lưu thông tin đăng nhập
      if (isBrowser) {
        localStorage.setItem('token', 'temp-token'); // Có thể cần token từ response
        localStorage.setItem('user', JSON.stringify(account));
      }

      // Trả về response với account thay vì user để phù hợp với logic trong register page
      return { token: 'temp-token', account: account };
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      throw new Error(error.message || 'Đăng ký thất bại');
    }
  },

  isAuthenticated: () => {
    if (!isBrowser) return false;
    return !!localStorage.getItem('token');
  },

  getCurrentUser: () => {
    if (!isBrowser) return null;
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  logout: async () => {
    if (isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
    }
    return Promise.resolve(true);
  },

  loginWithGoogle: async (googleToken) => {
    if (USE_MOCK) {
      // Mock Google login
      const mockAccount = {
        accountID: 999,
        fullName: 'Google User',
        email: 'google@example.com',
        roleID: 4, // Customer
        avatarUrl: 'https://via.placeholder.com/150'
      };
      if (isBrowser) {
        localStorage.setItem('token', 'google-mock-token');
        localStorage.setItem('user', JSON.stringify(mockAccount));
      }
      return Promise.resolve({ token: 'google-mock-token', account: mockAccount });
    }

    // Sử dụng API thật cho Google login
    try {
      const response = await axiosInstance.post('/api/accounts/login/google', {
        token: googleToken
      });

      const { token, account } = response.data;
      if (isBrowser) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(account));
      }
      return { token, account };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đăng nhập Google thất bại');
    }
  },
};

export default authService; 