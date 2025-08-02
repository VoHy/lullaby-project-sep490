import { createService } from './serviceFactory';

// Tạo base service với factory
const baseHolidayService = createService('holidays', 'Holiday', true);

// Thêm method đặc biệt
const holidayService = {
  // Base CRUD methods từ factory
  ...baseHolidayService,

  // Thêm method getHolidays để đảm bảo
  getHolidays: async () => {
    const res = await fetch('/api/holidays', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách holidays');
    return data;
  },

  getHolidayById: async (id) => {
    const res = await fetch(`/api/holidays/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin holiday');
    return data;
  }
};

export default holidayService; 