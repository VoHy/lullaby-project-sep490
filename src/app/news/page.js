"use client";
import { useEffect, useState } from 'react';
import blogService from '@/services/api/blogService';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function NewsPage() {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    blogService.getBlogs().then(setBlogs);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tin tức & Blog</h1>
        <p className="text-gray-600 mb-8">Cập nhật các tin tức, bài viết mới nhất về chăm sóc sức khỏe, dịch vụ và hoạt động của Lullaby</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {blogs.map((blog, idx) => (
            <motion.div
              key={blog.BlogID}
              className="bg-white rounded-xl shadow p-6 flex flex-col hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.08 }}
            >
              <img src={blog.Image} alt={blog.Title} className="w-full h-40 object-cover rounded mb-4 group-hover:shadow-lg transition" />
              <h3 className="text-xl font-semibold text-blue-700 mb-2 line-clamp-2">{blog.Title}</h3>
              <p className="text-gray-600 text-sm mb-2">{blog.Category}</p>
              <p className="text-gray-500 text-sm mb-2 line-clamp-3">
                {blog.content && typeof blog.Content === 'string'
                  ? blog.content.slice(0, 80)
                  : ""}
                ...
              </p>
              <div className="flex justify-between items-end mt-auto">
                <span className="text-xs text-gray-400">{new Date(blog.CreatedAt).toLocaleDateString('vi-VN')}</span>
                <button
                  className="px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 font-semibold text-xs shadow hover:bg-pink-200 transition"
                  onClick={() => router.push(`/news/${blog.BlogID}`)}
                >
                  Xem chi tiết
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 