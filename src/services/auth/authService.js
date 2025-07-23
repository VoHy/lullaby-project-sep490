import accounts from '../../mock/Account';

const isBrowser = typeof window !== 'undefined';

const authService = {
  login: async (credentials) => {
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
  },
  register: async (userData) => {
    if (!userData.full_name || !userData.phone_number || !userData.email || !userData.password) {
      throw new Error('Họ tên, số điện thoại, email và mật khẩu là bắt buộc');
    }
    // Giả lập đăng ký thành công
    const newUser = {
      AccountID: accounts.length + 1,
      full_name: userData.full_name,
      phone_number: userData.phone_number,
      email: userData.email,
      password: userData.password,
      avatar_url: userData.avatar_url || '',
      created_at: new Date().toISOString(),
      status: 'active',
      role_id: userData.role_id || 3,
      delete_at: null
    };
    if (isBrowser) {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    return Promise.resolve({ token: 'mock-token', user: newUser });
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
};

export default authService; 