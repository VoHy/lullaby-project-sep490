import axiosInstance from '../http/axios';

const USER_ENDPOINTS = {
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  PATIENT_PROFILES: '/users/patient-profiles',
  PATIENT_PROFILE: '/users/patient-profiles',
};

export const userService = {
  // Lấy thông tin profile
  getProfile: async () => {
    const response = await axiosInstance.get(USER_ENDPOINTS.PROFILE);
    return response.data;
  },

  // Cập nhật thông tin profile
  updateProfile: async (profileData) => {
    const response = await axiosInstance.put(USER_ENDPOINTS.UPDATE_PROFILE, profileData);
    return response.data;
  },

  // Lấy danh sách hồ sơ bệnh nhân
  getPatientProfiles: async () => {
    const response = await axiosInstance.get(USER_ENDPOINTS.PATIENT_PROFILES);
    return response.data;
  },

  // Lấy chi tiết hồ sơ bệnh nhân theo ID
  getPatientProfile: async (patientId) => {
    const response = await axiosInstance.get(`${USER_ENDPOINTS.PATIENT_PROFILE}/${patientId}`);
    return response.data;
  },

  // Tạo hồ sơ bệnh nhân mới
  createPatientProfile: async (patientData) => {
    const response = await axiosInstance.post(USER_ENDPOINTS.PATIENT_PROFILES, patientData);
    return response.data;
  },

  // Cập nhật hồ sơ bệnh nhân
  updatePatientProfile: async (patientId, patientData) => {
    const response = await axiosInstance.put(`${USER_ENDPOINTS.PATIENT_PROFILE}/${patientId}`, patientData);
    return response.data;
  },

  // Xóa hồ sơ bệnh nhân
  deletePatientProfile: async (patientId) => {
    const response = await axiosInstance.delete(`${USER_ENDPOINTS.PATIENT_PROFILE}/${patientId}`);
    return response.data;
  },
};

export default userService; 