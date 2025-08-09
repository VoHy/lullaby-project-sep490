// Blog Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.BLOGS; // '/Blog'

const blogService = {
  getAllBlogs: async () => apiGet(`${base}/GetAll`, 'Không thể lấy danh sách blog'),
  getBlogById: async (id) => apiGet(`${base}/${id}`, 'Không thể lấy thông tin blog'),
  createBlog: async (data) => apiPost(`${base}`, data, 'Không thể tạo blog'),
  updateBlog: async (id, data) => apiPut(`${base}/Update/${id}`, data, 'Không thể cập nhật blog'),
  activateBlog: async (id) => apiPut(`${base}/Active/${id}`, {}, 'Không thể kích hoạt blog'),
  deactivateBlog: async (id) => apiPut(`${base}/Inactive/${id}`, {}, 'Không thể hủy kích hoạt blog'),
  deleteBlog: async (id) => apiDelete(`${base}/${id}`, 'Không thể xóa blog'),
};

export default blogService;


