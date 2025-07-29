// import careProfiles from '../../mock/CareProfile'; // ⚠️ Không dùng mock khi dùng API thật

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const careProfileService = {
  getCareProfiles: async () => {
    if (USE_MOCK) return Promise.resolve([]); // hoặc careProfiles nếu muốn test mock
    const res = await fetch('/api/careprofiles/getall');
    const data = await res.json();
    console.log('CareProfiles API response:', data);
    return Array.isArray(data) ? data : data.careProfiles || [];
  },
  getCareProfileById: async (id) => {
    if (USE_MOCK) return Promise.resolve(null); // hoặc careProfiles.find(...)
    const res = await fetch(`/api/careprofiles/get/${id}`);
    return res.json();
  },
  createCareProfile: async (data) => {
    const response = await fetch('/api/careprofiles/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Tạo hồ sơ thất bại');
    return result;
  },
  updateCareProfile: async (id, data) => {
    if (USE_MOCK) return Promise.resolve({ id, ...data });
    const res = await fetch(`/api/careprofiles/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Không thể cập nhật hồ sơ');
    return result;
  },
  deleteCareProfile: async (id) => {
    if (USE_MOCK) return Promise.resolve(true);
    const res = await fetch(`/api/careprofiles/delete/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default careProfileService; 