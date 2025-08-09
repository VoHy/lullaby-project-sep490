import { getAuthHeaders } from './serviceUtils';

const zoneService = {

  getZoneCount: async () => {
    const res = await fetch('/api/zones/count', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng zones');
    return data;
  },

  getZones: async () => {
    const res = await fetch('/api/zones/getall', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách zones');
    return data;
  },

  getZoneById: async (id) => {
    const res = await fetch(`/api/zones/get/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin zone');
    return data;
  },

  createZone: async (zone) => {
    const res = await fetch('/api/zones/create', {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json-patch+json' },
      body: JSON.stringify(zone)
    }); 
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể tạo zone');
    return data;
  },

  updateZone: async (id, zone) => {
    const res = await fetch(`/api/zones/update/${id}`, {  
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json-patch+json' },
      body: JSON.stringify(zone)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể cập nhật zone');
    return data;
  },

  deleteZone: async (id) => {
    const res = await fetch(`/api/zones/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể xóa zone');
    return data;
  }
}

export default zoneService;