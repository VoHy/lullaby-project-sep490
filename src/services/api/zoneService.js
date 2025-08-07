// Zone Service - Xử lý tất cả các thao tác liên quan đến zones
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const zoneService = {
  /**
   * Lấy số lượng zones
   * @returns {Promise<any>} Số lượng zones
   */
  getZoneCount: async () => {
    return await apiGet('/api/zones/count', 'Không thể lấy số lượng zones');
  },

  /**
   * Lấy danh sách tất cả zones
   * @returns {Promise<any>} Danh sách zones
   */
  getZones: async () => {
    return await apiGet('/api/zones/getall', 'Không thể lấy danh sách zones');
  },

  /**
   * Lấy zone theo ID
   * @param {string|number} id - Zone ID
   * @returns {Promise<any>} Thông tin zone
   */
  getZoneById: async (id) => {
    return await apiGet(`/api/zones/${id}`, 'Không thể lấy thông tin zone');
  },

  /**
   * Tạo zone mới
   * @param {object} zoneData - Dữ liệu zone
   * @returns {Promise<any>} Zone được tạo
   */
  createZone: async (zoneData) => {
    return await apiPost('/api/zones', zoneData, 'Không thể tạo zone');
  },

  /**
   * Cập nhật zone
   * @param {string|number} id - Zone ID
   * @param {object} zoneData - Dữ liệu cập nhật
   * @returns {Promise<any>} Zone được cập nhật
   */
  updateZone: async (id, zoneData) => {
    return await apiPut(`/api/zones/${id}`, zoneData, 'Không thể cập nhật zone');
  },

  /**
   * Xóa zone
   * @param {string|number} id - Zone ID
   * @returns {Promise<any>} Kết quả xóa
   */
  deleteZone: async (id) => {
    return await apiDelete(`/api/zones/${id}`, 'Không thể xóa zone');
  }
};

export default zoneService; 

