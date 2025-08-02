import { createService } from './serviceFactory';

// Tạo base service với factory
const baseBlogCategoryService = createService('blogcategories', 'BlogCategory', true);

// Thêm method đặc biệt
const blogCategoryService = {
  // Base CRUD methods từ factory
  ...baseBlogCategoryService,

  // Thêm method getBlogCategories để đảm bảo
  getBlogCategories: async () => {
    const res = await fetch('/api/blogcategories', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách blog categories');
    return data;
  },

  getBlogCategoryById: async (id) => {
    const res = await fetch(`/api/blogcategories/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin blog category');
    return data;
  }
};

export default blogCategoryService; 