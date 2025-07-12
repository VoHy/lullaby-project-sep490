import axiosInstance from '../http/axios';

const BOOKING_ENDPOINTS = {
  CREATE: '/api/Booking',
  LIST: '/api/Booking',
  DETAIL: '/api/Booking', // + /{id}
};
export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await axiosInstance.post(BOOKING_ENDPOINTS.CREATE, bookingData);
    return response.data;
  },
  getBookings: async (params = {}) => {
    const response = await axiosInstance.get(BOOKING_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getBookingById: async (bookingId) => {
    const response = await axiosInstance.get(`${BOOKING_ENDPOINTS.DETAIL}/${bookingId}`);
    return response.data;
  },
  updateBooking: async (bookingId, data) => {
    const response = await axiosInstance.put(`${BOOKING_ENDPOINTS.DETAIL}/${bookingId}`, data);
    return response.data;
  },
  deleteBooking: async (bookingId) => {
    const response = await axiosInstance.delete(`${BOOKING_ENDPOINTS.DETAIL}/${bookingId}`);
    return response.data;
  },
};

export default bookingService; 