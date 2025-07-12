import axiosInstance from '../http/axios';

const MEDICAL_REPORT_ENDPOINTS = {
  CREATE: '/api/MedicalNote',
  LIST: '/api/MedicalNote',
  DETAIL: '/api/MedicalNote', // + /{id}
};
export const medicalReportService = {
  createMedicalReport: async (reportData) => {
    const response = await axiosInstance.post(MEDICAL_REPORT_ENDPOINTS.CREATE, reportData);
    return response.data;
  },
  getMedicalReports: async (params = {}) => {
    const response = await axiosInstance.get(MEDICAL_REPORT_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getMedicalReportById: async (reportId) => {
    const response = await axiosInstance.get(`${MEDICAL_REPORT_ENDPOINTS.DETAIL}/${reportId}`);
    return response.data;
  },
  updateMedicalReport: async (reportId, reportData) => {
    const response = await axiosInstance.put(`${MEDICAL_REPORT_ENDPOINTS.DETAIL}/${reportId}`, reportData);
    return response.data;
  },
  deleteMedicalReport: async (reportId) => {
    const response = await axiosInstance.delete(`${MEDICAL_REPORT_ENDPOINTS.DETAIL}/${reportId}`);
    return response.data;
  },
};

export default medicalReportService; 