// Service Task Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.SERVICE_TASKS; // '/servicetasks'

const serviceTaskService = {
  getServiceTasks: async () => apiGet(`${base}/getall`, 'Không thể lấy service tasks'),
  getServiceTaskById: async (id) => apiGet(`${base}/get/${id}`, 'Không thể lấy service task'),
  getServiceTasksByPackage: async (packageServiceId) => apiGet(`${base}/getbypackage/${packageServiceId}`, 'Không thể lấy service tasks của gói'),
  createServiceTask: async (data) => apiPost(`${base}/create-tasks`, data, 'Không thể tạo service task'),
  updateServiceTask: async (id, data) => apiPut(`${base}/update/${id}`, data, 'Không thể cập nhật service task'),
  softDeleteServiceTask: async (id) => apiPut(`${base}/softdelete/${id}`, {}, 'Không thể soft delete'),
  deleteServiceTask: async (id) => apiDelete(`${base}/delete/${id}`, 'Không thể xóa service task'),
};

export default serviceTaskService;
