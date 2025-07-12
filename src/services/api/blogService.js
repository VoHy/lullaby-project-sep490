import axiosInstance from '../http/axios';

const BLOG_ENDPOINTS = {
  LIST: '/api/Blog',
  DETAIL: '/api/Blog', // + /{id}
};

const blogService = {
  getBlogs: async (params = {}) => {
    const response = await axiosInstance.get(BLOG_ENDPOINTS.LIST, { params });
    return response.data;
  },
  getBlogById: async (id) => {
    const response = await axiosInstance.get(`${BLOG_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
  createBlog: async (data) => {
    const response = await axiosInstance.post(BLOG_ENDPOINTS.LIST, data);
    return response.data;
  },
  updateBlog: async (id, data) => {
    const response = await axiosInstance.put(`${BLOG_ENDPOINTS.DETAIL}/${id}`, data);
    return response.data;
  },
  deleteBlog: async (id) => {
    const response = await axiosInstance.delete(`${BLOG_ENDPOINTS.DETAIL}/${id}`);
    return response.data;
  },
};

export default blogService; 