const blogCategoryService = {
  getBlogCategories: async () => {
    const res = await fetch('/api/BlogCategory');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách blog categories');
    return data;
  },
  getBlogCategoryById: async (id) => {
    const res = await fetch(`/api/BlogCategory/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin blog category');
    return data;
  },
  createBlogCategory: async (data) => {
    const res = await fetch('/api/BlogCategory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo blog category thất bại');
    return result;
  },
  updateBlogCategory: async (id, data) => {
    const res = await fetch(`/api/BlogCategory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật blog category thất bại');
    return result;
  },
  deleteBlogCategory: async (id) => {
    const res = await fetch(`/api/BlogCategory/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa blog category thất bại');
    return result;
  }
};

export default blogCategoryService; 