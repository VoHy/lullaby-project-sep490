'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUserMd, FaCalendarAlt, FaPhone, FaArrowRight } from 'react-icons/fa';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext'; 

const CTASection = () => {
  const { user } = useContext(AuthContext);

  const trustIndicators = [
    {
      icon: <FaUserMd className="text-white text-2xl" />,
      title: 'Chuyên gia y tế',
      description: 'Đội ngũ y tá và chuyên gia được đào tạo chuyên nghiệp'
    },
    {
      icon: <FaCalendarAlt className="text-white text-2xl" />,
      title: 'Linh hoạt lịch trình',
      description: 'Dễ dàng đặt lịch và điều chỉnh theo nhu cầu'
    },
    {
      icon: <FaPhone className="text-white text-2xl" />,
      title: 'Tư vấn 24/7',
      description: 'Hỗ trợ tư vấn y tế từ xa mọi lúc'
    }
  ];

  return (
    <motion.section
      className="py-20 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Sẵn sàng trải nghiệm?
              <span className="block text-2xl md:text-3xl font-light mt-2 text-white/90">
                Đăng ký ngay hôm nay
              </span>
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Hãy để chúng tôi chăm sóc người thân yêu của bạn với sự tận tâm và chuyên nghiệp
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href={user ? "/services" : "/auth/register"}
              className="group inline-flex items-center gap-3 bg-white text-purple-600 hover:bg-gray-50 font-bold px-8 py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Bắt đầu ngay
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/services"
              className="group inline-flex items-center gap-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold px-8 py-4 rounded-full transition-all duration-300"
            >
              <FaCalendarAlt className="group-hover:rotate-12 transition-transform" />
              Đặt lịch
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  {indicator.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{indicator.title}</h3>
                <p className="text-white/80 text-sm">{indicator.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTASection;