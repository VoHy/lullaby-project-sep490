const holidayService = {
  getHolidays: async () => {
    const res = await fetch('/api/Holiday');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách holidays');
    return data;
  },
  getHolidayById: async (id) => {
    const res = await fetch(`/api/Holiday/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin holiday');
    return data;
  },
  createHoliday: async (data) => {
    const res = await fetch('/api/Holiday', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo holiday thất bại');
    return result;
  },
  updateHoliday: async (id, data) => {
    const res = await fetch(`/api/Holiday/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật holiday thất bại');
    return result;
  },
  deleteHoliday: async (id) => {
    const res = await fetch(`/api/Holiday/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa holiday thất bại');
    return result;
  }
};

export default holidayService; 