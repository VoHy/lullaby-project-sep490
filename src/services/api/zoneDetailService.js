import { getAuthHeaders } from './serviceUtils';


const zoneDetailService = {  // Thêm method getZoneDetails riêng để đảm bảo
  getZoneDetails: async () => {
    const res = await fetch('/api/zonedetails/getall', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách zone details');
    return data;
  },

  // Thêm method getAll để đảm bảo tương thích
  getAll: async () => {
    const res = await fetch('/api/zonedetails/getall', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách zone details');
    return data;
  }
};

export default zoneDetailService; 

