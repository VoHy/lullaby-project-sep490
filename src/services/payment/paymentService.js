import axiosInstance from '../http/axios';

const PAYMENT_ENDPOINTS = {
  CREATE: '/payments',
  LIST: '/payments',
  DETAIL: '/payments', // + /{id}
  HISTORY: '/payments/history',
  METHODS: '/payments/methods',
};

export const paymentService = {
  // Tạo thanh toán mới
  createPayment: async (paymentData) => {
    // Đảm bảo truyền đủ các trường: BookingID, PaymentMethod, Amount, Status
    const requiredFields = ['BookingID', 'PaymentMethod', 'Amount', 'Status'];
    requiredFields.forEach(field => {
      if (!paymentData[field]) throw new Error(`Thiếu trường ${field} khi tạo payment`);
    });
    const response = await axiosInstance.post(PAYMENT_ENDPOINTS.CREATE, paymentData);
    return response.data;
  },

  // Lấy danh sách thanh toán
  getPayments: async (params = {}) => {
    const response = await axiosInstance.get(PAYMENT_ENDPOINTS.LIST, { params });
    return response.data;
  },

  // Lấy chi tiết thanh toán theo ID
  getPaymentById: async (paymentId) => {
    const response = await axiosInstance.get(`${PAYMENT_ENDPOINTS.DETAIL}/${paymentId}`);
    return response.data;
  },

  // Lấy lịch sử thanh toán
  getPaymentHistory: async (params = {}) => {
    const response = await axiosInstance.get(PAYMENT_ENDPOINTS.HISTORY, { params });
    return response.data;
  },

  // Lấy danh sách phương thức thanh toán
  getPaymentMethods: async () => {
    const response = await axiosInstance.get(PAYMENT_ENDPOINTS.METHODS);
    return response.data;
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (paymentId) => {
    const response = await axiosInstance.get(`${PAYMENT_ENDPOINTS.DETAIL}/${paymentId}/status`);
    return response.data;
  },
};

export default paymentService; 