'use client';

import React from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Chăm sóc mẹ sau sinh',
      desc: 'Dịch vụ hỗ trợ phục hồi sức khỏe, chăm sóc tinh thần và thể chất cho mẹ sau sinh một cách an toàn và khoa học.',
      icon: '/images/caremom.png',
      badge: 'Nổi bật',
    },
    {
      title: 'Chăm sóc bé sơ sinh',
      desc: 'Chăm sóc bé từ những ngày đầu đời với sự tận tâm và chuyên nghiệp, đảm bảo bé khỏe mạnh và phát triển toàn diện.',
      icon: '/images/carechild.jpg',
      badge: 'Phổ biến',
    },
    {
      title: 'Theo dõi sức khỏe mẹ & bé',
      desc: 'Theo dõi định kỳ tình trạng sức khỏe của mẹ và bé để phát hiện sớm và xử lý kịp thời các vấn đề tiềm ẩn.',
      icon: '/images/images-5.jpg',
      badge: 'Mới',
    },
  ];

  // Motion variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.18, delayChildren: 0.1 }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
      className="py-20 bg-gradient-to-b from-white to-pink-50"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Tiêu đề */}
        <motion.div variants={item} className="text-center mb-14">
          <motion.h2
            variants={item}
            className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 mb-5 drop-shadow-lg"
          >
            Dịch vụ của chúng tôi
          </motion.h2>
          <motion.p
            variants={item}
            className="text-xl text-gray-600 font-medium"
          >
            Mang đến trải nghiệm chăm sóc tận tâm và chuyên nghiệp.
          </motion.p>
        </motion.div>

        {/* Grid features */}
        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{
                scale: 1.045,
                boxShadow: '0 8px 32px 0 rgba(180, 70, 255, 0.15)',
                borderColor: '#e879f9'
              }}
              className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-transparent transition-all duration-400 group h-80 bg-white"
            >
              {/* Background image */}
              <img
                src={feature.icon}
                alt={feature.title}
                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Overlay tối + gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-pink-700/60 group-hover:via-purple-700/40 transition-all duration-400"></div>

              {/* Nội dung */}
              <div className="relative z-10 p-7 flex flex-col justify-end h-full text-white 
                transition-all duration-500 ease-out transform group-hover:translate-y-[-6px] group-hover:opacity-100">

                {/* Badge */}
                <motion.span
                  initial={{ opacity: 0, y: 18, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.12, boxShadow: '0 0 16px 2px #f472b6' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold px-5 py-2 rounded-full text-base drop-shadow-lg mb-4
                  transition-all duration-500 ease-out group-hover:shadow-pink-400 group-hover:shadow-lg"
                >
                  <motion.span
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <FaStar className="text-yellow-300 drop-shadow" />
                  </motion.span>
                  {feature.badge}
                </motion.span>

                {/* Tiêu đề */}
                <motion.h3
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, ease: 'easeOut', delay: 0.18 }}
                  className="text-2xl font-extrabold mb-2 transition-colors duration-300 group-hover:text-pink-300 drop-shadow"
                >
                  {feature.title}
                </motion.h3>

                {/* Mô tả */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.22 }}
                  className="text-base text-gray-200 transition-opacity duration-500 ease-out group-hover:opacity-95 font-medium"
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
