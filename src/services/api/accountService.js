// Account Service - Xử lý tất cả các thao tác liên quan đến tài khoản

// Utility function để lấy token từ localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Utility function để tạo headers với token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const accountService = {

  // === BASIC CRUD METHODS ===
  getAccount: async (id) => {
    const res = await fetch(`/api/accounts/get/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin account');
    return data;
  },

  getAllAccounts: async () => {
    const res = await fetch('/api/accounts/getall', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách accounts');
    return data;
  },

  getAccountById: async (id) => {
    const res = await fetch(`/api/accounts/get/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin account');
    return data;
  },

  updateAccount: async (id, data) => {
    const res = await fetch(`/api/accounts/update/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json-patch+json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật account thất bại');
    return result;
  },

  // === REGISTER METHODS ===
  registerNursingSpecialist: async (data) => {
    const res = await fetch('/api/accounts/register/nursingspecialist', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Đăng ký nursing specialist thất bại');
    return result;
  },

  registerManager: async (data) => {
    const res = await fetch('/api/accounts/register/manager', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Đăng ký manager thất bại');
    return result;
  },

  registerCustomer: async (data) => {
    const res = await fetch('/api/accounts/register/customer', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Đăng ký customer thất bại');
    return result;
  },

  // === RESET PASSWORD ===
  resetPassword: async (data) => {
    const res = await fetch('/api/accounts/reset-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Đặt lại mật khẩu thất bại');
    return result;
  },

  // === BAN/UNBAN METHODS ===
  banAccount: async (id) => {
    const res = await fetch(`/api/accounts/ban/${id}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Ban tài khoản thất bại');
    return result;
  },

  // === DELETE METHODS ===
  deleteAccount: async (id) => {
    const res = await fetch(`/api/accounts/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa tài khoản thất bại');
    return result;
  },

  removeAccount: async (id) => {
    const res = await fetch(`/api/accounts/remove/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa tài khoản thất bại');
    return result;
  },

  // === GET SPECIFIC ACCOUNTS ===
  getManagers: async () => {
    const res = await fetch('/api/accounts/managers', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách managers');
    return data;
  },

  getManagerById: async (id) => {
    const res = await fetch(`/api/accounts/get/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin manager');
    return data;
  },

  updateManager: async (id, data) => {
    const res = await fetch(`/api/accounts/update/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật manager thất bại');
    return result;
  },

  getCustomers: async () => {
    const res = await fetch('/api/accounts/customers', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách customers');
    return data;
  },

  // === COUNT METHODS ===
  getNonAdminCount: async () => {
    const res = await fetch('/api/accounts/count/non-admin', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng non-admin accounts');
    return data;
  },

  getManagerCount: async () => {
    const res = await fetch('/api/accounts/count/managers', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng managers');
    return data;
  },

  getCustomerCount: async () => {
    const res = await fetch('/api/accounts/count/customers', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng customers');
    return data;
  }
};

export default accountService; 