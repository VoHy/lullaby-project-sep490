import { bookings } from '../../mock/Booking';

export const bookingService = {
  createBooking: async (bookingData) => Promise.resolve({ ...bookingData, booking_id: bookings.length + 1 }),
  getBookings: async () => Promise.resolve(bookings),
  getBookingById: async (bookingId) => Promise.resolve(bookings.find(b => b.booking_id === bookingId)),
  updateBooking: async (bookingId, data) => Promise.resolve({ ...bookings.find(b => b.booking_id === bookingId), ...data }),
  deleteBooking: async (bookingId) => Promise.resolve(true),
};

export default bookingService; 