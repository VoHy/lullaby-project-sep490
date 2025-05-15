import axiosInstance from '../http/axios';

const MEDICAL_REPORT_ENDPOINTS = {
  CREATE: '/medical-reports',
  LIST: '/medical-reports',
  DETAIL: '/medical-reports', // + /{id}
  PATIENT: '/medical-reports/patient', // + /{patientId}
};

export const medicalReportService = {
  // Tạo báo cáo y tế mới
  createMedicalReport: async (reportData) => {
    const response = await axiosInstance.post(MEDICAL_REPORT_ENDPOINTS.CREATE, reportData);
    return response.data;
  },

  // Lấy danh sách báo cáo y tế
  getMedicalReports: async (params = {}) => {
    const response = await axiosInstance.get(MEDICAL_REPORT_ENDPOINTS.LIST, { params });
    return response.data;
  },

  // Lấy chi tiết báo cáo y tế theo ID
  getMedicalReportById: async (reportId) => {
    const response = await axiosInstance.get(`${MEDICAL_REPORT_ENDPOINTS.DETAIL}/${reportId}`);
    return response.data;
  },

  // Lấy báo cáo y tế theo bệnh nhân
  getMedicalReportsByPatient: async (patientId, params = {}) => {
    const response = await axiosInstance.get(`${MEDICAL_REPORT_ENDPOINTS.PATIENT}/${patientId}`, {
      params,
    });
    return response.data;
  },

  // Cập nhật báo cáo y tế
  updateMedicalReport: async (reportId, reportData) => {
    const response = await axiosInstance.put(`${MEDICAL_REPORT_ENDPOINTS.DETAIL}/${reportId}`, reportData);
    return response.data;
  },

  // Xóa báo cáo y tế
  deleteMedicalReport: async (reportId) => {
    const response = await axiosInstance.delete(`${MEDICAL_REPORT_ENDPOINTS.DETAIL}/${reportId}`);
    return response.data;
  },
};

export default medicalReportService; 