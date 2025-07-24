import holidays from '../../mock/Holiday';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const holidayService = {
  getHolidays: async () => {
    if (USE_MOCK) {
      return Promise.resolve(holidays);
    }
    const res = await fetch('/api/holidays');
    return res.json();
  },
  getHolidayById: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(holidays.find(h => h.HolidayID === id));
    }
    const res = await fetch(`/api/holidays/${id}`);
    return res.json();
  },
  createHoliday: async (data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...data, HolidayID: holidays.length + 1 });
    }
    const res = await fetch('/api/holidays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateHoliday: async (id, data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...holidays.find(h => h.HolidayID === id), ...data });
    }
    const res = await fetch(`/api/holidays/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteHoliday: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/holidays/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default holidayService; 