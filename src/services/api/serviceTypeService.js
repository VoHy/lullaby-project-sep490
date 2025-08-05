import { createService } from './serviceFactory';

// Tạo base service với factory
const baseServiceTypeService = createService('servicetypes', 'ServiceType', true);

// Thêm method đặc biệt
const serviceTypeService = {
  // Base CRUD methods từ factory
  ...baseServiceTypeService,

  // Thêm method getServiceTypes để đảm bảo
  getServiceTypes: async () => {
    const res = await fetch('/api/servicetypes/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách service types');
    return data;
  },

  // Alias cho getAllServiceTypes để tương thích
  getAllServiceTypes: async () => {
    const res = await fetch('/api/servicetypes/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách service types');
    return data;
  },

  // Create service type
  createServiceType: async (data) => {
    const res = await fetch('/api/servicetypes/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo service type thất bại');
    return result;
  },

  // Update service type
  updateServiceType: async (id, data) => {
    const res = await fetch(`/api/servicetypes/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật service type thất bại');
    return result;
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
  softDeleteServiceType: async (id, data = {}) => {
    try {
      const res = await fetch(`/api/servicetypes/softdelete/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorText = await res.text();
        try {
          const errorData = JSON.parse(errorText);
          
          // Nếu dịch vụ đã được đánh dấu removed, không coi là lỗi
          if (errorData.error && errorData.error.includes('already marked as removed')) {
            console.log('Service already marked as removed, treating as success');
            return { message: 'Service type already deleted', alreadyDeleted: true };
          }
          
          throw new Error(errorData.error || 'Soft delete service type thất bại');
        } catch (parseError) {
          throw new Error(`Server error: ${res.status} - ${errorText.substring(0, 100)}`);
        }
      }

      const responseText = await res.text();
      if (!responseText) {
        return { message: 'Service type deleted successfully' };
      }

      try {
        const result = JSON.parse(responseText);
        return result;
      } catch (parseError) {
        console.warn('Response is not valid JSON, treating as success');
        return { message: 'Service type deleted successfully' };
      }
    } catch (error) {
      console.error('Soft delete error:', error);
      throw error;
    }
  }
};

export default serviceTypeService; 