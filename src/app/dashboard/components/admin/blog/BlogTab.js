import React, { useState, useCallback, useEffect } from 'react';
import blogService from '@/services/api/blogService';
import blogCategoryService from '@/services/api/blogCategoryService';
import BlogList from './BlogList';
import BlogForm from './BlogForm';
import BlogCategoryList from './BlogCategoryList';
import BlogCategoryForm from './BlogCategoryForm';

const BlogTab = () => {
  const [activeTab, setActiveTab] = useState('blogs');
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(''); 
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const [loading, setLoading] = useState(false); 
  const [stats, setStats] = useState({ blogs: 0, categories: 0 }); 
  
  const [cachedData, setCachedData] = useState({
    blogs: null,
    categories: null,
    lastFetch: null
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const handleBlogSubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingBlog) {
        await blogService.updateBlog(editingBlog.blogID, formData);
      } else {
        await blogService.createBlog(formData);
      }
      setShowBlogForm(false);
      setEditingBlog(null);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
      alert(editingBlog ? 'Cập nhật blog thành công!' : 'Tạo blog thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu blog:', error);
      alert('Có lỗi xảy ra khi lưu blog');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingCategory) {
        await blogCategoryService.updateBlogCategory(editingCategory.blogCategoryID, formData);
      } else {
        await blogCategoryService.createBlogCategory(formData);
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
      alert(editingCategory ? 'Cập nhật danh mục thành công!' : 'Tạo danh mục thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu danh mục:', error);
      alert('Có lỗi xảy ra khi lưu danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleBlogEdit = (blog) => {
    setEditingBlog(blog);
    setShowBlogForm(true);
  };

  const handleCategoryEdit = (category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleBlogDelete = (blogId) => {
    setConfirmDelete(blogId);
    setDeleteType('blog');
  };

  const handleCategoryDelete = (categoryId) => {
    setConfirmDelete(categoryId);
    setDeleteType('category');
  };

  const handleBlogActivate = async (blogId) => {
    try {
      setLoading(true);
      await blogService.activateBlog(blogId);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
      alert('Kích hoạt blog thành công!');
    } catch (error) {
      console.error('Lỗi khi kích hoạt blog:', error);
      alert('Có lỗi xảy ra khi kích hoạt blog');
    } finally {
      setLoading(false);
    }
  };

  const handleBlogDeactivate = async (blogId) => {
    try {
      setLoading(true);
      await blogService.deactivateBlog(blogId);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
      alert('Vô hiệu hóa blog thành công!');
    } catch (error) {
      console.error('Lỗi khi vô hiệu hóa blog:', error);
      alert('Có lỗi xảy ra khi vô hiệu hóa blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async (forceRefresh = false) => {
    // Kiểm tra cache (5 phút)
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    const now = Date.now();
    
    if (!forceRefresh && cachedData.lastFetch && 
        (now - cachedData.lastFetch) < CACHE_DURATION && 
        cachedData.blogs && cachedData.categories) {
  
      return cachedData;
    }

    try {
      setLoading(true);
      
      const [blogsData, categoriesData] = await Promise.all([
        blogService.getAllBlogs(),
        blogCategoryService.getAllBlogCategories()
      ]);

      const newCachedData = {
        blogs: blogsData,
        categories: categoriesData,
        lastFetch: now
      };

      setCachedData(newCachedData);
      setStats({
        blogs: blogsData.length,
        categories: categoriesData.length
      });

      return newCachedData;
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      throw error;
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchAllData(refreshTrigger > 0); 
  }, [refreshTrigger]);

  useEffect(() => {
    if (isInitialLoad) {
      fetchAllData();
    }
  }, [isInitialLoad]);

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      if (deleteType === 'blog') {
        await blogService.deleteBlog(confirmDelete);
      } else {
        await blogCategoryService.deleteBlogCategory(confirmDelete);
      }
      setConfirmDelete(null);
      setDeleteType('');
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
      alert(`${deleteType === 'blog' ? 'Blog' : 'Danh mục'} đã được xóa thành công!`);
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      alert('Có lỗi xảy ra khi xóa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-2">
                Quản lý Blog & Danh mục
              </h1>
              <p className="text-gray-600 text-lg">
                Tạo và quản lý nội dung blog cho website
              </p>
            </div>
            
                         {/* Stats Cards */}
             <div className="flex gap-4">
               <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-4 min-w-[120px]">
                 <div className="text-2xl font-bold text-purple-600">{stats.blogs}</div>
                 <div className="text-sm text-gray-600">Blog đã tạo</div>
               </div>
               <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-4 min-w-[120px]">
                 <div className="text-2xl font-bold text-pink-600">{stats.categories}</div>
                 <div className="text-sm text-gray-600">Danh mục</div>
               </div>
             </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('blogs')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'blogs'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Blog
              </span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Danh mục
              </span>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end mb-6">
          <button
            className={`group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'
            }`}
            onClick={() => {
              if (activeTab === 'blogs') {
                setEditingBlog(null);
                setShowBlogForm(true);
              } else {
                setEditingCategory(null);
                setShowCategoryForm(true);
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Đang xử lý...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm {activeTab === 'blogs' ? 'Blog' : 'Danh mục'}
              </>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {activeTab === 'blogs' ? (
            <BlogList
              onEdit={handleBlogEdit}
              onDelete={handleBlogDelete}
              onActivate={handleBlogActivate}
              onDeactivate={handleBlogDeactivate}
              refreshTrigger={refreshTrigger}
              cachedBlogs={cachedData.blogs}
              cachedCategories={cachedData.categories}
              loading={loading && isInitialLoad}
            />
          ) : (
            <BlogCategoryList
              onEdit={handleCategoryEdit}
              onDelete={handleCategoryDelete}
              refreshTrigger={refreshTrigger}
              cachedCategories={cachedData.categories}
              loading={loading && isInitialLoad}
            />
          )}
        </div>
      </div>

      {/* Blog Form Modal */}
      {showBlogForm && (
        <BlogForm
          blog={editingBlog}
          onSubmit={handleBlogSubmit}
          onCancel={() => {
            setShowBlogForm(false);
            setEditingBlog(null);
          }}
        />
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <BlogCategoryForm
          category={editingCategory}
          onSubmit={handleCategorySubmit}
          onCancel={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Xác nhận xóa</h3>
                  <p className="text-gray-600 text-sm">Hành động này không thể hoàn tác</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Bạn có chắc muốn xóa <span className="font-semibold">{deleteType === 'blog' ? 'blog' : 'danh mục'}</span> này? 
                Tất cả dữ liệu liên quan sẽ bị mất vĩnh viễn.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                  onClick={() => {
                    setConfirmDelete(null);
                    setDeleteType('');
                  }}
                >
                  Hủy
                </button>
                <button
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
                  }`}
                  onClick={handleConfirmDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Đang xóa...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Xóa
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogTab; 