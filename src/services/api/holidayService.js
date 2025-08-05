import { createService } from './serviceFactory';

// Tạo base service với factory
const baseHolidayService = createService('holiday', 'Holiday', true);

// Thêm method đặc biệt
const holidayService = {
  // Base CRUD methods từ factory
  ...baseHolidayService,

  // Get all holidays
  getAllHolidays: async () => {
    const res = await fetch('/api/holiday/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách holidays');
    return data;
  },

  // Get holiday by ID
  getHolidayById: async (holidayId) => {
    const res = await fetch(`/api/holiday/${holidayId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin holiday');
    return data;
  },

  // Create new holiday
  createHoliday: async (holidayData) => {
    const res = await fetch('/api/holiday', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xóa holiday thất bại');
    return data;
  }
};

export default holidayService; 