const customerPackageService = {
  getCustomerPackages: async () => {
    const res = await fetch('/api/CustomizePackage');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách customer packages');
    return data;
  },
  getCustomerPackageById: async (id) => {
    const res = await fetch(`/api/CustomizePackage/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin customer package');
    return data;
  },
  createCustomerPackage: async (data) => {
    const res = await fetch('/api/CustomizePackage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo customer package thất bại');
    return result;
  },
  updateCustomerPackage: async (id, data) => {
    const res = await fetch(`/api/CustomizePackage/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật customer package thất bại');
    return result;
  },
  deleteCustomerPackage: async (id) => {
    const res = await fetch(`/api/CustomizePackage/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa customer package thất bại');
    return result;
  }
};

export default customerPackageService; 