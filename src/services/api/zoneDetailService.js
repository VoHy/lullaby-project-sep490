// Zone Detail Service - Xử lý tất cả các thao tác liên quan đến chi tiết zones
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const zoneDetailService = {
  /**
   * Lấy danh sách tất cả zone details
   * @returns {Promise<any>} Danh sách zone details
   */
  getZoneDetails: async () => {
    return await apiGet('/api/zonedetails/getall', 'Không thể lấy danh sách chi tiết zones');
  },

  /**
   * Lấy danh sách tất cả zone details (alias cho tương thích)
   * @returns {Promise<any>} Danh sách zone details
   */
  getAll: async () => {
    return await apiGet('/api/zonedetails/getall', 'Không thể lấy danh sách chi tiết zones');
  },

  /**
   * Lấy zone detail theo ID
   * @param {string|number} id - Zone detail ID
   * @returns {Promise<any>} Thông tin zone detail
   */
  getZoneDetailById: async (id) => {
    return await apiGet(`/api/zonedetails/${id}`, 'Không thể lấy thông tin chi tiết zone');
  },

  /**
   * Tạo zone detail mới
   * @param {object} zoneDetailData - Dữ liệu zone detail
   * @returns {Promise<any>} Zone detail được tạo
   */
  createZoneDetail: async (zoneDetailData) => {
    return await apiPost('/api/zonedetails', zoneDetailData, 'Không thể tạo chi tiết zone');
  },

  /**
   * Cập nhật zone detail
   * @param {string|number} id - Zone detail ID
   * @param {object} zoneDetailData - Dữ liệu cập nhật
   * @returns {Promise<any>} Zone detail được cập nhật
   */
  updateZoneDetail: async (id, zoneDetailData) => {
    return await apiPut(`/api/zonedetails/${id}`, zoneDetailData, 'Không thể cập nhật chi tiết zone');
  },

  /**
   * Xóa zone detail
   * @param {string|number} id - Zone detail ID
   * @returns {Promise<any>} Kết quả xóa
   */
  deleteZoneDetail: async (id) => {
    return await apiDelete(`/api/zonedetails/${id}`, 'Không thể xóa chi tiết zone');
  }
};

export default zoneDetailService; 

