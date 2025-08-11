'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedCounter = ({ targetValue }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(targetValue.replace(/\D/g, '')) || 0; // bỏ ký tự không phải số
    const duration = 1500; // ms
    const stepTime = Math.max(Math.floor(duration / end), 20);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetValue]);

  // Giữ lại ký tự đặc biệt như "+"
  const suffix = targetValue.replace(/[0-9]/g, '');

  return (
    <>
      {count}
      {suffix}
    </>
  );
};

const StatsSection = () => {
  const stats = [
    { value: '500+', label: 'Khách hàng hài lòng' },
    { value: '50+', label: 'Chuyên gia y tế' },
    { value: '500+', label: 'Khách hàng được hỗ trợ' },
    { value: '98%', label: 'Đánh giá tích cực' }
  ];

  return (
    <motion.section
      className="py-16 bg-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center"
            >
              <motion.div
                className="text-3xl md:text-4xl font-bold text-pink-600 mb-2"
                initial={{ scale: 1 }}
                whileInView={{
                  scale: [1, 1.2, 1],
                  transition: { duration: 0.6, delay: 0.3 + index * 0.2 }
                }}
              >
                <AnimatedCounter targetValue={stat.value} />
              </motion.div>
              <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default StatsSection;
