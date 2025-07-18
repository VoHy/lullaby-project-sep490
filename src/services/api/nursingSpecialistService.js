import nursingSpecialists from '../../mock/NursingSpecialist';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const nursingSpecialistService = {
  getNursingSpecialists: async () => {
    if (USE_MOCK) return Promise.resolve(nursingSpecialists);
    const res = await fetch('/api/nursing-specialists');
    return res.json();
  },
  getNursingSpecialistById: async (id) => {
    if (USE_MOCK) return Promise.resolve(nursingSpecialists.find(n => n.NursingID === id));
    const res = await fetch(`/api/nursing-specialists/${id}`);
    return res.json();
  },
  createNursingSpecialist: async (data) => {
    if (USE_MOCK) return Promise.resolve({ ...data, NursingID: nursingSpecialists.length + 1 });
    const res = await fetch('/api/nursing-specialists', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    return res.json();
  },
  updateNursingSpecialist: async (id, data) => {
    if (USE_MOCK) return Promise.resolve({ ...nursingSpecialists.find(n => n.NursingID === id), ...data });
    const res = await fetch(`/api/nursing-specialists/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteNursingSpecialist: async (id) => {
    if (USE_MOCK) return Promise.resolve(true);
    const res = await fetch(`/api/nursing-specialists/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default nursingSpecialistService; 