const customerTaskService = {
  getCustomerTasks: async () => {
    const res = await fetch('/api/CustomizeTask');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách customer tasks');
    return data;
  },
  getCustomerTaskById: async (id) => {
    const res = await fetch(`/api/CustomizeTask/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin customer task');
    return data;
  },
  createCustomerTask: async (data) => {
    const res = await fetch('/api/CustomizeTask', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo customer task thất bại');
    return result;
  },
  updateCustomerTask: async (id, data) => {
    const res = await fetch(`/api/CustomizeTask/${id}`, {
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật customer task thất bại');
    return result;
  },
  deleteCustomerTask: async (id) => {
    const res = await fetch(`/api/CustomizeTask/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa customer task thất bại');
    return result;
  }
};

export default customerTaskService; 