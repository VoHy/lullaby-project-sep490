import axiosInstance from '../http/axios';

const NOTIFICATION_ENDPOINTS = {
  LIST: '/api/Notification',
  DETAIL: '/api/Notification', // + /{id}
};

const notificationService = {
  getNotifications: async (params = {}) => {
    const response = await axiosInstance.get(NOTIFICATION_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getNotificationById: async (id) => {
    const response = await axiosInstance.get(`${NOTIFICATION_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
  createNotification: async (data) => {
    const response = await axiosInstance.post(NOTIFICATION_ENDPOINTS.LIST, data);
    return response.data;
  },
  updateNotification: async (id, data) => {
    const response = await axiosInstance.put(`${NOTIFICATION_ENDPOINTS.DETAIL}/${id}`, data);
    return response.data;
  },
  deleteNotification: async (id) => {
    const response = await axiosInstance.delete(`${NOTIFICATION_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
};

export default notificationService; 