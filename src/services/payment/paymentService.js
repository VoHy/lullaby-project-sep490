import axiosInstance from '../http/axios';

const PAYMENT_ENDPOINTS = {
  CREATE: '/api/Payment',
  LIST: '/api/Payment',
  DETAIL: '/api/Payment', // + /{id}
};
export const paymentService = {
  createPayment: async (paymentData) => {
    const response = await axiosInstance.post(PAYMENT_ENDPOINTS.CREATE, paymentData);
    return response.data;
  },
  getPayments: async (params = {}) => {
    const response = await axiosInstance.get(PAYMENT_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getPaymentById: async (paymentId) => {
    const response = await axiosInstance.get(`${PAYMENT_ENDPOINTS.DETAIL}/${paymentId}`);
    return response.data;
  },
  updatePayment: async (paymentId, data) => {
    const response = await axiosInstance.put(`${PAYMENT_ENDPOINTS.DETAIL}/${paymentId}`, data);
    return response.data;
  },
  deletePayment: async (paymentId) => {
    const response = await axiosInstance.delete(`${PAYMENT_ENDPOINTS.DETAIL}/${paymentId}`);
    return response.data;
  },
}; 