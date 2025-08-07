import { getAuthHeaders } from './serviceUtils';

// Tạo base service với factory

// Thêm method đặc biệt
const holidayService = {  // Get all holidays
  getAllHolidays: async () => {
    const res = await fetch('/api/holiday/getall', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách holidays');
    return data;
  },

  // Get holiday by ID
  getHolidayById: async (holidayId) => {
    const res = await fetch(`/api/holiday/${holidayId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin holiday');
    return data;
  },

  // Create new holiday
  createHoliday: async (holidayData) => {
    const res = await fetch('/api/holiday', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(holidayData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Tạo holiday thất bại');
    return data;
  },

  // Update holiday
  updateHoliday: async (holidayId, holidayData) => {
    const res = await fetch(`/api/holiday/${holidayId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(holidayData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Cập nhật holiday thất bại');
    return data;
  },

  // Delete holiday
  deleteHoliday: async (holidayId) => {
    const res = await fetch(`/api/holiday/${holidayId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xóa holiday thất bại');
    return data;
  }
};

export default holidayService; 

