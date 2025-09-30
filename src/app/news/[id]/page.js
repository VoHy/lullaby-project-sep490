"use client";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCalendar, FaUser, FaEye, FaShare, FaBookmark, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import blogService from '@/services/api/blogService';
import blogCategoryService from '@/services/api/blogCategoryService';

export default function NewsDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        setRelatedLoading(true);
        
        // Fetch blog detail
        const blogData = await blogService.getBlogById(id);

        // If backend returned HTML escaped as entities (e.g. &lt;p&gt;), decode it here.
        const decodeIfNeeded = (s) => {
          if (!s) return '';
          if (s.includes('&lt;') || s.includes('&gt;') || s.includes('&amp;')) {
            try {
              const doc = new DOMParser().parseFromString(s, 'text/html');
              return doc.documentElement.textContent || '';
            } catch (e) {
              return s;
            }
          }
          return s;
        };

        blogData.content = decodeIfNeeded(blogData.content || '');
        setBlog(blogData);
        
        // Fetch related blogs with same category
        if (blogData?.blogCategoryID) {
          const allBlogs = await blogService.getAllBlogs();
          const related = allBlogs.filter(b => 
            b.blogID !== parseInt(id) && 
            b.blogCategoryID === blogData.blogCategoryID &&
            b.status === 'active'
          ).slice(0, 2);
          setRelatedBlogs(related);
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
        setRelatedLoading(false);
      }
    };
    
    fetchBlogData();
  }, [id]);

  // TipTap read-only editor for displaying content
  const editor = useEditor({
    extensions: [StarterKit],
    content: blog?.content || '',
    editable: false
  });

  // When blog is updated, sync its content into the editor
  useEffect(() => {
    if (editor && blog) {
      const html = blog.content || '';
      const current = editor.getHTML();
      if (current !== html) {
        editor.commands.setContent(html);
      }
    }
  }, [editor, blog]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có ngày';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    // Strip HTML tags for preview text
    try {
      const div = document.createElement('div');
      div.innerHTML = text;
      const stripped = div.textContent || div.innerText || '';
      return stripped.length > maxLength ? stripped.slice(0, maxLength) + '...' : stripped;
    } catch (e) {
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    }
  };

  const getCategoryName = (blog) => {
    return blog.BlogCategory?.categoryName || 'Tin tức';
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = blog?.title || '';
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy bài viết</h2>
          <p className="text-gray-600 mb-6">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => router.push('/news')}
            className="px-6 py-3 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-colors"
          >
            Quay lại trang tin tức
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => router.push('/news')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8 transition-colors"
          >
            <FaArrowLeft className="text-sm" />
            Quay lại trang tin tức
          </button>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80">
              <img 
                src={blog.image || '/images/hero-bg.jpg'} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                  {getCategoryName(blog)}
                </span>
              </div>
            </div>

            {/* Article Info */}
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FaUser className="text-purple-500" />
                  <span>{blog.author || 'Lullaby Team'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-purple-500" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEye className="text-purple-500" />
                  <span>{blog.views?.toLocaleString() || 0} lượt xem</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-500"></span>
                  <span>5 phút đọc</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors">
                  <FaBookmark className="text-sm" />
                  Lưu bài viết
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Chia sẻ:</span>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    <FaFacebook className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 rounded-lg bg-blue-400 text-white hover:bg-blue-500 transition-colors"
                  >
                    <FaTwitter className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <FaLinkedin className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="prose prose-lg max-w-none">
            {editor ? (
              <EditorContent editor={editor} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: blog.content || 'Nội dung đang được cập nhật...' }} />
            )}
          </div>
        </motion.div>

        {/* Related Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h2>
          
          {relatedLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Đang tải bài viết liên quan...</span>
            </div>
          ) : relatedBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <div
                  key={relatedBlog.blogID}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => router.push(`/news/${relatedBlog.blogID}`)}
                >
                  <img 
                    src={relatedBlog.image || '/images/hero-bg.jpg'} 
                    alt={relatedBlog.title} 
                    className="w-full h-32 object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 mb-2">
                      {getCategoryName(relatedBlog)}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {truncateText(relatedBlog.content, 100)}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{formatDate(relatedBlog.createdAt)}</span>
                      <span>{relatedBlog.views || 0} lượt xem</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4"></div>
              <p className="text-gray-600">Chưa có bài viết liên quan</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 