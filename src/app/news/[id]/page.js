"use client";
import { useParams } from "next/navigation";

const newsList = [
  { id: 1, title: "Lullaby ra mắt dịch vụ mới", summary: "Chúng tôi vừa ra mắt dịch vụ chăm sóc đặc biệt cho người cao tuổi.", image: "/images/hero-bg.jpg" },
  { id: 2, title: "Tuyển dụng y tá tháng 6", summary: "Lullaby đang tuyển dụng thêm y tá cho các khu vực TP.HCM và Hà Nội.", image: "/images/service-elderly.jpg" },
  { id: 3, title: "Chương trình ưu đãi mùa hè", summary: "Giảm giá 20% cho khách hàng mới đăng ký dịch vụ trong tháng này.", image: "/images/service-elderly.jpg" },
];

export default function NewsDetailPage() {
  const { id } = useParams();
  const news = newsList.find((n) => n.id === Number(id));

  if (!news) return <div className="p-8">Không tìm thấy tin tức.</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <img src={news.image} alt={news.title} className="w-full h-60 object-cover rounded-xl mb-6 border-4 border-rose-200" />
      <h1 className="text-3xl font-bold text-center text-rose-700 mb-2">{news.title}</h1>
      <p className="text-center text-gray-600 mb-4">{news.summary}</p>
      <div className="text-center text-gray-600">Nội dung chi tiết sẽ được cập nhật sau.</div>
    </div>
  );
} 