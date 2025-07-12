import axiosInstance from '../http/axios';

const ACCOUNT_ENDPOINTS = {
  GET: '/api/accounts/get', // + /{id}
  GET_ALL: '/api/accounts/getall',
  UPDATE: '/api/accounts/update', // + /{id}
  REMOVE: '/api/accounts/remove', // + /{id}
  DELETE: '/api/accounts/delete', // + /{id}
};

export const userService = {
  getAccount: async (id) => {
    const response = await axiosInstance.get(`${ACCOUNT_ENDPOINTS.GET}/${id}`);
    return response.data;
  },
  getAllAccounts: async () => {
    const response = await axiosInstance.get(ACCOUNT_ENDPOINTS.GET_ALL);
    return response.data;
  },
  updateAccount: async (id, data) => {
    const response = await axiosInstance.put(`${ACCOUNT_ENDPOINTS.UPDATE}/${id}`, data);
    return response.data;
  },
  removeAccount: async (id) => {
    const response = await axiosInstance.delete(`${ACCOUNT_ENDPOINTS.REMOVE}/${id}`);
    return response.data;
  },
  deleteAccount: async (id) => {
    const response = await axiosInstance.delete(`${ACCOUNT_ENDPOINTS.DELETE}/${id}`);
    return response.data;
  },
};

export default userService; 