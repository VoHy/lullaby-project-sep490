const careProfileService = {
  getCareProfiles: async () => {
    const res = await fetch('/api/careprofiles/getall');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách care profiles');
    return Array.isArray(data) ? data : data.careProfiles || [];
  },
  getCareProfileById: async (id) => {
    const res = await fetch(`/api/careprofiles/get/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin care profile');
    return data;
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
    const res = await fetch(`/api/careprofiles/delete/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Không thể xóa hồ sơ');
    return result;
  }
};

export default careProfileService; 