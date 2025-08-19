// Medical Note Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.MEDICAL_NOTES; // '/MedicalNote'

const medicalNoteService = {
  getAllMedicalNotes: async () => apiGet(`${base}/GetAll`, 'Không thể lấy bệnh án'),
  getMedicalNoteById: async (id) => apiGet(`${base}/${id}`, 'Không thể lấy bệnh án'),
  createMedicalNote: async (data) => apiPost(`${base}`, data, 'Không thể tạo bệnh án'),
  updateMedicalNote: async (id, data) => apiPut(`${base}/${id}`, data, 'Không thể cập nhật bệnh án'),
  deleteMedicalNote: async (id) => apiDelete(`${base}/${id}`, 'Không thể xóa bệnh án'),
  /**
   * Lấy danh sách medical notes theo careProfileId (và tùy chọn serviceId)
   * GET /api/MedicalNote/by-careprofile-service?careProfileId={id}&serviceId={serviceId}
   */
  getMedicalNotesByCareProfile: async (careProfileId, serviceId) => {
    const params = new URLSearchParams();
    if (careProfileId !== undefined && careProfileId !== null) {
      params.append('careProfileId', String(careProfileId));
    }
    if (serviceId !== undefined && serviceId !== null && serviceId !== '') {
      params.append('serviceId', String(serviceId));
    }
    const qs = params.toString();
    const endpoint = qs ? `${base}/by-careprofile-service?${qs}` : `${base}/by-careprofile-service`;
    return apiGet(endpoint, 'Không thể lấy bệnh án theo care profile');
  },
};

export default medicalNoteService;
