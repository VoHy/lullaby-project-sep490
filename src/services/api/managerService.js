import axiosInstance from '../http/axios';

const MANAGER_ENDPOINTS = {
  LIST: '/api/Manager',
  DETAIL: '/api/Manager', // + /{id}
};

const managerService = {
  getManagers: async (params = {}) => {
    const response = await axiosInstance.get(MANAGER_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getManagerById: async (id) => {
    const response = await axiosInstance.get(`${MANAGER_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
  createManager: async (data) => {
    const response = await axiosInstance.post(MANAGER_ENDPOINTS.LIST, data);
    return response.data;
  },
  updateManager: async (id, data) => {
    const response = await axiosInstance.put(`${MANAGER_ENDPOINTS.DETAIL}/${id}`, data);
    return response.data;
  },
  deleteManager: async (id) => {
    const response = await axiosInstance.delete(`${MANAGER_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
};

export default managerService; 