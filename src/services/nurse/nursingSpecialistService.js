import nursingSpecialists from '../../mock/NursingSpecialist';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const nursingSpecialistService = {
  getNursingSpecialists: async () => {
    if (USE_MOCK) {
      return Promise.resolve(nursingSpecialists);
    }
    const res = await fetch('/api/nursing-specialists');
    return res.json();
  },
  getNursingSpecialistById: async (nursingId) => {
    if (USE_MOCK) {
      return Promise.resolve(nursingSpecialists.find(n => n.NursingID === nursingId));
    }
    const res = await fetch(`/api/nursing-specialists/${nursingId}`);
    return res.json();
  },
  updateNursingSpecialist: async (nursingId, data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...nursingSpecialists.find(n => n.NursingID === nursingId), ...data });
    }
    const res = await fetch(`/api/nursing-specialists/${nursingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteNursingSpecialist: async (nursingId) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/nursing-specialists/${nursingId}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default nursingSpecialistService; 