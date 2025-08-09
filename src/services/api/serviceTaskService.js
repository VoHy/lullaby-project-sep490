import { getAuthHeaders } from './serviceUtils';

// Tạo base service với factory

// Thêm method đặc biệt
const serviceTaskService = {  // Thêm method getServiceTasks để đảm bảo
  getServiceTasks: async () => {
    const res = await fetch('/api/servicetasks/getall', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách service tasks');
    return data;
  },

  getServiceTaskById: async (id) => {
    const res = await fetch(`/api/servicetasks/get/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin service task');
    return data;
  },

  // Get by package
  getServiceTasksByPackage: async (packageServiceId) => {
    const res = await fetch(`/api/servicetasks/getbypackage/${packageServiceId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy service tasks theo package');
    return data;
  },

  // Soft delete service task
  softDeleteServiceTask: async (id, data) => {
    const res = await fetch(`/api/servicetasks/softdelete/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Soft delete service task thất bại');
    return result;
  },

  // Create service task
  createServiceTask: async (data) => {
    // Accept either the exact backend schema or a single-task shorthand
    const hasArraySchema = Array.isArray(data?.childServiceTasks) && data?.package_ServiceID;
    let payload = data;

    if (!hasArraySchema) {
      const packageId = Number(
        data?.package_ServiceID ?? data?.packageServiceID ?? data?.packageServiceId
      );
      const childId = Number(
        data?.child_ServiceID ?? data?.childServiceID ?? data?.childServiceId
      );
      const taskOrder = Number(data?.taskOrder ?? 1);
      const quantity = Number(data?.quantity ?? 1);

      payload = {
        package_ServiceID: packageId,
        childServiceTasks: [
          {
            child_ServiceID: childId,
            taskOrder,
            quantity
          }
        ]
      };
    }

    const res = await fetch('/api/servicetasks/create', {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo service task thất bại');
    return result;
  },

  // Delete service task
  deleteServiceTask: async (id) => {
    const res = await fetch(`/api/servicetasks/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa service task thất bại');
    return result;
  }
};

export default serviceTaskService; 

