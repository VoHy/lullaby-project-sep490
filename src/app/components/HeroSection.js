'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FaHeart, FaUserMd, FaPhone, FaArrowRight } from 'react-icons/fa';

const HeroSection = () => {
  const slides = [
    {
      id: 1,
      image: "/images/hero-bg.jpg",
      alt: "Chăm sóc người cao tuổi",
      icon: <FaHeart className="text-pink-400 text-lg" />,
      badge: "Dịch vụ chăm sóc tận tâm",
      title: "Chăm sóc người cao tuổi",
      subtitle: "với tình yêu thương",
      description: "Dịch vụ chăm sóc chuyên nghiệp tại nhà, mang đến sự thoải mái và an tâm cho gia đình bạn",
      gradient: "from-black/60 via-black/40 to-black/20",
      buttonColor: "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
    },
    {
      id: 2,
      image: "/images/hero-bg.jpg",
      alt: "Phục hồi chức năng",
      icon: <FaUserMd className="text-blue-400 text-lg" />,
      badge: "Chuyên gia phục hồi",
      title: "Phục hồi chức năng",
      subtitle: "chuyên nghiệp",
      description: "Hỗ trợ tập luyện phục hồi chức năng với đội ngũ chuyên gia giàu kinh nghiệm",
      gradient: "from-blue-900/60 via-blue-800/40 to-blue-700/20",
      buttonColor: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
    },
    {
      id: 3,
      image: "/images/hero-bg.jpg",
      alt: "Giám sát sức khỏe",
      icon: <FaPhone className="text-green-400 text-lg" />,
      badge: "Giám sát 24/7",
      title: "Giám sát sức khỏe",
      subtitle: "thông minh",
      description: "Theo dõi sức khỏe và báo cáo định kỳ cho gia đình với công nghệ hiện đại",
      gradient: "from-green-900/60 via-green-800/40 to-green-700/20",
      buttonColor: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
    }
  ];

  return (
    <motion.section
      className="relative w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active'
        }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-[80vh] min-h-[600px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <Image 
                src={slide.image} 
                alt={slide.alt} 
                fill
                priority
                className="object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                    {slide.icon}
                    <span className="text-white font-medium">{slide.badge}</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    {slide.title}
                    <span className="block text-3xl md:text-4xl lg:text-5xl font-light mt-2">{slide.subtitle}</span>
                  </h1>
                  <p className="text-white/90 mb-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/booking/new"
                      className={`group inline-flex items-center gap-3 bg-gradient-to-r ${slide.buttonColor} text-white font-semibold px-8 py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105`}
                    >
                      Đặt lịch ngay
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-full border border-white/30 transition-all duration-300"
                    >
                      Tìm hiểu thêm
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  );
};

export default HeroSection; 