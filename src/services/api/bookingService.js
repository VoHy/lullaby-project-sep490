import bookingServices from '../../mock/BookingService';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const bookingService = {
  getBookingServices: async () => {
    if (USE_MOCK) {
      return Promise.resolve(bookingServices);
    }
    const res = await fetch('/api/booking-services');
    return res.json();
  },
  getBookingServiceById: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(bookingServices.find(b => b.BookingServiceID === id));
    }
    const res = await fetch(`/api/booking-services/${id}`);
    return res.json();
  },
  createBookingService: async (data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...data, BookingServiceID: bookingServices.length + 1 });
    }
    const res = await fetch('/api/booking-services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateBookingService: async (id, data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...bookingServices.find(b => b.BookingServiceID === id), ...data });
    }
    const res = await fetch(`/api/booking-services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteBookingService: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/booking-services/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default bookingService; 