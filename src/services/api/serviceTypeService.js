import axiosInstance from '../http/axios';

const SERVICE_TYPE_ENDPOINTS = {
  LIST: '/api/ServiceType',
  DETAIL: '/api/ServiceType', // + /{id}
};

const serviceTypeService = {
  getServiceTypes: async (params = {}) => {
    const response = await axiosInstance.get(SERVICE_TYPE_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getServiceTypeById: async (id) => {
    const response = await axiosInstance.get(`${SERVICE_TYPE_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
  createServiceType: async (data) => {
    const response = await axiosInstance.post(SERVICE_TYPE_ENDPOINTS.LIST, data);
    return response.data;
  },
  updateServiceType: async (id, data) => {
    const response = await axiosInstance.put(`${SERVICE_TYPE_ENDPOINTS.DETAIL}/${id}`, data);
    return response.data;
  },
  deleteServiceType: async (id) => {
    const response = await axiosInstance.delete(`${SERVICE_TYPE_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
};

export default serviceTypeService; 