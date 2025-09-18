import React, { useEffect, useState } from 'react';
import blogService from '@/services/api/blogService';
import blogCategoryService from '@/services/api/blogCategoryService';

const BlogList = ({ onEdit, onDelete, onActivate, onDeactivate, refreshTrigger }) => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]); // Refresh khi refreshTrigger thay đổi

  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogsData, categoriesData] = await Promise.all([
        blogService.getAllBlogs(),
        blogCategoryService.getAllBlogCategories()
      ]);
      setBlogs(blogsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) {
      return 'Không có danh mục';
    }
    const category = categories.find(cat => cat.blogCategoryID === categoryId);
    return category ? category.categoryName : 'Không xác định';
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(search.toLowerCase()) ||
      blog.content?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || 
      (filterCategory === 'none' ? !blog.blogCategoryID : blog.blogCategoryID === parseInt(filterCategory));
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search and Filter Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm blog theo tiêu đề hoặc nội dung..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="lg:w-64">
            <select
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              <option value="none">Không có danh mục</option>
              {categories.map(category => (
                <option key={category.blogCategoryID} value={category.blogCategoryID}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Hiển thị {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có blog nào</h3>
          <p className="text-gray-500">Hãy tạo blog đầu tiên để bắt đầu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBlogs.map(blog => (
            <div key={blog.blogID} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {blog.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    blog.status === 'active' || blog.status === true 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {blog.status === 'active' || blog.status === true ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {blog.content?.substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {getCategoryName(blog.blogCategoryID)}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                                         <button
                       className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                       onClick={() => {
                         setSelectedBlog(blog);
                         setShowDetailModal(true);
                       }}
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                       </svg>
                       Xem
                     </button>
                     <button
                       className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                       onClick={() => onEdit(blog)}
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                       </svg>
                       Sửa
                     </button>
                    <button
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => onDelete(blog.blogID)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Xóa
                    </button>
                  </div>
                  {blog.status === 'active' || blog.status === true ? (
                    <button
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                      onClick={() => onDeactivate(blog.blogID)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                      </svg>
                      Vô hiệu
                    </button>
                  ) : (
                    <button
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      onClick={() => onActivate(blog.blogID)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Kích hoạt
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    {/* Blog Detail Modal */}
     {showDetailModal && selectedBlog && (
       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all">
           {/* Header */}
           <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                   <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-gray-900">Chi tiết Blog</h3>
                   <p className="text-gray-600 text-sm">Thông tin chi tiết về blog</p>
                 </div>
               </div>
               <button
                 onClick={() => {
                   setShowDetailModal(false);
                   setSelectedBlog(null);
                 }}
                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
               >
                 <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
           </div>

           {/* Content */}
           <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Left Column - Main Info */}
               <div className="space-y-6">
                 {/* Title & Status */}
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedBlog.title}</h2>
                   <div className="flex items-center gap-3">
                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                       selectedBlog.status === 'active' || selectedBlog.status === true 
                         ? 'bg-green-100 text-green-700' 
                         : 'bg-yellow-100 text-yellow-700'
                     }`}>
                       {selectedBlog.status === 'active' || selectedBlog.status === true ? 'Hoạt động' : 'Không hoạt động'}
                     </span>
                     <span className="text-sm text-gray-500">ID: {selectedBlog.blogID}</span>
                   </div>
                 </div>

                 {/* Content */}
                 <div>
                   <h4 className="text-lg font-semibold text-gray-900 mb-3">Nội dung</h4>
                   <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                     <p className="text-gray-700 whitespace-pre-wrap">{selectedBlog.content}</p>
                   </div>
                 </div>

                 {/* Actions */}
                 <div className="flex gap-3 pt-4">
                   <button
                     className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200"
                     onClick={() => {
                       setShowDetailModal(false);
                       onEdit(selectedBlog);
                     }}
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                     </svg>
                     Chỉnh sửa
                   </button>
                   {selectedBlog.status === 'active' || selectedBlog.status === true ? (
                     <button
                       className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all duration-200"
                       onClick={() => {
                         setShowDetailModal(false);
                         onDeactivate(selectedBlog.blogID);
                       }}
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                       </svg>
                       Vô hiệu
                     </button>
                   ) : (
                     <button
                       className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200"
                       onClick={() => {
                         setShowDetailModal(false);
                         onActivate(selectedBlog.blogID);
                       }}
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                       Kích hoạt
                     </button>
                   )}
                 </div>
               </div>

               {/* Right Column - Metadata */}
               <div className="space-y-6">
                 {/* Category Info */}
                 <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                   <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                     <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                     </svg>
                     Danh mục
                   </h4>
                   <div className="bg-white rounded-lg p-3">
                     <span className="text-purple-600 font-semibold">{getCategoryName(selectedBlog.blogCategoryID)}</span>
                   </div>
                 </div>

                 {/* Date Info */}
                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                   <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                     <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                     Thông tin thời gian
                   </h4>
                   <div className="space-y-2">
                     <div className="bg-white rounded-lg p-3">
                       <div className="text-sm text-gray-600">Ngày tạo</div>
                       <div className="font-semibold text-gray-900">
                         {selectedBlog.createdAt ? new Date(selectedBlog.createdAt).toLocaleDateString('vi-VN', {
                           year: 'numeric',
                           month: 'long',
                           day: 'numeric',
                           hour: '2-digit',
                           minute: '2-digit'
                         }) : 'N/A'}
                       </div>
                     </div>
                     {selectedBlog.updatedAt && (
                       <div className="bg-white rounded-lg p-3">
                         <div className="text-sm text-gray-600">Cập nhật lần cuối</div>
                         <div className="font-semibold text-gray-900">
                           {new Date(selectedBlog.updatedAt).toLocaleDateString('vi-VN', {
                             year: 'numeric',
                             month: 'long',
                             day: 'numeric',
                             hour: '2-digit',
                             minute: '2-digit'
                           })}
                         </div>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Danger Zone */}
                 <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4">
                   <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                     <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                     </svg>
                     Vùng nguy hiểm
                   </h4>
                   <button
                     className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200"
                     onClick={() => {
                       setShowDetailModal(false);
                       onDelete(selectedBlog.blogID);
                     }}
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                     Xóa Blog
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     )}
   </div>
 );
};

export default BlogList; 