const zoneDetailService = {
  getZoneDetails: async () => {
    const res = await fetch('/api/zonedetails/getall');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách zone details');
    return data;
  },
  getZoneDetailById: async (id) => {
    const res = await fetch(`/api/zonedetails/get/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin zone detail');
    return data;
  },
  createZoneDetail: async (data) => {
    const res = await fetch('/api/zonedetails/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo zone detail thất bại');
    return result;
  },
  updateZoneDetail: async (id, data) => {
    const res = await fetch(`/api/zonedetails/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật zone detail thất bại');
    return result;
  },
  deleteZoneDetail: async (id) => {
    const res = await fetch(`/api/zonedetails/delete/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa zone detail thất bại');
    return result;
  }
};

export default zoneDetailService; 