"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSearch, FaCalendar, FaUser, FaEye, FaArrowRight, FaNewspaper, FaFilter } from 'react-icons/fa';
import blogService from '@/services/api/blogService';

export default function NewsPage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogService.getBlogs();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Filter blogs based on search and category
  useEffect(() => {
    let filtered = blogs;
    
    if (searchText) {
      filtered = filtered.filter(blog => 
        blog.Title.toLowerCase().includes(searchText.toLowerCase()) ||
        blog.Content?.toLowerCase().includes(searchText.toLowerCase()) ||
        blog.Category?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.Category === selectedCategory);
    }
    
    setFilteredBlogs(filtered);
  }, [blogs, searchText, selectedCategory]);

  // Get unique categories
  const categories = ['all', ...new Set(blogs.map(blog => blog.Category).filter(Boolean))];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải tin tức...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaNewspaper className="text-4xl text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Tin tức & Blog
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cập nhật các tin tức, bài viết mới nhất về chăm sóc sức khỏe, dịch vụ và hoạt động của Lullaby
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm tin tức..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaFilter className="text-xs" />
                  {category === 'all' ? 'Tất cả' : category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold text-purple-600">{filteredBlogs.length}</span> bài viết
            {searchText && ` cho "${searchText}"`}
            {selectedCategory !== 'all' && ` trong danh mục "${selectedCategory}"`}
          </p>
        </motion.div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy bài viết</h3>
            <p className="text-gray-600">Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, idx) => (
              <motion.div
                key={blog.BlogID}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer"
                     onClick={() => router.push(`/news/${blog.BlogID}`)}>
                  
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={blog.Image || '/images/hero-bg.jpg'} 
                      alt={blog.Title} 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                        {blog.Category || 'Tin tức'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {blog.Title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {truncateText(blog.Content || blog.Summary || 'Nội dung đang được cập nhật...')}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-purple-500" />
                        <span>{formatDate(blog.CreatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEye className="text-purple-500" />
                        <span>{blog.Views || 0} lượt xem</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-purple-600 font-medium text-sm">
                        <FaUser className="text-xs" />
                        <span>{blog.Author || 'Lullaby Team'}</span>
                      </div>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 text-white font-medium text-sm hover:bg-purple-600 transition-colors group-hover:gap-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/news/${blog.BlogID}`);
                        }}
                      >
                        Xem chi tiết
                        <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredBlogs.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Xem thêm tin tức
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 