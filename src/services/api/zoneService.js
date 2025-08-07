import { getAuthHeaders } from './serviceUtils';

// Tạo base service với factory

// Thêm method đặc biệt
const zoneService = {  // Count method
  getZoneCount: async () => {
    const res = await fetch('/api/zones/count', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng zones');
    return data;
  },

  // Thêm method getZones để đảm bảo
  getZones: async () => {
    const res = await fetch('/api/zones/getall', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách zones');
    return data;
  }
};

export default zoneService; 

