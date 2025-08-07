'use client';

import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const MultiServiceBooking = ({ selectedServices }) => {
  const router = useRouter();

  if (selectedServices.length <= 1) return null;

  const handleBooking = () => {
    router.push(`/booking?service=${selectedServices.join(',')}`);
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