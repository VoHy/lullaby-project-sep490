// Account Service - Gọi trực tiếp Swagger backend (không dùng proxy)
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.ACCOUNTS; // '/accounts'

const accountService = {
  // Auth related
  login: async (payload) => apiPost(`${base}/login`, payload, 'Đăng nhập thất bại'),

  // Basic accounts
  getAllAccounts: async () => apiGet(`${base}/getall`, 'Không thể lấy danh sách tài khoản'),
  getAccountById: async (id) => apiGet(`${base}/get/${id}`, 'Không thể lấy thông tin tài khoản'),
  updateAccount: async (id, data) => apiPut(`${base}/update/${id}`, data, 'Không thể cập nhật tài khoản'),
  deleteAccount: async (id) => apiDelete(`${base}/delete/${id}`, 'Không thể xóa tài khoản'),
  removeAccount: async (id) => apiDelete(`${base}/remove/${id}`, 'Không thể xoá tài khoản'),
  banAccount: async (id) => apiPost(`${base}/ban/${id}`, {}, 'Không thể cấm tài khoản'),

  // Managers
  getManagers: async () => apiGet(`${base}/managers`, 'Không thể lấy managers'),
  getManagerById: async (id) => apiGet(`${base}/get/${id}`, 'Không thể lấy thông tin manager'),
  registerManager: async (data) => apiPost(`${base}/register/manager`, data, 'Không thể tạo manager'),
  updateManager: async (id, data) => apiPut(`${base}/update/${id}`, data, 'Không thể cập nhật manager'),

  // Nursing specialists
  registerNursingSpecialist: async (data) => apiPost(`${base}/register/nursingspecialist`, data, 'Không thể tạo nursing specialist'),
  registerCustomer: async (data) => apiPost(`${base}/register/customer`, data, 'Không thể tạo khách hàng'),
};

export default accountService;


