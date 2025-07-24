import workSchedules from '../../mock/WorkSchedule';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const workScheduleService = {
  getWorkSchedules: async () => {
    if (USE_MOCK) {
      return Promise.resolve(workSchedules);
    }
    const res = await fetch('/api/work-schedules');
    return res.json();
  },
  getWorkScheduleById: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(workSchedules.find(w => w.WorkScheduleID === id));
    }
    const res = await fetch(`/api/work-schedules/${id}`);
    return res.json();
  },
  createWorkSchedule: async (data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...data, WorkScheduleID: workSchedules.length + 1 });
    }
    const res = await fetch('/api/work-schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateWorkSchedule: async (id, data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...workSchedules.find(w => w.WorkScheduleID === id), ...data });
    }
    const res = await fetch(`/api/work-schedules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteWorkSchedule: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/work-schedules/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default workScheduleService; 