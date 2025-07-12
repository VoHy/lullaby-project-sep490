import axiosInstance from '../http/axios';

const PACKAGE_ENDPOINTS = {
  LIST: '/api/Package',
  DETAIL: '/api/Package', // + /{id}
};

const packageService = {
  getPackages: async (params = {}) => {
    const response = await axiosInstance.get(PACKAGE_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getPackageById: async (id) => {
    const response = await axiosInstance.get(`${PACKAGE_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
  createPackage: async (data) => {
    const response = await axiosInstance.post(PACKAGE_ENDPOINTS.LIST, data);
    return response.data;
  },
  updatePackage: async (id, data) => {
    const response = await axiosInstance.put(`${PACKAGE_ENDPOINTS.DETAIL}/${id}`, data);
    return response.data;
  },
  deletePackage: async (id) => {
    const response = await axiosInstance.delete(`${PACKAGE_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
};

export default packageService; 