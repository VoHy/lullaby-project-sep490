import axiosInstance from '../http/axios';

const FEEDBACK_ENDPOINTS = {
  LIST: '/api/FeedBack',
  DETAIL: '/api/FeedBack', // + /{id}
};

const feedbackService = {
  getFeedbacks: async (params = {}) => {
    const response = await axiosInstance.get(FEEDBACK_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getFeedbackById: async (id) => {
    const response = await axiosInstance.get(`${FEEDBACK_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
  createFeedback: async (data) => {
    const response = await axiosInstance.post(FEEDBACK_ENDPOINTS.LIST, data);
    return response.data;
  },
  updateFeedback: async (id, data) => {
    const response = await axiosInstance.put(`${FEEDBACK_ENDPOINTS.DETAIL}/${id}`, data);
    return response.data;
  },
  deleteFeedback: async (id) => {
    const response = await axiosInstance.delete(`${FEEDBACK_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
};

export default feedbackService; 