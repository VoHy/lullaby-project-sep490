import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.NURSING_SPECIALISTS; // '/nursingspecialists'

const nursingSpecialistService = {
  getAllFreeNursingSpecialists: async (customizeTaskId) => apiGet(`${base}/GetAllFree/${customizeTaskId}`, 'Không thể lấy danh sách y tá/chuyên gia'),
  getNursingSpecialists: async () => apiGet(`${base}/getall`, 'Không thể lấy danh sách y tá/chuyên gia'),
  getAllNursingSpecialists: async () => apiGet(`${base}/getall`, 'Không thể lấy danh sách y tá/chuyên gia'),
  getNursingSpecialistById: async (id) => apiGet(`${base}/get/${id}`, 'Không thể lấy thông tin'),
  updateNursingSpecialist: async (id, data) => apiPut(`${base}/update/${id}`, data, 'Cập nhật hồ sơ thất bại'),
  changeNursingSpecialistStatus: async (id, status) => apiPut(`${base}/changestatus/${id}`, { status }, 'Đổi trạng thái thất bại'),
  inactivate: async (id) => apiPut(`${base}/inactivate/${id}`, {}, 'Không thể vô hiệu hóa'),
  activate: async (id) => apiPut(`${base}/activate/${id}`, {}, 'Không thể kích hoạt'),
  getNursingSpecialistCount: async () => apiGet(`${base}/count`, 'Không thể lấy số lượng'),
  deleteNursingSpecialist: async (id) => apiDelete(`${base}/delete/${id}`, 'Xóa hồ sơ thất bại'),
};

export default nursingSpecialistService; 

