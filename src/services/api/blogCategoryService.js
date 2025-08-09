import { getAuthHeaders } from './serviceUtils';

// Tạo base service với factory

// Thêm method đặc biệt
const blogCategoryService = {  // Get all blog categories
  getAllBlogCategories: async () => {
    const res = await fetch('/api/blogcategory/getall', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách blog categories');
    return data;
  },

  // Get blog category by ID
  getBlogCategoryById: async (blogCategoryId) => {
    const res = await fetch(`/api/blogcategory/${blogCategoryId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin blog category');
    return data;
  },

  // Create new blog category
  createBlogCategory: async (blogCategoryData) => {
    const res = await fetch('/api/blogcategory', {
      method: 'POST',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xóa blog category thất bại');
    return data;
  }
};

export default blogCategoryService; 

