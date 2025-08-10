// Blog Category Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.BLOG_CATEGORIES; // '/BlogCategory'

const blogCategoryService = {
  getAllBlogCategories: async () => apiGet(`${base}/GetAll`, 'Không thể lấy danh mục blog'),
  getBlogCategoryById: async (id) => apiGet(`${base}/${id}`, 'Không thể lấy thông tin danh mục'),
  createBlogCategory: async (data) => apiPost(`${base}`, data, 'Không thể tạo danh mục'),
  updateBlogCategory: async (id, data) => apiPut(`${base}/${id}`, data, 'Không thể cập nhật danh mục'),
  deleteBlogCategory: async (id) => apiDelete(`${base}/${id}`, 'Không thể xóa danh mục'),
};

export default blogCategoryService;


