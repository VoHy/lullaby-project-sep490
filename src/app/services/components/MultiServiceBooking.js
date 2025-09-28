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
  user,
  hasCareProfiles = false,
  careProfiles // page may pass the array under this name
}) => {
  const router = useRouter();
  const { token } = useContext(AuthContext);

  // Normalize hasCareProfiles: allow the parent to pass either a boolean
  // `hasCareProfiles` or the array `careProfiles`.
  const effectiveHasCareProfiles = Boolean(hasCareProfiles) || (Array.isArray(careProfiles) && careProfiles.length > 0);

  if (selectedServices.length <= 1) return null;

  const handleBooking = () => {
    // Kiểm tra nếu chưa đăng nhập
    if (!user || !token) {
      router.push('/auth/login');
      return;
    }

    // If user is logged in but has no care profiles, send them to create a profile
    if (user && token && !effectiveHasCareProfiles) {
      router.push('/profile/patient');
      return;
    }

    // Tạo danh sách dịch vụ với thông tin chi tiết và số lượng (mỗi suất là 1 object)
    let servicesData = [];
    selectedServices.forEach(serviceId => {
      const serviceInfo = serviceTypes.find(s => s.serviceID === serviceId || s.serviceTypeID === serviceId) || null;
      const quantity = serviceQuantities[serviceId] || 1;
      for (let i = 0; i < quantity; i++) {
        servicesData.push({
          serviceID: serviceInfo?.serviceID ?? serviceId,
          serviceTypeID: serviceInfo?.serviceTypeID ?? serviceId,
          serviceName: serviceInfo?.serviceName ?? serviceInfo?.ServiceName ?? 'Dịch vụ',
          price: serviceInfo?.price ?? serviceInfo?.Price ?? 0,
          duration: serviceInfo?.duration ?? serviceInfo?.Duration ?? 60,
          forMom: serviceInfo?.forMom ?? false,
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