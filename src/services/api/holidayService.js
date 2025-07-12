import axiosInstance from '../http/axios';

const HOLIDAY_ENDPOINTS = {
  LIST: '/api/Holiday',
  DETAIL: '/api/Holiday', // + /{id}
};

const holidayService = {
  getHolidays: async (params = {}) => {
    const response = await axiosInstance.get(HOLIDAY_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getHolidayById: async (id) => {
    const response = await axiosInstance.get(`${HOLIDAY_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
  createHoliday: async (data) => {
    const response = await axiosInstance.post(HOLIDAY_ENDPOINTS.LIST, data);
    return response.data;
  },
  updateHoliday: async (id, data) => {
    const response = await axiosInstance.put(`${HOLIDAY_ENDPOINTS.DETAIL}/${id}`, data);
    return response.data;
  },
  deleteHoliday: async (id) => {
    const response = await axiosInstance.delete(`${HOLIDAY_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
};

export default holidayService; 