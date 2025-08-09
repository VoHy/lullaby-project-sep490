// Customize Package Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.CUSTOMIZE_PACKAGES; // '/CustomizePackage'

const customizePackageService = {
  getAllCustomizePackages: async () => apiGet(`${base}/GetAll`, 'Không thể lấy danh sách gói tùy chỉnh'),
  getCustomizePackageById: async (id) => apiGet(`${base}/${id}`, 'Không thể lấy gói'),
  getAllByBooking: async (bookingId) => apiGet(`${base}/GetAllByBooking/${bookingId}`, 'Không thể lấy gói theo booking'),
  getAllByStatus: async (status) => apiGet(`${base}/GetAllByStatus/${status}`, 'Không thể lấy gói theo trạng thái'),
  getAllByStatusAndBooking: async (bookingId, status) => apiGet(`${base}/GetAllByStatusAndBooking/${bookingId}/${status}`, 'Không thể lấy gói theo trạng thái + booking'),
  updateStatus: async (id, status) => apiPut(`${base}/UpdateStatus/${id}`, { status }, 'Không thể cập nhật trạng thái'),
  deleteCustomizePackage: async (id) => apiDelete(`${base}/${id}`, 'Không thể xóa gói'),
};

export default customizePackageService;
