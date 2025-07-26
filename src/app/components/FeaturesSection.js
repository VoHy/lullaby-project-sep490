'use client';

import { motion } from 'framer-motion';
import { FaStar, FaCheckCircle } from 'react-icons/fa';

const FeaturesSection = () => {
  const features = [
    {
      icon: (
        <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100">
          <img src="/images/service-elderly.jpg" alt="Combo Chăm sóc toàn diện" className="object-cover w-full h-full" />
        </div>
      ),
      title: 'Combo Chăm sóc toàn diện',
      desc: (
        <div className="space-y-3">
          <div className="space-y-2">
            {[
              'Khám sức khỏe tổng quát',
              'Lên phác đồ chăm sóc cá nhân',
              'Chăm sóc vệ sinh cá nhân',
              'Hỗ trợ ăn uống, dinh dưỡng',
              'Theo dõi chỉ số sức khỏe',
              'Tư vấn y tế 24/7',
              'Báo cáo định kỳ cho gia đình'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <FaCheckCircle className="text-green-500 text-sm flex-shrink-0" />
                <span className="text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
      badge: 'Giảm 20%'
    },
    {
      icon: (
        <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
          <img src="/images/hero-bg.jpg" alt="Combo Phục hồi chức năng" className="object-cover w-full h-full" />
        </div>
      ),
      title: 'Combo Phục hồi chức năng',
      desc: (
        <div className="space-y-3">
          <div className="space-y-2">
            {[
              'Đánh giá chức năng vận động',
              'Lập kế hoạch phục hồi cá nhân',
              'Tập vật lý trị liệu chuyên sâu',
              'Theo dõi tiến trình phục hồi',
              'Hỗ trợ tâm lý và động viên',
              'Tư vấn dinh dưỡng phục hồi'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <FaCheckCircle className="text-green-500 text-sm flex-shrink-0" />
                <span className="text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
      badge: 'Giảm 15%'
    },
    {
      icon: (
        <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
          <img src="/images/service-elderly.jpg" alt="Combo Chăm sóc sau phẫu thuật" className="object-cover w-full h-full" />
        </div>
      ),
      title: 'Combo Chăm sóc sau phẫu thuật',
      desc: (
        <div className="space-y-3">
          <div className="space-y-2">
            {[
              'Đánh giá tình trạng hậu phẫu',
              'Chăm sóc vết mổ, thay băng',
              'Theo dõi dấu hiệu sinh tồn',
              'Hỗ trợ vận động nhẹ nhàng',
              'Tư vấn phục hồi và dinh dưỡng'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <FaCheckCircle className="text-green-500 text-sm flex-shrink-0" />
                <span className="text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
      badge: 'Giảm 10%'
    }
  ];

  return (
    <motion.section
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Dịch vụ của chúng tôi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Lullaby cung cấp các gói dịch vụ chăm sóc y tế tại nhà toàn diện, 
            được thiết kế đặc biệt cho nhu cầu của người cao tuổi
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="p-8">
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors">
                  {feature.title}
                </h3>
                <div className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </div>
                {feature.badge && (
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 font-semibold px-4 py-2 rounded-full text-sm">
                      <FaStar className="text-pink-500" />
                      {feature.badge}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection; 