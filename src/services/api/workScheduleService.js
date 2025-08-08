// Work Schedule Service - Xử lý tất cả các thao tác liên quan đến lịch làm việc
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const workScheduleService = {
  /**
   * Lấy danh sách tất cả work schedules
   * @returns {Promise<any>} Danh sách work schedules
   */
  getWorkSchedules: async () => {
    return await apiGet('/api/workschedules', 'Không thể lấy danh sách lịch làm việc');
  },

  // Get all by nursing
  getAllByNursing: async (nursingId) => {
    return await apiGet(`/api/workschedules/getallbynursing/${nursingId}`, 'Không thể lấy lịch làm việc theo y tá');
  },

  /**
   * Lấy work schedule theo ID
   * @param {string|number} id - Work schedule ID
   * @returns {Promise<any>} Thông tin work schedule
   */
  getWorkScheduleById: async (id) => {
    return await apiGet(`/api/workschedules/${id}`, 'Không thể lấy thông tin lịch làm việc');
  },

  /**
   * Tạo work schedule mới
   * @param {object} workScheduleData - Dữ liệu work schedule
   * @returns {Promise<any>} Work schedule được tạo
   */
  createWorkSchedule: async (workScheduleData) => {
    return await apiPost('/api/workschedules', workScheduleData, 'Không thể tạo lịch làm việc');
  },

  /**
   * Cập nhật work schedule
   * @param {string|number} id - Work schedule ID
   * @param {object} workScheduleData - Dữ liệu cập nhật
   * @returns {Promise<any>} Work schedule được cập nhật
   */
  updateWorkSchedule: async (id, workScheduleData) => {
    return await apiPut(`/api/workschedules/${id}`, workScheduleData, 'Không thể cập nhật lịch làm việc');
  },

  // Update IsAttended
  updateIsAttended: async (workScheduleId) => {
    return await apiPut(`/api/workschedules/updateisattended/${workScheduleId}`, {}, 'Không thể cập nhật điểm danh');
  },

  /**
   * Xóa work schedule
   * @param {string|number} id - Work schedule ID
   * @returns {Promise<any>} Kết quả xóa
   */
  deleteWorkSchedule: async (id) => {
    return await apiDelete(`/api/workschedules/${id}`, 'Không thể xóa lịch làm việc');
  }
};

export default workScheduleService; 

