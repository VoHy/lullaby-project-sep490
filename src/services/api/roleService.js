// Role Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.ROLES; // '/roles'

const roleService = {
  getRoles: async () => apiGet(`${base}/getall`, 'Không thể lấy roles'),
  getRoleById: async (id) => apiGet(`${base}/get/${id}`, 'Không thể lấy role'),
  createRole: async (data) => apiPost(`${base}/create`, data, 'Không thể tạo role'),
  updateRole: async (id, data) => apiPut(`${base}/update/${id}`, data, 'Không thể cập nhật role'),
  deleteRole: async (id) => apiDelete(`${base}/delete/${id}`, 'Không thể xóa role'),
};

export default roleService;
