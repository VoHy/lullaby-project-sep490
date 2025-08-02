import { createService } from './serviceFactory';

// Tạo base service với factory
const baseWorkScheduleService = createService('workschedules', 'WorkSchedule', true);

// Thêm method đặc biệt
const workScheduleService = {
  // Base CRUD methods từ factory
  ...baseWorkScheduleService,

  // Thêm method getWorkSchedules để đảm bảo
  getWorkSchedules: async () => {
    const res = await fetch('/api/workschedules', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách work schedules');
    return data;
  },

  getWorkScheduleById: async (id) => {
    const res = await fetch(`/api/workschedules/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin work schedule');
    return data;
  }
};

export default workScheduleService; 