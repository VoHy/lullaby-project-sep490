"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import authService from "@/services/auth/authService";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = authService.isAuthenticated();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        setUser(authService.getCurrentUser());
      }
    };

    checkAuth();
  }, []);

  return (
    <motion.div
      className="max-w-full mx-auto"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.22,
          },
        },
      }}>
      {/* Banner dịch vụ */}
      <motion.section
        className="w-full flex items-center justify-center bg-white"
        variants={{
          hidden: { opacity: 0, y: 40 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: "easeOut" },
          },
        }}>
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-[600px]">
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="relative w-full h-full">
              <Image
                src="/images/hero-bg.jpg"
                alt="Chăm sóc người cao tuổi"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-center items-center text-center p-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Chăm sóc người cao tuổi
                </h2>
                <p className="text-white mb-6 text-lg md:text-2xl">
                  Dịch vụ chăm sóc tận tâm cho người lớn tuổi tại nhà.
                </p>
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition text-lg">
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
          </SwiperSlide>
          {/* Slide 2 */}
          <SwiperSlide>
            <div className="relative w-full h-full">
              <Image
                src="/images/hero-bg.jpg"
                alt="Phục hồi chức năng"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-center items-center text-center p-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Phục hồi chức năng
                </h2>
                <p className="text-white mb-6 text-lg md:text-2xl">
                  Hỗ trợ tập luyện phục hồi chức năng chuyên nghiệp.
                </p>
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition text-lg">
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
          </SwiperSlide>
          {/* Slide 3 */}
          <SwiperSlide>
            <div className="relative w-full h-full">
              <Image
                src="/images/hero-bg.jpg"
                alt="Giám sát sức khỏe"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-center items-center text-center p-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Giám sát sức khỏe
                </h2>
                <p className="text-white mb-6 text-lg md:text-2xl">
                  Theo dõi sức khỏe và báo cáo định kỳ cho gia đình.
                </p>
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition text-lg">
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </motion.section>

      {/* Features Section */}
      <motion.div
        className="py-12 bg-white"
        variants={{
          hidden: { opacity: 0, y: 40 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: "easeOut" },
          },
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
              Dịch vụ của chúng tôi
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-700 sm:mt-5">
              Lullaby cung cấp nhiều dịch vụ chăm sóc y tế tại nhà
            </p>
          </div>
          <motion.div
            className="mt-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.18,
                },
              },
            }}>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: "easeOut" },
                    },
                  }}
                  className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  {feature.icon}
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-base text-gray-500">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="relative rounded-xl overflow-hidden my-12"
        style={{ minHeight: 320 }}
        variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } } }}
      >
        {/* Hình nền */}
        <img
          src="/images/hero-bg.jpg"
          alt="CTA Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ objectPosition: 'center' }}
        />
        {/* Lớp phủ màu */}
        <div className="absolute inset-0 bg-pink-400/40 z-10 rounded-xl"></div>
        {/* Nội dung */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center h-full py-16 px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Sẵn sàng trải nghiệm?
            <br />
            <span className="block text-2xl md:text-4xl font-semibold mt-2">Đăng ký ngay hôm nay.</span>
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-semibold rounded-full text-pink-700 bg-white hover:bg-pink-50 shadow-lg transition"
            >
              Bắt đầu ngay
            </Link>
            <Link
              href="/booking/new"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-semibold rounded-full text-white bg-pink-600 hover:bg-pink-700 shadow-lg transition"
            >
              Đặt lịch
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="w-full bg-gradient-to-r from-pink-50 to-rose-100 border-t mt-12"
        variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
      >
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Logo & mô tả */}
            <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center mb-4">
                <img src="/images/logo-eldora.png" alt="Lullaby" className="h-12 w-12 mr-2" />
                <span className="text-2xl font-bold text-[#2d3a4e] tracking-wide">Lullaby</span>
              </div>
              <p className="text-gray-700 mb-4">
                Cung cấp tình yêu thương, sự ấm áp và dịch vụ tận tâm để mang đến cho người cao tuổi một gia đình thực sự.<br />
                <br />
                Để biết thêm chi tiết, vui lòng liên hệ theo các liên kết sau.
              </p>
              <div className="flex space-x-4 mt-2">
                <a href="#" aria-label="Facebook" className="text-gray-800 hover:text-blue-600">
                  <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="text-gray-800 hover:text-blue-600">
                  <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.966 0-1.75-.79-1.75-1.76s.784-1.76 1.75-1.76 1.75.79 1.75 1.76-.784 1.76-1.75 1.76zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.38v4.59h-3v-9h2.89v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z"/></svg>
                </a>
              </div>
            </div>
            {/* Các cột liên kết */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Các Gói</h3>
              <ul className="space-y-2 text-gray-800">
                <li><a href="#" className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 tracking-wide">Chăm sóc tại nhà</a></li>
                <li><a href="#" className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 tracking-wide">Điều dưỡng tại nhà</a></li>
                <li><a href="#" className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 tracking-wide">Liệu pháp tại nhà</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Chăm sóc Pro</h3>
              <ul className="space-y-2 text-gray-800">
                <li><a href="#" className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 tracking-wide">Chuyên làm y tá</a></li>
                <li><a href="#" className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 tracking-wide">Chuyên gia trị liệu</a></li>
                <li><a href="#" className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 tracking-wide">Công việc chăm sóc</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Kết nối</h3>
              <ul className="space-y-2 text-gray-800">
                <li><a href="#" className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 tracking-wide">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 tracking-wide">Nghề nghiệp</a></li>
              </ul>
            </div>
          </div>
          {/* Bản quyền */}
          <div className="text-center text-gray-700 text-base mt-10">
            Bản quyền {new Date().getFullYear()}. United Software Solutions, Mọi quyền được bảo lưu
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}

// Dữ liệu dịch vụ (features)
const features = [
  {
    icon: (
      <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
        <svg
          className="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>
    ),
    title: "Chăm sóc người cao tuổi",
    desc: "Dịch vụ chăm sóc toàn diện cho người cao tuổi, từ hỗ trợ sinh hoạt hàng ngày đến theo dõi sức khỏe.",
  },
  {
    icon: (
      <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
        <svg
          className="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    ),
    title: "Phục hồi chức năng",
    desc: "Hỗ trợ tập luyện phục hồi chức năng chuyên nghiệp tại nhà cho bệnh nhân sau phẫu thuật hoặc tai biến.",
  },
  {
    icon: (
      <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
        <svg
          className="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
    ),
    title: "Giám sát sức khỏe",
    desc: "Theo dõi các chỉ số sức khỏe quan trọng và cung cấp báo cáo định kỳ cho gia đình và bác sĩ điều trị.",
  },
  {
    icon: (
      <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
        <svg
          className="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
    ),
    title: "Y tá chuyên nghiệp",
    desc: "Đội ngũ y tá được đào tạo chuyên nghiệp, có chứng chỉ hành nghề và kinh nghiệm trong chăm sóc người bệnh.",
  },
  {
    icon: (
      <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
        <svg
          className="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    ),
    title: "Linh hoạt lịch trình",
    desc: "Dễ dàng đặt lịch và điều chỉnh thời gian, tần suất chăm sóc theo nhu cầu gia đình.",
  },
  {
    icon: (
      <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
        <svg
          className="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </div>
    ),
    title: "Tư vấn y tế 24/7",
    desc: "Dịch vụ tư vấn y tế từ xa với các chuyên gia y tế, sẵn sàng hỗ trợ 24/7 trong trường hợp khẩn cấp.",
  },
];
