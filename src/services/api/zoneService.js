import zones from '../../mock/Zone';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const zoneService = {
  getZones: async () => {
    if (USE_MOCK) {
      return Promise.resolve(zones);
    }
    const res = await fetch('/api/zones');
    return res.json();
  },
  getZoneById: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(zones.find(z => z.ZoneID === id));
    }
    const res = await fetch(`/api/zones/${id}`);
    return res.json();
  },
  createZone: async (data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...data, ZoneID: zones.length + 1 });
    }
    const res = await fetch('/api/zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateZone: async (id, data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...zones.find(z => z.ZoneID === id), ...data });
    }
    const res = await fetch(`/api/zones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteZone: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/zones/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default zoneService; 