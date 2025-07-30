const serviceTypeService = {
  getServiceTypes: async () => {
    const res = await fetch('/api/ServiceType');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách service types');
    return data;
  },
  getServiceTypeById: async (id) => {
    const res = await fetch(`/api/ServiceType/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin service type');
    return data;
  },
  createServiceType: async (data) => {
    const res = await fetch('/api/ServiceType', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo service type thất bại');
    return result;
  },
  updateServiceType: async (id, data) => {
    const res = await fetch(`/api/ServiceType/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật service type thất bại');
    return result;
  },
  deleteServiceType: async (id) => {
    const res = await fetch(`/api/ServiceType/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa service type thất bại');
    return result;
  }
};

export default serviceTypeService; 