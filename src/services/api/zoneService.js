
const zoneService = {
  getZones: async () => {
    const res = await fetch('/api/zones/getall');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách zones');
    return data;
  },
  getZoneById: async (id) => {
    const res = await fetch(`/api/zones/get/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin zone');
    return data;
  },
  createZone: async (data) => {
    const res = await fetch('/api/zones/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo zone thất bại');
    return result;
  },
  updateZone: async (id, data) => {
    const res = await fetch(`/api/zones/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật zone thất bại');
    return result;
  },
  deleteZone: async (id) => {
    const res = await fetch(`/api/zones/delete/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa zone thất bại');
    return result;
  }
};

export default zoneService; 