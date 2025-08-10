// Zone Detail Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.ZONE_DETAILS; // '/zonedetails'

const zoneDetailService = {
  getZoneDetails: async () => apiGet(`${base}/getall`, 'Không thể lấy zone details'),
  getZoneDetailById: async (id) => apiGet(`${base}/get/${id}`, 'Không thể lấy zone detail'),
  createZoneDetail: async (data) => apiPost(`${base}/create`, data, 'Không thể tạo zone detail'),
  updateZoneDetail: async (id, data) => apiPut(`${base}/update/${id}`, data, 'Không thể cập nhật zone detail'),
  deleteZoneDetail: async (id) => apiDelete(`${base}/delete/${id}`, 'Không thể xóa zone detail'),
  getCount: async () => apiGet(`${base}/count`, 'Không thể lấy số lượng'),
};

export default zoneDetailService;
