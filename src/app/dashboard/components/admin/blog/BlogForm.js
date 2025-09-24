import React, { useEffect, useState } from 'react';
import blogCategoryService from '@/services/api/blogCategoryService';

const BlogForm = ({ blog, onSubmit, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    blogCategoryID: '',
    content: '',
    image: '',
    createdByID: 1 // Mặc định là admin
  });

  useEffect(() => {
    fetchCategories();
    if (blog) {
      setForm({
        title: blog.title || '',
        blogCategoryID: blog.blogCategoryID || '',
        content: blog.content || '',
        image: blog.image || '',
        createdByID: blog.createdByID || 1
      });
    }
  }, [blog]);

  const fetchCategories = async () => {
    try {
      const data = await blogCategoryService.getAllBlogCategories();
      setCategories(data);
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Chuẩn bị data để gửi, chuyển empty string thành null cho blogCategoryID
      const submitData = {
        ...form,
        blogCategoryID: form.blogCategoryID === '' ? null : parseInt(form.blogCategoryID)
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Lỗi khi lưu blog:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {blog ? 'Sửa tin tức' : 'Thêm tin tức mới'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tiêu đề */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              placeholder="Nhập tiêu đề tin tức..."
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              name="blogCategoryID"
              value={form.blogCategoryID}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
            >
              <option value="">Không chọn danh mục</option>
              {categories.map(category => (
                <option key={category.blogCategoryID} value={category.blogCategoryID}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Nội dung */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
              placeholder="Nhập nội dung tin tức..."
            />
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Hình ảnh
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Preview hình ảnh */}
          {form.image && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xem trước hình ảnh
              </label>
              <div className="border border-gray-300 rounded-lg p-2">
                <img
                  src={form.image}
                  alt="Preview"
                  className="max-w-full h-32 object-cover rounded"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Nút hành động */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang lưu...
                </div>
              ) : (
                blog ? 'Cập nhật' : 'Thêm mới'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm; 