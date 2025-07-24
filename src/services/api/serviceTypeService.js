import serviceTypes from '../../mock/ServiceType';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const serviceTypeService = {
  getServiceTypes: async () => {
    if (USE_MOCK) {
      return Promise.resolve(serviceTypes);
    }
    const res = await fetch('/api/service-types');
    return res.json();
  },
  getServiceTypeById: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(serviceTypes.find(s => s.ServiceID === id));
    }
    const res = await fetch(`/api/service-types/${id}`);
    return res.json();
  },
  createServiceType: async (data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...data, ServiceID: serviceTypes.length + 1 });
    }
    const res = await fetch('/api/service-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateServiceType: async (id, data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...serviceTypes.find(s => s.ServiceID === id), ...data });
    }
    const res = await fetch(`/api/service-types/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteServiceType: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/service-types/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default serviceTypeService; 