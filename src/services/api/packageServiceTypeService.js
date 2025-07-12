import axiosInstance from '../http/axios';

const PACKAGE_SERVICE_TYPE_ENDPOINTS = {
  LIST: '/api/PackageServiceType',
  DETAIL: '/api/PackageServiceType', // + /{id}
};

const packageServiceTypeService = {
  getPackageServiceTypes: async (params = {}) => {
    const response = await axiosInstance.get(PACKAGE_SERVICE_TYPE_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getPackageServiceTypeById: async (id) => {
    const response = await axiosInstance.get(`${PACKAGE_SERVICE_TYPE_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
  createPackageServiceType: async (data) => {
    const response = await axiosInstance.post(PACKAGE_SERVICE_TYPE_ENDPOINTS.LIST, data);
    return response.data;
  },
  updatePackageServiceType: async (id, data) => {
    const response = await axiosInstance.put(`${PACKAGE_SERVICE_TYPE_ENDPOINTS.DETAIL}/${id}`, data);
    return response.data;
  },
  deletePackageServiceType: async (id) => {
    const response = await axiosInstance.delete(`${PACKAGE_SERVICE_TYPE_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
};

export default packageServiceTypeService; 