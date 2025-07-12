import axiosInstance from '../http/axios';

const NURSE_ENDPOINTS = {
  LIST: '/api/NursingService',
  DETAIL: '/api/NursingService', // + /{id}
};
export const nurseService = {
  getNurses: async (params = {}) => {
    const response = await axiosInstance.get(NURSE_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getNurseById: async (nurseId) => {
    const response = await axiosInstance.get(`${NURSE_ENDPOINTS.DETAIL}/${nurseId}`);
    return response.data;
  },
  updateNurse: async (nurseId, data) => {
    const response = await axiosInstance.put(`${NURSE_ENDPOINTS.DETAIL}/${nurseId}`, data);
    return response.data;
  },
  deleteNurse: async (nurseId) => {
    const response = await axiosInstance.delete(`${NURSE_ENDPOINTS.DETAIL}/${nurseId}`);
    return response.data;
  },
};

export default nurseService; 