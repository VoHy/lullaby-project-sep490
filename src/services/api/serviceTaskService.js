import serviceTasks from '../../mock/ServiceTask';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const serviceTaskService = {
  getServiceTasks: async () => {
    if (USE_MOCK) return Promise.resolve(serviceTasks);
    const res = await fetch('/api/service-tasks');
    return res.json();
  },
  getServiceTaskById: async (id) => {
    if (USE_MOCK) return Promise.resolve(serviceTasks.find(t => t.ServiceTaskID === id));
    const res = await fetch(`/api/service-tasks/${id}`);
    return res.json();
  },
  createServiceTask: async (data) => {
    if (USE_MOCK) return Promise.resolve({ ...data, ServiceTaskID: serviceTasks.length + 1 });
    const res = await fetch('/api/service-tasks', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    return res.json();
  },
  updateServiceTask: async (id, data) => {
    if (USE_MOCK) return Promise.resolve({ ...serviceTasks.find(t => t.ServiceTaskID === id), ...data });
    const res = await fetch(`/api/service-tasks/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteServiceTask: async (id) => {
    if (USE_MOCK) return Promise.resolve(true);
    const res = await fetch(`/api/service-tasks/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default serviceTaskService; 