const serviceTaskService = {
  getServiceTasks: async () => {
    const res = await fetch('/api/ServiceTask');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách service tasks');
    return data;
  },
  getServiceTaskById: async (id) => {
    const res = await fetch(`/api/ServiceTask/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin service task');
    return data;
  },
  createServiceTask: async (data) => {
    const res = await fetch('/api/ServiceTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo service task thất bại');
    return result;
  },
  updateServiceTask: async (id, data) => {
    const res = await fetch(`/api/ServiceTask/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật service task thất bại');
    return result;
  },
  deleteServiceTask: async (id) => {
    const res = await fetch(`/api/ServiceTask/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa service task thất bại');
    return result;
  }
};

export default serviceTaskService; 