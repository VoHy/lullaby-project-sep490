
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const zoneService = {
  // Zone APIs
  getZones: async () => {
    const res = await fetch('/api/zones/getall');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách zones');
    return Array.isArray(data) ? data : data.zones || data || [];
  },

  // Alias cho getAllZones (để tương thích)
  getAllZones: async () => {
    const res = await fetch('/api/zones/getall');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách zones');
    return Array.isArray(data) ? data : data.zones || data || [];
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
    const res = await fetch(`/api/zones/delete/${id}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa zone thất bại');
    return result;
  },
};
export default zoneService; 