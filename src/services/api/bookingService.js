// Booking Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.BOOKINGS; // '/Booking'

const bookingService = {
  getAllBookings: async () => apiGet(`${base}/GetAll`, 'Không thể lấy danh sách booking'),
  getBookingById: async (id) => apiGet(`${base}/${id}`, 'Không thể lấy thông tin booking'),
  deleteBooking: async (id) => apiDelete(`${base}/${id}`, 'Không thể xóa booking'),
  getAllByStatus: async (status) => apiGet(`${base}/GetAllByStatus/${status}`, 'Không thể lấy booking theo trạng thái'),
  getAllByCareProfile: async (careProfileId) => apiGet(`${base}/GetAllByCareProfile/${careProfileId}`, 'Không thể lấy booking theo hồ sơ'),
  getAllByStatusAndCareProfile: async (careProfileId, status) => apiGet(`${base}/GetAllByStatusAndCareProfile/${careProfileId}/${status}`, 'Không thể lấy booking'),
  createServiceBooking: async (data) => apiPost(`${base}/CreateServiceBooking`, data, 'Không thể tạo booking dịch vụ'),
  createPackageBooking: async (data) => apiPost(`${base}/CreatePackageBooking`, data, 'Không thể tạo booking gói'),
  updateStatus: async (bookingId, status) => apiPut(`${base}/UpdateStatus/${bookingId}`, { status }, 'Không thể cập nhật trạng thái booking'),
  updateWorkdate: async (bookingId, payload) => apiPut(`${base}/UpdateWorkdate/${bookingId}`, payload, 'Không thể cập nhật ngày làm việc'),

  // Convenience
  getBookingByIdWithCareProfile: async (id) => apiGet(`${base}/${id}`, 'Không thể lấy booking'),
  getBookingsByNursing: async (nursingId) => apiGet(`${base}/GetAllByNursing/${nursingId}`, 'Không thể lấy booking theo nurse'),
};

export default bookingService;


