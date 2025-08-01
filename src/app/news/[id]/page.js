"use client";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCalendar, FaUser, FaEye, FaShare, FaBookmark, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useState, useEffect } from 'react';

// Mock data - sẽ được thay thế bằng API call
const newsList = [
  { 
    id: 1, 
    title: "Lullaby ra mắt dịch vụ chăm sóc đặc biệt cho người cao tuổi", 
    summary: "Chúng tôi vừa ra mắt dịch vụ chăm sóc đặc biệt cho người cao tuổi với đội ngũ y tá chuyên nghiệp và công nghệ hiện đại.",
    content: `
      <p class="mb-4">Lullaby tự hào giới thiệu dịch vụ chăm sóc đặc biệt dành riêng cho người cao tuổi, được thiết kế để mang lại sự thoải mái và an tâm tối đa cho gia đình.</p>
      
      <h2 class="text-2xl font-bold text-gray-800 mb-4 mt-8">Dịch vụ mới bao gồm:</h2>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Chăm sóc y tế 24/7 với đội ngũ y tá được đào tạo chuyên nghiệp</li>
        <li>Giám sát sức khỏe thông minh với công nghệ IoT</li>
        <li>Phục hồi chức năng với chuyên gia vật lý trị liệu</li>
        <li>Tư vấn dinh dưỡng và chế độ ăn uống phù hợp</li>
        <li>Hỗ trợ tâm lý và đồng hành cùng người cao tuổi</li>
      </ul>
      
      <h2 class="text-2xl font-bold text-gray-800 mb-4 mt-8">Lợi ích của dịch vụ:</h2>
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <div class="bg-purple-50 p-4 rounded-lg">
          <h3 class="font-semibold text-purple-700 mb-2">Cho người cao tuổi</h3>
          <ul class="text-sm space-y-1">
            <li>• Được chăm sóc chuyên nghiệp tại nhà</li>
            <li>• Giảm thiểu rủi ro sức khỏe</li>
            <li>• Cải thiện chất lượng cuộc sống</li>
          </ul>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="font-semibold text-blue-700 mb-2">Cho gia đình</h3>
          <ul class="text-sm space-y-1">
            <li>• An tâm khi vắng nhà</li>
            <li>• Tiết kiệm thời gian và chi phí</li>
            <li>• Nhận báo cáo sức khỏe định kỳ</li>
          </ul>
        </div>
      </div>
      
      <p class="mb-4">Dịch vụ sẽ được triển khai tại TP.HCM và Hà Nội từ tháng tới, với mức giá cạnh tranh và nhiều gói dịch vụ linh hoạt để phù hợp với nhu cầu của từng gia đình.</p>
      
      <p class="mb-4">Để biết thêm thông tin chi tiết và đăng ký dịch vụ, vui lòng liên hệ hotline 1900-xxxx hoặc truy cập website của chúng tôi.</p>
    `,
    image: "/images/hero-bg.jpg",
    category: "Dịch vụ mới",
    author: "Lullaby Team",
    date: "2024-01-15",
    views: 1250,
    readTime: "5 phút"
  },
  { 
    id: 2, 
    title: "Tuyển dụng y tá chuyên nghiệp cho các khu vực TP.HCM và Hà Nội", 
    summary: "Lullaby đang tuyển dụng thêm y tá cho các khu vực TP.HCM và Hà Nội với mức lương cạnh tranh và môi trường làm việc chuyên nghiệp.",
    content: `
      <p class="mb-4">Lullaby đang mở rộng đội ngũ y tá chuyên nghiệp để đáp ứng nhu cầu ngày càng tăng của khách hàng tại TP.HCM và Hà Nội.</p>
      
      <h2 class="text-2xl font-bold text-gray-800 mb-4 mt-8">Yêu cầu ứng viên:</h2>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Tốt nghiệp trung cấp y tá trở lên</li>
        <li>Có ít nhất 2 năm kinh nghiệm trong lĩnh vực chăm sóc người cao tuổi</li>
        <li>Có chứng chỉ hành nghề y tá</li>
        <li>Kỹ năng giao tiếp tốt, tận tâm với công việc</li>
        <li>Có thể làm việc theo ca linh hoạt</li>
      </ul>
      
      <h2 class="text-2xl font-bold text-gray-800 mb-4 mt-8">Quyền lợi:</h2>
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <div class="bg-green-50 p-4 rounded-lg">
          <h3 class="font-semibold text-green-700 mb-2">Mức lương</h3>
          <ul class="text-sm space-y-1">
            <li>• Lương cơ bản: 8-12 triệu/tháng</li>
            <li>• Thưởng theo hiệu suất công việc</li>
            <li>• Phụ cấp ca đêm và ngày lễ</li>
          </ul>
        </div>
        <div class="bg-orange-50 p-4 rounded-lg">
          <h3 class="font-semibold text-orange-700 mb-2">Phúc lợi</h3>
          <ul class="text-sm space-y-1">
            <li>• Bảo hiểm xã hội đầy đủ</li>
            <li>• Đào tạo và phát triển kỹ năng</li>
            <li>• Môi trường làm việc thân thiện</li>
          </ul>
        </div>
      </div>
      
      <p class="mb-4">Ứng viên quan tâm vui lòng gửi CV về email tuyendung@lullaby.vn hoặc liên hệ trực tiếp qua hotline 1900-xxxx.</p>
    `,
    image: "/images/service-elderly.jpg",
    category: "Tuyển dụng",
    author: "HR Team",
    date: "2024-01-10",
    views: 890,
    readTime: "3 phút"
  },
  { 
    id: 3, 
    title: "Chương trình ưu đãi mùa hè: Giảm giá 20% cho khách hàng mới", 
    summary: "Lullaby triển khai chương trình ưu đãi đặc biệt với mức giảm giá 20% cho khách hàng mới đăng ký dịch vụ trong tháng này.",
    content: `
      <p class="mb-4">Nhân dịp mùa hè, Lullaby triển khai chương trình ưu đãi đặc biệt dành cho khách hàng mới với nhiều quà tặng hấp dẫn.</p>
      
      <h2 class="text-2xl font-bold text-gray-800 mb-4 mt-8">Ưu đãi bao gồm:</h2>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Giảm giá 20% cho gói dịch vụ đầu tiên</li>
        <li>Tặng 2 buổi tư vấn sức khỏe miễn phí</li>
        <li>Miễn phí đánh giá tình trạng sức khỏe ban đầu</li>
        <li>Giảm 10% cho các gói dịch vụ tiếp theo</li>
      </ul>
      
      <h2 class="text-2xl font-bold text-gray-800 mb-4 mt-8">Điều kiện áp dụng:</h2>
      <div class="bg-yellow-50 p-4 rounded-lg mb-6">
        <ul class="text-sm space-y-1">
          <li>• Áp dụng cho khách hàng mới đăng ký từ 01/06 - 30/06</li>
          <li>• Gói dịch vụ tối thiểu 3 tháng</li>
          <li>• Không áp dụng cùng các chương trình khuyến mãi khác</li>
        </ul>
      </div>
      
      <p class="mb-4">Chương trình có hiệu lực từ ngày 01/06/2024 đến hết ngày 30/06/2024. Số lượng ưu đãi có hạn, vui lòng đăng ký sớm để được hưởng ưu đãi tốt nhất.</p>
      
      <p class="mb-4">Liên hệ ngay hotline 1900-xxxx để được tư vấn và đăng ký dịch vụ với mức giá ưu đãi!</p>
    `,
    image: "/images/service-elderly.jpg",
    category: "Khuyến mãi",
    author: "Marketing Team",
    date: "2024-01-05",
    views: 1560,
    readTime: "4 phút"
  }
];

export default function NewsDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundNews = newsList.find((n) => n.id === Number(id));
      setNews(foundNews);
      setLoading(false);
    }, 500);
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = news?.title || '';
    
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

  if (!news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📰</div>
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
                src={news.image} 
                alt={news.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                  {news.category}
                </span>
              </div>
            </div>

            {/* Article Info */}
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {news.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {news.summary}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FaUser className="text-purple-500" />
                  <span>{news.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-purple-500" />
                  <span>{formatDate(news.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEye className="text-purple-500" />
                  <span>{news.views.toLocaleString()} lượt xem</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-500">⏱️</span>
                  <span>{news.readTime} đọc</span>
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
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </motion.div>

        {/* Related Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsList
              .filter(article => article.id !== news.id)
              .slice(0, 2)
              .map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => router.push(`/news/${article.id}`)}
                >
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-32 object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 mb-2">
                      {article.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{formatDate(article.date)}</span>
                      <span>{article.views} lượt xem</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 