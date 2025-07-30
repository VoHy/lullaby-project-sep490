const relativesService = {
  getRelatives: async () => {
    const res = await fetch('/api/Relative');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách relatives');
    return data;
  },
  getRelativeById: async (id) => {
    const res = await fetch(`/api/Relative/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin relative');
    return data;
  },
  createRelative: async (data) => {
    const res = await fetch('/api/Relative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo relative thất bại');
    return result;
  },
  updateRelative: async (id, data) => {
    const res = await fetch(`/api/Relative/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật relative thất bại');
    return result;
  },
  deleteRelative: async (id) => {
    const res = await fetch(`/api/Relative/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa relative thất bại');
    return result;
  }
};

export default relativesService; 