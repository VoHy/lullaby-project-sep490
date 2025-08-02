import { createService } from './serviceFactory';

// Tạo base service với factory
const baseBlogService = createService('blogs', 'Blog', true);

// Thêm method đặc biệt
const blogService = {
  // Base CRUD methods từ factory
  ...baseBlogService,

  // Thêm method getBlogs để đảm bảo
  getBlogs: async () => {
    const res = await fetch('/api/blogs', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách blogs');
    return data;
  },

  getBlogById: async (id) => {
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin blog');
    return data;
  }
};

export default blogService; 