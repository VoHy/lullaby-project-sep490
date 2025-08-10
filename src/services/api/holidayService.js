// Holiday Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.HOLIDAYS; // '/Holiday'

const holidayService = {
  getAllHolidays: async () => apiGet(`${base}/GetAll`, 'Không thể lấy lịch nghỉ'),
  getHolidayById: async (id) => apiGet(`${base}/${id}`, 'Không thể lấy thông tin lịch nghỉ'),
  createHoliday: async (data) => apiPost(`${base}`, data, 'Không thể tạo lịch nghỉ'),
  updateHoliday: async (id, data) => apiPut(`${base}/${id}`, data, 'Không thể cập nhật lịch nghỉ'),
  deleteHoliday: async (id) => apiDelete(`${base}/${id}`, 'Không thể xóa lịch nghỉ'),
};

export default holidayService;
