import axiosInstance from '../http/axios';

const WORK_SCHEDULE_ENDPOINTS = {
  LIST: '/api/WorkSchedule',
  DETAIL: '/api/WorkSchedule', // + /{id}
};

const workScheduleService = {
  getWorkSchedules: async (params = {}) => {
    const response = await axiosInstance.get(WORK_SCHEDULE_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getWorkScheduleById: async (id) => {
    const response = await axiosInstance.get(`${WORK_SCHEDULE_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
  createWorkSchedule: async (data) => {
    const response = await axiosInstance.post(WORK_SCHEDULE_ENDPOINTS.LIST, data);
    return response.data;
  },
  updateWorkSchedule: async (id, data) => {
    const response = await axiosInstance.put(`${WORK_SCHEDULE_ENDPOINTS.DETAIL}/${id}`, data);
    return response.data;
  },
  deleteWorkSchedule: async (id) => {
    const response = await axiosInstance.delete(`${WORK_SCHEDULE_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
};

export default workScheduleService; 