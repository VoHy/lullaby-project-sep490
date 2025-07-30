import { createService } from './serviceFactory';

// Tạo base service với factory
const baseAccountService = createService('accounts', 'Account', true);

// Thêm các method đặc biệt
const accountService = {
  // Base CRUD methods từ factory
  ...baseAccountService,

  // === REGISTER METHODS ===
  registerNursingSpecialist: async (data) => {
    const res = await fetch('/api/accounts/register/nursingspecialist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Đăng ký nursing specialist thất bại');
    return result;
  },

  registerManager: async (data) => {
    const res = await fetch('/api/accounts/register/manager', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Đăng ký manager thất bại');
    return result;
  },

  registerCustomer: async (data) => {
    const res = await fetch('/api/accounts/register/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Đăng ký customer thất bại');
    return result;
  },

  // === BAN/UNBAN METHODS ===
  banAccount: async (id) => {
    const res = await fetch(`/api/accounts/ban/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Ban tài khoản thất bại');
    return result;
  },

  // === GET SPECIFIC ACCOUNTS ===
  getManagers: async () => {
    const res = await fetch('/api/accounts/managers', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách managers');
    return data;
  },

  getManagerById: async (id) => {
    const res = await fetch(`/api/accounts/get/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin manager');
    return data;
  },

  updateManager: async (id, data) => {
    const res = await fetch(`/api/accounts/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật manager thất bại');
    return result;
  },

  getCustomers: async () => {
    const res = await fetch('/api/accounts/customers', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách customers');
    return data;
  }
};

export default accountService; 