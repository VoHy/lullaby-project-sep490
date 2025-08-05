import { createService } from './serviceFactory';

// Tạo base service với factory
const baseNursingSpecialistServiceTypeService = createService('nursingspecialist-servicetypes', 'NursingSpecialistServiceType', true);

// Thêm method đặc biệt
const nursingSpecialistServiceTypeService = {
  // Base CRUD methods từ factory
  ...baseNursingSpecialistServiceTypeService,

  // Get by nursing ID
  getServiceTypesByNursingId: async (nursingId) => {
    const res = await fetch(`/api/nursingspecialist-servicetypes/getbynursing/${nursingId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy service types theo nursing ID');
    return data;
  },

  // Get by service ID
  getServiceTypesByServiceId: async (serviceId) => {
    const res = await fetch(`/api/nursingspecialist-servicetypes/getbyservice/${serviceId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy service types theo service ID');
    return data;
  }
};

export default nursingSpecialistServiceTypeService; 