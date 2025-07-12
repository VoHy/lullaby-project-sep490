import axiosInstance from '../http/axios';

const ROLE_ENDPOINTS = {
  GET: '/api/roles/get', // + /{id}
  GET_ALL: '/api/roles/getall',
  CREATE: '/api/roles/create',
  UPDATE: '/api/roles/update', // + /{id}
  DELETE: '/api/roles/delete', // + /{id}
};

const roleService = {
  getRole: async (id) => {
    const response = await axiosInstance.get(`${ROLE_ENDPOINTS.GET}/${id}`);
    return response.data;
  },
  getAllRoles: async () => {
    const response = await axiosInstance.get(ROLE_ENDPOINTS.GET_ALL);
    return response.data;
  },
  createRole: async (data) => {
    const response = await axiosInstance.post(ROLE_ENDPOINTS.CREATE, data);
    return response.data;
  },
  updateRole: async (id, data) => {
    const response = await axiosInstance.put(`${ROLE_ENDPOINTS.UPDATE}/${id}`, data);
    return response.data;
  },
  deleteRole: async (id) => {
    const response = await axiosInstance.delete(`${ROLE_ENDPOINTS.DELETE}/${id}`);
    return response.data;
  },
};

export default roleService; 