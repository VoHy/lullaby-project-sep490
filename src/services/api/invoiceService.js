import axiosInstance from '../http/axios';

const INVOICE_ENDPOINTS = {
  LIST: '/api/Invoice',
  DETAIL: '/api/Invoice', // + /{id}
};

const invoiceService = {
  getInvoices: async (params = {}) => {
    const response = await axiosInstance.get(INVOICE_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getInvoiceById: async (id) => {
    const response = await axiosInstance.get(`${INVOICE_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
  createInvoice: async (data) => {
    const response = await axiosInstance.post(INVOICE_ENDPOINTS.LIST, data);
    return response.data;
  },
  updateInvoice: async (id, data) => {
    const response = await axiosInstance.put(`${INVOICE_ENDPOINTS.DETAIL}/${id}`, data);
    return response.data;
  },
  deleteInvoice: async (id) => {
    const response = await axiosInstance.delete(`${INVOICE_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
};

export default invoiceService; 