import { getAuthHeaders } from "./serviceUtils";

const zoneDetailService = {
  getZoneDetailCount: async () => {
    const res = await fetch('/api/zonedetails/count', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng zone details');
    return data;
  },
    
  getZoneDetails: async () => {
    const res = await fetch('/api/zonedetails/getall', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách zone details');
    return data;
  },

  getZoneDetailById: async (id) => {
    const res = await fetch(`/api/zonedetails/get/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin zone detail');
    return data;
  },

  createZoneDetail: async (zoneDetail) => {
    const res = await fetch('/api/zonedetails/create', {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(zoneDetail)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể tạo zone detail');
    return data;
  },

  updateZoneDetail: async (id, zoneDetail) => {
    const res = await fetch(`/api/zonedetails/update/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json-patch+json' },
      body: JSON.stringify(zoneDetail)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể cập nhật zone detail');
    return data;
  },

  deleteZoneDetail: async (id) => {
    const res = await fetch(`/api/zonedetails/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể xóa zone detail');
    return data;
  }
}

export default zoneDetailService;