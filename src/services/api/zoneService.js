// Zone Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.ZONES; // '/zones'

const zoneService = {
  getZones: async () => apiGet(`${base}/getall`, 'Không thể lấy zones'),
  getZoneById: async (id) => apiGet(`${base}/get/${id}`, 'Không thể lấy zone'),
  createZone: async (data) => apiPost(`${base}/create`, data, 'Không thể tạo zone'),
  updateZone: async (id, data) => apiPut(`${base}/update/${id}`, data, 'Không thể cập nhật zone'),
  deleteZone: async (id) => apiDelete(`${base}/delete/${id}`, 'Không thể xóa zone'),
  getCount: async () => apiGet(`${base}/count`, 'Không thể lấy số lượng zone'),
};

export default zoneService;
