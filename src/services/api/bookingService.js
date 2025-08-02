import { createService } from './serviceFactory';

// Tạo base service với factory
const baseBookingService = createService('bookings', 'Booking', true);

// Thêm method đặc biệt
const bookingService = {
  // Base CRUD methods từ factory
  ...baseBookingService,

  // Thêm method getBookings để đảm bảo
  getBookings: async () => {
    const res = await fetch('/api/bookings', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách bookings');
    return data;
  },

  getBookingById: async (id) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin booking');
    return data;
  }
};

export default bookingService; 