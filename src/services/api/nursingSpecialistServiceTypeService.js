// Nursing Specialist Service Type Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.NURSING_SPECIALIST_SERVICE_TYPES; // '/nursingspecialist-servicetype'

const nursingSpecialistServiceTypeService = {
  getByNursing: async (nursingId) => apiGet(`${base}/getbynursing/${nursingId}`, 'Không thể lấy mapping theo nurse'),
  getByService: async (serviceId) => apiGet(`${base}/getbyservice/${serviceId}`, 'Không thể lấy mapping theo service'),
  create: async (data) => apiPost(`${base}/create`, data, 'Không thể tạo mapping'),
  update: async (id, data) => apiPut(`${base}/${id}`, data, 'Không thể cập nhật mapping'),
  delete: async (id) => apiDelete(`${base}/${id}`, 'Không thể xóa mapping'),
};

export default nursingSpecialistServiceTypeService;
