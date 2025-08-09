// Service Type Service - Xử lý các loại dịch vụ
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.SERVICE_TYPES; // '/servicetypes'

const serviceTypeService = {
  getServiceTypes: async () => apiGet(`${base}/getall`, 'Không thể lấy danh sách service types'),
  getAllServiceTypes: async () => apiGet(`${base}/getall`, 'Không thể lấy danh sách service types'),
  createServiceType: async (data) => apiPost(`${base}/createsingle`, data, 'Không thể tạo service type'),
  createServiceTypePackage: async (data) => apiPost(`${base}/createpackage`, data, 'Không thể tạo gói dịch vụ'),
  getServiceTypeById: async (id) => apiGet(`${base}/get/${id}`, 'Không thể lấy thông tin service type'),
  updateServiceType: async (id, data) => apiPut(`${base}/update/${id}`, data, 'Không thể cập nhật service type'),
  softDeleteServiceType: async (id) => apiPut(`${base}/softdelete/${id}`, {}, 'Không thể xóa mềm service type'),
  activateServiceType: async (id) => apiPut(`${base}/activate/${id}`, {}, 'Không thể kích hoạt'),
  deleteServiceType: async (id) => apiDelete(`${base}/delete/${id}`, 'Không thể xóa service type'),
  getServiceTypeCount: async () => apiGet(`${base}/count`, 'Không thể lấy số lượng service types'),
};

export default serviceTypeService;
