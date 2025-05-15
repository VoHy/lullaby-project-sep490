import axiosInstance from '../http/axios';

const NURSE_ENDPOINTS = {
  LIST: '/nurses',
  DETAIL: '/nurses', // + /{id}
  SCHEDULE: '/nurses/schedule',
  FEEDBACKS: '/nurses/feedbacks',
};

export const nurseService = {
  // Lấy danh sách y tá
  getNurses: async (params = {}) => {
    const response = await axiosInstance.get(NURSE_ENDPOINTS.LIST, { params });
    return response.data;
  },

  // Lấy chi tiết y tá theo ID
  getNurseById: async (nurseId) => {
    const response = await axiosInstance.get(`${NURSE_ENDPOINTS.DETAIL}/${nurseId}`);
    return response.data;
  },

  // Lấy danh sách y tá theo chuyên khoa
  getNursesBySpecialty: async (specialtyId) => {
    const response = await axiosInstance.get(NURSE_ENDPOINTS.LIST, {
      params: { specialtyId },
    });
    return response.data;
  },

  // Lấy lịch làm việc của y tá
  getNurseSchedule: async (nurseId, params = {}) => {
    const response = await axiosInstance.get(`${NURSE_ENDPOINTS.SCHEDULE}/${nurseId}`, {
      params,
    });
    return response.data;
  },

  // Lấy đánh giá về y tá
  getNurseFeedbacks: async (nurseId, params = {}) => {
    const response = await axiosInstance.get(`${NURSE_ENDPOINTS.FEEDBACKS}/${nurseId}`, {
      params,
    });
    return response.data;
  },

  // Y tá: Cập nhật lịch làm việc
  updateSchedule: async (scheduleData) => {
    const response = await axiosInstance.post(NURSE_ENDPOINTS.SCHEDULE, scheduleData);
    return response.data;
  },
};

export default nurseService; 