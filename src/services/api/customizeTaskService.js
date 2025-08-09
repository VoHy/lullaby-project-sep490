// Customize Task Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.CUSTOMIZE_TASKS; // '/CustomizeTask'

const customizeTaskService = {
  getAllCustomizeTasks: async () => apiGet(`${base}/GetAll`, 'Không thể lấy tasks'),
  getCustomizeTaskById: async (id) => apiGet(`${base}/${id}`, 'Không thể lấy task'),
  getAllByCustomizePackage: async (customizePackageId) => apiGet(`${base}/GetAllByCustomizePackage/${customizePackageId}`, 'Không thể lấy tasks theo gói'),
  getAllByBooking: async (bookingId) => apiGet(`${base}/GetAllByBooking/${bookingId}`, 'Không thể lấy tasks theo booking'),
  updateStatus: async (customizePackageId, status) => apiPut(`${base}/UpdateStatus/${customizePackageId}/${status}`, {}, 'Không thể cập nhật trạng thái'),
  updateTaskOrder: async (customizeTaskId, taskOrder) => apiPut(`${base}/UpdateTaskOrder/${customizeTaskId}/${taskOrder}`, {}, 'Không thể cập nhật thứ tự'),
  updateNursing: async (customizeTaskId, nursingId) => apiPut(`${base}/UpdateNursing/${customizeTaskId}/${nursingId}`, {}, 'Không thể gán nurse'),
  deleteCustomizeTask: async (id) => apiDelete(`${base}/${id}`, 'Không thể xóa task'),
};

export default customizeTaskService;
