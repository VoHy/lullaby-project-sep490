'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import authService from '@/services/auth/authService';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';

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
            staggerChildren: 0.22
          }
        }
      }}
    >
      {/* Banner dịch vụ */}
      <motion.section
        className="w-full flex items-center justify-center bg-white"
        variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
      >
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-[600px]"
        >
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
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Chăm sóc người cao tuổi</h2>
                <p className="text-white mb-6 text-lg md:text-2xl">Dịch vụ chăm sóc tận tâm cho người lớn tuổi tại nhà.</p>
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition text-lg">Tìm hiểu thêm</button>
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
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Phục hồi chức năng</h2>
                <p className="text-white mb-6 text-lg md:text-2xl">Hỗ trợ tập luyện phục hồi chức năng chuyên nghiệp.</p>
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition text-lg">Tìm hiểu thêm</button>
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
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Giám sát sức khỏe</h2>
                <p className="text-white mb-6 text-lg md:text-2xl">Theo dõi sức khỏe và báo cáo định kỳ cho gia đình.</p>
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition text-lg">Tìm hiểu thêm</button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </motion.section>

      {/* Features Section */}
      <motion.div
        className="py-12 bg-white"
        variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Dịch vụ của chúng tôi
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
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
                  staggerChildren: 0.18
                }
              }
            }}
          >
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
                  }}
                  className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  {feature.icon}
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-3 text-base text-gray-500">{feature.desc}</p>
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
    </motion.div>
  );
}

// Dữ liệu dịch vụ (features)
const features = [
  {
    icon: (
      <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-blue-50">
        <img src="/images/service-elderly.jpg" alt="Combo Chăm sóc toàn diện" className="object-cover w-full h-full" />
      </div>
    ),
    title: 'Combo Chăm sóc toàn diện',
    desc: (
      <>
        <ul className="list-disc pl-5 text-gray-500 mb-2">
          <li>1. Khám sức khỏe tổng quát</li>
          <li>2. Lên phác đồ chăm sóc cá nhân</li>
          <li>3. Chăm sóc vệ sinh cá nhân</li>
          <li>4. Hỗ trợ ăn uống, dinh dưỡng</li>
          <li>5. Theo dõi chỉ số sức khỏe</li>
          <li>6. Tư vấn y tế 24/7</li>
          <li>7. Báo cáo định kỳ cho gia đình</li>
        </ul>
        <span className="inline-block bg-rose-100 text-rose-600 font-bold px-3 py-1 rounded-full text-sm">Giảm 20%</span>
      </>
    )
  },
  {
    icon: (
      <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-blue-50">
        <img src="/images/hero-bg.jpg" alt="Combo Phục hồi chức năng" className="object-cover w-full h-full" />
      </div>
    ),
    title: 'Combo Phục hồi chức năng',
    desc: (
      <>
        <ul className="list-disc pl-5 text-gray-500 mb-2">
          <li>1. Đánh giá chức năng vận động</li>
          <li>2. Lập kế hoạch phục hồi cá nhân</li>
          <li>3. Tập vật lý trị liệu chuyên sâu</li>
          <li>4. Theo dõi tiến trình phục hồi</li>
          <li>5. Hỗ trợ tâm lý và động viên</li>
          <li>6. Tư vấn dinh dưỡng phục hồi</li>
        </ul>
        <span className="inline-block bg-rose-100 text-rose-600 font-bold px-3 py-1 rounded-full text-sm">Giảm 15%</span>
      </>
    )
  },
  {
    icon: (
      <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-blue-50">
        <img src="/images/service-elderly.jpg" alt="Combo Chăm sóc sau phẫu thuật" className="object-cover w-full h-full" />
      </div>
    ),
    title: 'Combo Chăm sóc sau phẫu thuật',
    desc: (
      <>
        <ul className="list-disc pl-5 text-gray-500 mb-2">
          <li>1. Đánh giá tình trạng hậu phẫu</li>
          <li>2. Chăm sóc vết mổ, thay băng</li>
          <li>3. Theo dõi dấu hiệu sinh tồn</li>
          <li>4. Hỗ trợ vận động nhẹ nhàng</li>
          <li>5. Tư vấn phục hồi và dinh dưỡng</li>
        </ul>
        <span className="inline-block bg-rose-100 text-rose-600 font-bold px-3 py-1 rounded-full text-sm">Giảm 10%</span>
      </>
    )
  },
  {
    icon: (
      <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    ),
    title: 'Y tá chuyên nghiệp',
    desc: 'Đội ngũ y tá được đào tạo chuyên nghiệp, có chứng chỉ hành nghề và kinh nghiệm trong chăm sóc người bệnh.'
  },
  {
    icon: (
      <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    ),
    title: 'Linh hoạt lịch trình',
    desc: 'Dễ dàng đặt lịch và điều chỉnh thời gian, tần suất chăm sóc theo nhu cầu gia đình.'
  },
  {
    icon: (
      <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </div>
    ),
    title: 'Tư vấn y tế 24/7',
    desc: 'Dịch vụ tư vấn y tế từ xa với các chuyên gia y tế, sẵn sàng hỗ trợ 24/7 trong trường hợp khẩn cấp.'
  },
];
