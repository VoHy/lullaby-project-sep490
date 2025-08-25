// Relatives Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.RELATIVES; // '/relatives'

const relativesService = {
  getRelatives: async () => apiGet(`${base}/getall`, 'Không thể lấy thân nhân'),
  getRelativeById: async (id) => apiGet(`${base}/get/${id}`, 'Không thể lấy thân nhân'),
  createRelative: async (data) => apiPost(`${base}/create`, data, 'Không thể tạo thân nhân'),
  updateRelative: async (id, data) => apiPut(`${base}/update/${id}`, data, 'Không thể cập nhật thân nhân'),
  deleteRelative: async (id) => apiDelete(`${base}/delete/${id}`, 'Không thể xóa thân nhân'),
  getCount: async () => apiGet(`${base}/count`, 'Không thể lấy số lượng thân nhân'),
  getAllByBooking: async (bookingId) => apiGet(`${base}/GetAllByBooking/${bookingId}`, 'Không thể lấy thân nhân theo booking'),
};

export default relativesService;
