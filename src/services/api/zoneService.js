import axiosInstance from '../http/axios';

const ZONE_ENDPOINTS = {
  LIST: '/api/Zone',
  DETAIL: '/api/Zone', // + /{id}
};

const zoneService = {
  getZones: async (params = {}) => {
    const response = await axiosInstance.get(ZONE_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getZoneById: async (id) => {
    const response = await axiosInstance.get(`${ZONE_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
  createZone: async (data) => {
    const response = await axiosInstance.post(ZONE_ENDPOINTS.LIST, data);
    return response.data;
  },
  updateZone: async (id, data) => {
    const response = await axiosInstance.put(`${ZONE_ENDPOINTS.DETAIL}/${id}`, data);
    return response.data;
  },
  deleteZone: async (id) => {
    const response = await axiosInstance.delete(`${ZONE_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
};

export default zoneService; 