const workScheduleService = {
  getWorkSchedules: async () => {
    const res = await fetch('/api/WorkSchedule');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách work schedule');
    return data;
  },
  getWorkScheduleById: async (id) => {
    const res = await fetch(`/api/WorkSchedule/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin work schedule');
    return data;
  },
  createWorkSchedule: async (data) => {
    const res = await fetch('/api/WorkSchedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo work schedule thất bại');
    return result;
  },
  updateWorkSchedule: async (id, data) => {
    const res = await fetch(`/api/WorkSchedule/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật work schedule thất bại');
    return result;
  },
  deleteWorkSchedule: async (id) => {
    const res = await fetch(`/api/WorkSchedule/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa work schedule thất bại');
    return result;
  }
};

export default workScheduleService; 