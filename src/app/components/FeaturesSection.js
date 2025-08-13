'use client';

import React from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Gói chăm sóc người cao tuổi',
      desc: 'Dịch vụ tận tâm, chuyên nghiệp giúp người cao tuổi có cuộc sống khỏe mạnh, vui vẻ và ý nghĩa.',
      icon: '/images/hero-bg.jpg',
      badge: 'Nổi bật',
    },
    {
      title: 'Chăm sóc tại nhà',
      desc: 'Dịch vụ chăm sóc sức khỏe và hỗ trợ sinh hoạt ngay tại nhà bạn, giúp tiết kiệm thời gian và chi phí.',
      icon: '/images/hero-bg.jpg',
      badge: 'Phổ biến',
    },
    {
      title: 'Theo dõi sức khỏe định kỳ',
      desc: 'Giám sát sức khỏe định kỳ để phát hiện và xử lý kịp thời các vấn đề tiềm ẩn.',
      icon: '/images/hero-bg.jpg',
      badge: 'Mới',
    },
  ];

  // Motion variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
      className="py-16 bg-gradient-to-b from-white to-pink-50"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Tiêu đề */}
        <motion.div variants={item} className="text-center mb-12">
          <motion.h2 variants={item} className="text-4xl font-extrabold text-gray-900 mb-4">
            Dịch vụ của chúng tôi
          </motion.h2>
          <motion.p variants={item} className="text-lg text-gray-600">
            Mang đến trải nghiệm chăm sóc tận tâm và chuyên nghiệp.
          </motion.p>
        </motion.div>

        {/* Grid features */}
        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group h-80"
            >
              {/* Background image */}
              <img
                src={feature.icon}
                alt={feature.title}
                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-900 ease-out group-hover:scale-110"
              />

              {/* Overlay tối + gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>

              {/* Nội dung */}
              <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white 
                transition-all duration-500 ease-out transform group-hover:translate-y-[-4px] group-hover:opacity-100">
                
                {/* Badge */}
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-pink-500/80 text-white font-semibold px-4 py-1 rounded-full text-sm drop-shadow-md mb-3 
                  transition-all duration-500 ease-out group-hover:translate-y-[-2px] group-hover:shadow-lg"
                >
                  <FaStar className="text-yellow-300" />
                  {feature.badge}
                </motion.span>

                {/* Tiêu đề */}
                <motion.h3
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
                  className="text-xl font-extrabold mb-2 transition-colors duration-300 group-hover:text-pink-300"
                >
                  {feature.title}
                </motion.h3>

                {/* Mô tả */}
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                  className="text-sm text-gray-200 transition-opacity duration-500 ease-out group-hover:opacity-90"
                >
                  {feature.desc}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
