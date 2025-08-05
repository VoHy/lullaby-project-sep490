import { createService } from './serviceFactory';

// Tạo base service với factory
const baseServiceTaskService = createService('servicetasks', 'ServiceTask', true);

// Thêm method đặc biệt
const serviceTaskService = {
  // Base CRUD methods từ factory
  ...baseServiceTaskService,

  // Thêm method getServiceTasks để đảm bảo
  getServiceTasks: async () => {
    const res = await fetch('/api/servicetasks/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách service tasks');
    return data;
  },

  getServiceTaskById: async (id) => {
    const res = await fetch(`/api/servicetasks/get/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin service task');
    return data;
  },

  // Get by package
  getServiceTasksByPackage: async (packageServiceId) => {
    const res = await fetch(`/api/servicetasks/getbypackage/${packageServiceId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy service tasks theo package');
    return data;
  },

  // Soft delete service task
  softDeleteServiceTask: async (id, data) => {
    const res = await fetch(`/api/servicetasks/softdelete/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Soft delete service task thất bại');
    return result;
  },

  // Create service task
  createServiceTask: async (data) => {
    const res = await fetch('/api/servicetasks/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo service task thất bại');
    return result;
  },

  // Delete service task
  deleteServiceTask: async (id) => {
    const res = await fetch(`/api/servicetasks/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa service task thất bại');
    return result;
  }
};

export default serviceTaskService; 