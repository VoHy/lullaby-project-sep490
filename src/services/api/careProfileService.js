import careProfiles from '../../mock/CareProfile';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const careProfileService = {
  getCareProfiles: async () => {
    if (USE_MOCK) return Promise.resolve(careProfiles);
    const res = await fetch('/api/care-profiles');
    return res.json();
  },
  getCareProfileById: async (id) => {
    if (USE_MOCK) return Promise.resolve(careProfiles.find(c => c.CareID === id));
    const res = await fetch(`/api/care-profiles/${id}`);
    return res.json();
  },
  createCareProfile: async (data) => {
    if (USE_MOCK) return Promise.resolve({ ...data, CareID: careProfiles.length + 1 });
    const res = await fetch('/api/care-profiles', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    return res.json();
  },
  updateCareProfile: async (id, data) => {
    if (USE_MOCK) return Promise.resolve({ ...careProfiles.find(c => c.CareID === id), ...data });
    const res = await fetch(`/api/care-profiles/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteCareProfile: async (id) => {
    if (USE_MOCK) return Promise.resolve(true);
    const res = await fetch(`/api/care-profiles/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default careProfileService; 