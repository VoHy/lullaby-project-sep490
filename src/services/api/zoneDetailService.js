import { createService } from './serviceFactory';

const baseZoneDetailService = createService('zonedetails', 'ZoneDetail', true);

const zoneDetailService = {
  ...baseZoneDetailService,
  
  // Thêm method getZoneDetails riêng để đảm bảo
  getZoneDetails: async () => {
    const res = await fetch('/api/zonedetails/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách zone details');
    return data;
  },

  // Thêm method getAll để đảm bảo tương thích
  getAll: async () => {
    const res = await fetch('/api/zonedetails/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách zone details');
    return data;
  }
};

export default zoneDetailService; 