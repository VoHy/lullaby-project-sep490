import axiosInstance from '../http/axios';

const RELATIVES_ENDPOINTS = {
  LIST: '/api/Relatives',
  DETAIL: '/api/Relatives', // + /{id}
};

const relativesService = {
  getRelatives: async (params = {}) => {
    const response = await axiosInstance.get(RELATIVES_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getRelativeById: async (id) => {
    const response = await axiosInstance.get(`${RELATIVES_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
  createRelative: async (data) => {
    const response = await axiosInstance.post(RELATIVES_ENDPOINTS.LIST, data);
    return response.data;
  },
  updateRelative: async (id, data) => {
    const response = await axiosInstance.put(`${RELATIVES_ENDPOINTS.DETAIL}/${id}`, data);
    return response.data;
  },
  deleteRelative: async (id) => {
    const response = await axiosInstance.delete(`${RELATIVES_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
};

export default relativesService; 