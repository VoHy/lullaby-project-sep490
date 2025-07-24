import React, { useEffect, useState } from 'react';
import blogService from '@/services/api/blogService';

const initialForm = {
  Title: '',
  Category: '',
  Content: '',
  Status: 'draft',
  Image: '',
};

const BlogTab = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    const data = await blogService.getBlogs();
    setBlogs(data);
    setLoading(false);
  };

  const handleOpenModal = (blog = null) => {
    setEditBlog(blog);
    setForm(blog ? { ...blog } : initialForm);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditBlog(null);
    setForm(initialForm);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editBlog) {
      await blogService.updateBlog(editBlog.BlogID, form);
    } else {
      await blogService.createBlog(form);
    }
    await fetchBlogs();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    await blogService.deleteBlog(id);
    setConfirmDelete(null);
    await fetchBlogs();
  };

  const filteredBlogs = blogs.filter(b =>
    b.Title.toLowerCase().includes(search.toLowerCase()) ||
    b.Category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">Quản lý Blog</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm blog..."
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition"
            onClick={() => handleOpenModal()}
          >
            Thêm Blog
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
              <th className="p-3 text-left">Tiêu đề</th>
              <th className="p-3 text-left">Chuyên mục</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Ngày tạo</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8">Đang tải...</td></tr>
            ) : filteredBlogs.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8">Không có blog nào</td></tr>
            ) : filteredBlogs.map(blog => (
              <tr key={blog.BlogID} className="border-b hover:bg-pink-50">
                <td className="p-3 font-semibold">{blog.Title}</td>
                <td className="p-3">{blog.Category}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${blog.Status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{blog.Status}</span>
                </td>
                <td className="p-3">{new Date(blog.CreatedAt).toLocaleDateString('vi-VN')}</td>
                <td className="p-3 flex gap-2">
                  <button className="text-blue-600 hover:underline" onClick={() => handleOpenModal(blog)}>Sửa</button>
                  <button className="text-red-600 hover:underline" onClick={() => setConfirmDelete(blog.BlogID)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg space-y-4 relative" onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-2">{editBlog ? 'Sửa Blog' : 'Thêm Blog'}</h3>
            <input name="Title" value={form.Title} onChange={handleChange} required placeholder="Tiêu đề" className="w-full border rounded px-3 py-2" />
            <input name="Category" value={form.Category} onChange={handleChange} required placeholder="Chuyên mục" className="w-full border rounded px-3 py-2" />
            <textarea name="Content" value={form.Content} onChange={handleChange} required placeholder="Nội dung" className="w-full border rounded px-3 py-2 min-h-[80px]" />
            <div className="flex gap-2">
              <select name="Status" value={form.Status} onChange={handleChange} className="border rounded px-3 py-2">
                <option value="draft">Nháp</option>
                <option value="published">Công khai</option>
              </select>
              <input name="Image" value={form.Image} onChange={handleChange} placeholder="Ảnh (tùy chọn)" className="flex-1 border rounded px-3 py-2" />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={handleCloseModal}>Hủy</button>
              <button type="submit" className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow">Lưu</button>
            </div>
          </form>
        </div>
      )}
      {/* Xác nhận xóa */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs">
            <p className="mb-4">Bạn có chắc muốn xóa blog này?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setConfirmDelete(null)}>Hủy</button>
              <button className="px-4 py-2 rounded bg-red-500 text-white font-semibold shadow" onClick={() => handleDelete(confirmDelete)}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogTab; 