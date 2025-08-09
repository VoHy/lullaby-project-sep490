import { getAuthHeaders } from './serviceUtils';

// Tạo base service với factory

// Thêm method đặc biệt
const nursingSpecialistServiceTypeService = {  // Get by nursing ID
  getServiceTypesByNursingId: async (nursingId) => {
    const res = await fetch(`/api/nursingspecialist-servicetypes/getbynursing/${nursingId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy service types theo nursing ID');
    return data;
  },

  // Get by service ID
  getServiceTypesByServiceId: async (serviceId) => {
    const res = await fetch(`/api/nursingspecialist-servicetypes/getbyservice/${serviceId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy service types theo service ID');
    return data;
  }
};

export default nursingSpecialistServiceTypeService; 

