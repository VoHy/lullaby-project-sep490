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
};

export default medicalNoteService;
