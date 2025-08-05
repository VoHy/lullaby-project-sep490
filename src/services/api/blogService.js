import { createService } from './serviceFactory';

// Tạo base service với factory
const baseBlogService = createService('blog', 'Blog', true);

// Thêm method đặc biệt
const blogService = {
  // Base CRUD methods từ factory
  ...baseBlogService,

  // Get all blogs
  getAllBlogs: async () => {
    const res = await fetch('/api/blog/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách blog');
    return data;
  },

  // Get blog by ID
  getBlogById: async (blogId) => {
    const res = await fetch(`/api/blog/${blogId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin blog');
    return data;
  },

  // Create new blog
  createBlog: async (blogData) => {
    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: blogData.title,
        blogCategoryID: blogData.blogCategoryID,
        content: blogData.content,
        image: blogData.image,
        createdByID: blogData.createdByID
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Tạo blog thất bại');
    return data;
  },

  // Update blog
  updateBlog: async (blogId, blogData) => {
    const res = await fetch(`/api/blog/update/${blogId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: blogData.title,
        blogCategoryID: blogData.blogCategoryID,
        content: blogData.content,
        image: blogData.image,
        createdByID: blogData.createdByID
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Cập nhật blog thất bại');
    return data;
  },

  // Delete blog
  deleteBlog: async (blogId) => {
    const res = await fetch(`/api/blog/${blogId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xóa blog thất bại');
    return data;
  },

  // Activate blog
  activateBlog: async (blogId) => {
    const res = await fetch(`/api/blog/active/${blogId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Kích hoạt blog thất bại');
    return data;
  },

  // Deactivate blog
  deactivateBlog: async (blogId) => {
    const res = await fetch(`/api/blog/inactive/${blogId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Vô hiệu hóa blog thất bại');
    return data;
  }
};

export default blogService; 