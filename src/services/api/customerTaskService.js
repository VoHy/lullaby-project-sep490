import customerTasks from '../../mock/CustomerTask';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const customerTaskService = {
  getCustomerTasks: async () => {
    if (USE_MOCK) return Promise.resolve(customerTasks);
    const res = await fetch('/api/customer-tasks');
    return res.json();
  },
  getCustomerTaskById: async (id) => {
    if (USE_MOCK) return Promise.resolve(customerTasks.find(t => t.CustomerTaskID === id));
    const res = await fetch(`/api/customer-tasks/${id}`);
    return res.json();
  },
  createCustomerTask: async (data) => {
    if (USE_MOCK) return Promise.resolve({ ...data, CustomerTaskID: customerTasks.length + 1 });
    const res = await fetch('/api/customer-tasks', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    return res.json();
  },
  updateCustomerTask: async (id, data) => {
    if (USE_MOCK) return Promise.resolve({ ...customerTasks.find(t => t.CustomerTaskID === id), ...data });
    const res = await fetch(`/api/customer-tasks/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteCustomerTask: async (id) => {
    if (USE_MOCK) return Promise.resolve(true);
    const res = await fetch(`/api/customer-tasks/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default customerTaskService; 