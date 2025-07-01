"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const newsList = [
  { id: 1, title: "Lullaby ra mắt dịch vụ mới", summary: "Chúng tôi vừa ra mắt dịch vụ chăm sóc đặc biệt cho người cao tuổi.", image: "/images/hero-bg.jpg" },
  { id: 2, title: "Tuyển dụng y tá tháng 6", summary: "Lullaby đang tuyển dụng thêm y tá cho các khu vực TP.HCM và Hà Nội.", image: "/images/service-elderly.jpg" },
  { id: 3, title: "Chương trình ưu đãi mùa hè", summary: "Giảm giá 20% cho khách hàng mới đăng ký dịch vụ trong tháng này.", image: "/images/service-elderly.jpg" },
];

export default function NewsPage() {
  return (
    <motion.div
      className="p-8 bg-gradient-to-br from-pink-50 to-rose-100 min-h-screen"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.18
          }
        }
      }}
    >
      <motion.h1
        className="text-4xl font-extrabold mb-10 text-center text-rose-600 drop-shadow-lg"
        variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
      >
        Tin tức nổi bật
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {newsList.map((news) => (
          <motion.div
            key={news.id}
            className="bg-white rounded-2xl shadow-xl border border-rose-200 hover:border-rose-400 transition p-6 flex flex-col group hover:scale-105 duration-300"
            variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
          >
            <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover group-hover:scale-105 transition"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-rose-700 mb-2 line-clamp-2">{news.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{news.summary}</p>
            <button className="mt-auto px-5 py-2 rounded-full bg-rose-100 text-rose-700 font-semibold shadow hover:bg-rose-200 transition">
              <Link href={`/news/${news.id}`} className="block w-full h-full">Xem chi tiết</Link>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 