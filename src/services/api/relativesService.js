import relatives from '../../mock/Relatives';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const relativesService = {
  getRelatives: async () => {
    if (USE_MOCK) return Promise.resolve(relatives);
    const res = await fetch('/api/relatives');
    return res.json();
  },
  getRelativeById: async (id) => {
    if (USE_MOCK) return Promise.resolve(relatives.find(r => r.RelativeID === id));
    const res = await fetch(`/api/relatives/${id}`);
    return res.json();
  },
  createRelative: async (data) => {
    if (USE_MOCK) return Promise.resolve({ ...data, RelativeID: relatives.length + 1 });
    const res = await fetch('/api/relatives', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    return res.json();
  },
  updateRelative: async (id, data) => {
    if (USE_MOCK) return Promise.resolve({ ...relatives.find(r => r.RelativeID === id), ...data });
    const res = await fetch(`/api/relatives/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteRelative: async (id) => {
    if (USE_MOCK) return Promise.resolve(true);
    const res = await fetch(`/api/relatives/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default relativesService; 