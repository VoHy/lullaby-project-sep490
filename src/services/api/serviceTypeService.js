import { createService } from './serviceFactory';

// Tạo base service với factory
const baseServiceTypeService = createService('servicetypes', 'ServiceType', true);

// Thêm method đặc biệt
const serviceTypeService = {
  // Base CRUD methods từ factory
  ...baseServiceTypeService,

  // Thêm method getServiceTypes để đảm bảo
  getServiceTypes: async () => {
    const res = await fetch('/api/servicetypes', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách service types');
    return data;
  },

  // Count method
  getServiceTypeCount: async () => {
    const res = await fetch('/api/servicetypes/count', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy số lượng service types');
    return data;
  },

  // Get by major
  getServiceTypesByMajor: async (major) => {
    const res = await fetch(`/api/servicetypes/getbymajor/${major}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy service types theo major');
    return data;
  },

  // Create package
  createServiceTypePackage: async (data) => {
    const res = await fetch('/api/servicetypes/createpackage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo package service type thất bại');
    return result;
  },

  // Activate service type
  activateServiceType: async (id, data) => {
    const res = await fetch(`/api/servicetypes/activate/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Kích hoạt service type thất bại');
    return result;
  },

  // Soft delete service type
  softDeleteServiceType: async (id, data) => {
    const res = await fetch(`/api/servicetypes/softdelete/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Soft delete service type thất bại');
    return result;
  }
};

export default serviceTypeService; 