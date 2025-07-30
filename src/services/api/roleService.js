const roleService = {
  getRoles: async () => {
    const res = await fetch('/api/roles/getall');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách roles');
    return data;
  },
  getRoleById: async (id) => {
    const res = await fetch(`/api/roles/get/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin role');
    return data;
  },
  createRole: async (data) => {
    const res = await fetch('/api/roles/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo role thất bại');
    return result;
  },
  updateRole: async (id, data) => {
    const res = await fetch(`/api/roles/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật role thất bại');
    return result;
  },
  deleteRole: async (id) => {
    const res = await fetch(`/api/roles/delete/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa role thất bại');
    return result;
  }
};

export default roleService; 