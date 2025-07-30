const bookingService = {
  getBookingServices: async () => {
    const res = await fetch('/api/Booking');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách booking');
    return data;
  },
  getBookingServiceById: async (id) => {
    const res = await fetch(`/api/Booking/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin booking');
    return data;
  },
  createBookingService: async (data) => {
    const res = await fetch('/api/Booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo booking thất bại');
    return result;
  },
  updateBookingService: async (id, data) => {
    const res = await fetch(`/api/Booking/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật booking thất bại');
    return result;
  },
  deleteBookingService: async (id) => {
    const res = await fetch(`/api/Booking/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa booking thất bại');
    return result;
  }
};

export default bookingService; 