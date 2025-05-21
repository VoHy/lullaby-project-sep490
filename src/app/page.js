'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import authService from '@/services/auth/authService';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

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
    <div className="opacity-0 animate-fade-in">
      {/* Banner dịch vụ - Swiper full màn hình */}
      <section className="w-full min-h-screen flex items-center justify-center bg-white">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-screen"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="relative w-full h-full">
              <img src="/images/hero-bg.jpg" alt="Chăm sóc người cao tuổi" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Chăm sóc người cao tuổi</h2>
                <p className="text-white mb-6 text-lg md:text-2xl">Dịch vụ chăm sóc tận tâm cho người lớn tuổi tại nhà.</p>
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition text-lg">Tìm hiểu thêm</button>
              </div>
            </div>
          </SwiperSlide>
          {/* Slide 2 */}
          <SwiperSlide>
            <div className="relative w-full h-full">
              <img src="/images/hero-bg.jpg" alt="Phục hồi chức năng" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Phục hồi chức năng</h2>
                <p className="text-white mb-6 text-lg md:text-2xl">Hỗ trợ tập luyện phục hồi chức năng chuyên nghiệp.</p>
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition text-lg">Tìm hiểu thêm</button>
              </div>
            </div>
          </SwiperSlide>
          {/* Slide 3 */}
          <SwiperSlide>
            <div className="relative w-full h-full">
              <img src="/images/hero-bg.jpg" alt="Giám sát sức khỏe" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Giám sát sức khỏe</h2>
                <p className="text-white mb-6 text-lg md:text-2xl">Theo dõi sức khỏe và báo cáo định kỳ cho gia đình.</p>
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition text-lg">Tìm hiểu thêm</button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Dịch vụ của chúng tôi
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Lullaby cung cấp nhiều dịch vụ chăm sóc y tế tại nhà
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Chăm sóc người cao tuổi</h3>
                <p className="mt-3 text-base text-gray-500">
                  Dịch vụ chăm sóc toàn diện cho người cao tuổi, từ hỗ trợ sinh hoạt hàng ngày đến theo dõi sức khỏe.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Phục hồi chức năng</h3>
                <p className="mt-3 text-base text-gray-500">
                  Hỗ trợ tập luyện phục hồi chức năng chuyên nghiệp tại nhà cho bệnh nhân sau phẫu thuật hoặc tai biến.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Giám sát sức khỏe</h3>
                <p className="mt-3 text-base text-gray-500">
                  Theo dõi các chỉ số sức khỏe quan trọng và cung cấp báo cáo định kỳ cho gia đình và bác sĩ điều trị.
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Y tá chuyên nghiệp</h3>
                <p className="mt-3 text-base text-gray-500">
                  Đội ngũ y tá được đào tạo chuyên nghiệp, có chứng chỉ hành nghề và kinh nghiệm trong chăm sóc người bệnh.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Linh hoạt lịch trình</h3>
                <p className="mt-3 text-base text-gray-500">
                  Dễ dàng đặt lịch và điều chỉnh thời gian, tần suất chăm sóc theo nhu cầu gia đình.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="rounded-md bg-blue-50 w-12 h-12 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Tư vấn y tế 24/7</h3>
                <p className="mt-3 text-base text-gray-500">
                  Dịch vụ tư vấn y tế từ xa với các chuyên gia y tế, sẵn sàng hỗ trợ 24/7 trong trường hợp khẩn cấp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-100 rounded-xl">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Sẵn sàng trải nghiệm?</span>
            <span className="block text-blue-100">Đăng ký ngay hôm nay.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/auth/register" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                Bắt đầu ngay
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/booking/new" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800">
                Đặt lịch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
