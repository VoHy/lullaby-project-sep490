const blogService = {
  getBlogs: async () => {
    const res = await fetch('/api/Blog');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách blog');
    return data;
  },
  getBlogById: async (id) => {
    const res = await fetch(`/api/Blog/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin blog');
    return data;
  },
  createBlog: async (data) => {
    const res = await fetch('/api/Blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo blog thất bại');
    return result;
  },
  updateBlog: async (id, data) => {
    const res = await fetch(`/api/Blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật blog thất bại');
    return result;
  },
  deleteBlog: async (id) => {
    const res = await fetch(`/api/Blog/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa blog thất bại');
    return result;
  }
};

export default blogService; 