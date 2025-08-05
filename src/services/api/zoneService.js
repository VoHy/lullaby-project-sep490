import { createService } from './serviceFactory';

// Tạo base service với factory
const baseZoneService = createService('zones', 'Zone', true);

// Thêm method đặc biệt
const zoneService = {
  // Base CRUD methods từ factory
  ...baseZoneService,

  // Count method
  getZoneCount: async () => {
    const res = await fetch('/api/zones/count', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng zones');
    return data;
  },

  // Thêm method getZones để đảm bảo
  getZones: async () => {
    const res = await fetch('/api/zones/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách zones');
    return data;
  }
};

export default zoneService; 