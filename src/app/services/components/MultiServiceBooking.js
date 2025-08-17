'use client';

import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

const MultiServiceBooking = ({ 
  selectedServices, 
  serviceQuantities, 
  serviceTypes,
  getMaxQuantityForService,
  user,
  careProfiles,
  relatives
}) => {
  const router = useRouter();
  const { token } = useContext(AuthContext);

  if (selectedServices.length <= 1) return null;

  const handleBooking = () => {
    // Kiểm tra nếu chưa đăng nhập
    if (!user || !token) {
      router.push('/auth/login');
      return;
    }

    // Tạo danh sách dịch vụ với thông tin chi tiết và số lượng (mỗi suất là 1 object)
    let servicesData = [];
    selectedServices.forEach(serviceId => {
      const serviceInfo = serviceTypes.find(s => s.serviceID === serviceId);
      const quantity = serviceQuantities[serviceId] || 1;
      for (let i = 0; i < quantity; i++) {
        servicesData.push({
          ...serviceInfo,
          quantity: 1
        });
      }
    });

    // Tạo URL với tất cả thông tin dịch vụ
    const servicesParam = encodeURIComponent(JSON.stringify(servicesData));
    router.push(`/booking?services=${selectedServices.join(',')}&servicesData=${servicesParam}`);
  };

  return (
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <button
        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
        onClick={handleBooking}
      >
        <FaShoppingCart className="text-xl" />
        Đặt lịch {selectedServices.length} dịch vụ đã chọn
      </button>
    </motion.div>
  );
};

export default MultiServiceBooking; 