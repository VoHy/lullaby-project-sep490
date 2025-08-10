// Care Profile Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.CARE_PROFILES; // '/careprofiles'

const careProfileService = {
  getCareProfiles: async () => apiGet(`${base}/getall`, 'Không thể lấy danh sách care profiles'),
  getCareProfileById: async (id) => apiGet(`${base}/get/${id}`, 'Không thể lấy thông tin care profile'),
  getCount: async () => apiGet(`${base}/count`, 'Không thể lấy thống kê care profiles'),
  createCareProfile: async (data) => apiPost(`${base}/create`, data, 'Không thể tạo care profile'),
  updateCareProfile: async (id, data) => apiPut(`${base}/update/${id}`, data, 'Không thể cập nhật care profile'),
  deleteCareProfile: async (id) => apiDelete(`${base}/delete/${id}`, 'Không thể xóa care profile'),
};

export default careProfileService;


