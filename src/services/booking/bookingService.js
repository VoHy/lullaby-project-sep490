import axiosInstance from '../http/axios';

const BOOKING_ENDPOINTS = {
  CREATE: '/bookings',
  LIST: '/bookings',
  DETAIL: '/bookings', // + /{id}
  UPCOMING: '/bookings/upcoming',
  HISTORY: '/bookings/history',
  CANCEL: '/bookings/cancel', // + /{id}
  COMPLETE: '/bookings/complete', // + /{id}
};

export const bookingService = {
  // Tạo đặt lịch mới
  createBooking: async (bookingData) => {
    // Đảm bảo truyền đủ các trường: RelativeID, PackageID, CreatedAt, UpdatedAt, Amount, Workdate, Status
    const requiredFields = ['RelativeID', 'PackageID', 'CreatedAt', 'UpdatedAt', 'Amount', 'Workdate', 'Status'];
    requiredFields.forEach(field => {
      if (!bookingData[field]) throw new Error(`Thiếu trường ${field} khi tạo booking`);
    });
    const response = await axiosInstance.post(BOOKING_ENDPOINTS.CREATE, bookingData);
    return response.data;
  },

  // Lấy danh sách đặt lịch
  getBookings: async (params = {}) => {
    const response = await axiosInstance.get(BOOKING_ENDPOINTS.LIST, { params });
    return response.data;
  },

  // Lấy chi tiết đặt lịch
  getBookingById: async (bookingId) => {
    const response = await axiosInstance.get(`${BOOKING_ENDPOINTS.DETAIL}/${bookingId}`);
    return response.data;
  },

  // Lấy danh sách đặt lịch sắp tới
  getUpcomingBookings: async (params = {}) => {
    const response = await axiosInstance.get(BOOKING_ENDPOINTS.UPCOMING, { params });
    return response.data;
  },

  // Lấy lịch sử đặt lịch
  getBookingHistory: async (params = {}) => {
    const response = await axiosInstance.get(BOOKING_ENDPOINTS.HISTORY, { params });
    return response.data;
  },

  // Hủy đặt lịch
  cancelBooking: async (bookingId, reason) => {
    const response = await axiosInstance.post(`${BOOKING_ENDPOINTS.CANCEL}/${bookingId}`, { reason });
    return response.data;
  },

  // Hoàn thành đặt lịch (dành cho y tá)
  completeBooking: async (bookingId, data = {}) => {
    const response = await axiosInstance.post(`${BOOKING_ENDPOINTS.COMPLETE}/${bookingId}`, data);
    return response.data;
  },
};

export default bookingService; 