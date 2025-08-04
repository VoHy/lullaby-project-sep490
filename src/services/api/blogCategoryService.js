import { createService } from './serviceFactory';

// Tạo base service với factory
const baseBlogCategoryService = createService('blogcategory', 'BlogCategory', true);

// Thêm method đặc biệt
const blogCategoryService = {
  // Base CRUD methods từ factory
  ...baseBlogCategoryService,

  // Get all blog categories
  getAllBlogCategories: async () => {
    const res = await fetch('/api/blogcategory/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách blog categories');
    return data;
  },

  // Get blog category by ID
  getBlogCategoryById: async (blogCategoryId) => {
    const res = await fetch(`/api/blogcategory/${blogCategoryId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin blog category');
    return data;
  },

  // Create new blog category
  createBlogCategory: async (blogCategoryData) => {
    const res = await fetch('/api/blogcategory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryName: blogCategoryData.categoryName,
        description: blogCategoryData.description
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Tạo blog category thất bại');
    return data;
  },

  // Update blog category
  updateBlogCategory: async (blogCategoryId, blogCategoryData) => {
    const res = await fetch(`/api/blogcategory/${blogCategoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryName: blogCategoryData.categoryName,
        description: blogCategoryData.description
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Cập nhật blog category thất bại');
    return data;
  },

  // Delete blog category
  deleteBlogCategory: async (blogCategoryId) => {
    const res = await fetch(`/api/blogcategory/${blogCategoryId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xóa blog category thất bại');
    return data;
  }
};

export default blogCategoryService; 