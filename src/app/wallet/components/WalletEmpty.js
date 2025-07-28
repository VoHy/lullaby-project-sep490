'use client';

import { motion } from 'framer-motion';
import { FaWallet, FaPlus } from 'react-icons/fa';

const WalletEmpty = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaWallet className="text-3xl text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Chưa có ví điện tử
      </h3>
      <p className="text-gray-500 mb-6">
        Bạn cần tạo ví điện tử để sử dụng các tính năng thanh toán
      </p>
      <button className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors">
        <FaPlus className="text-sm" />
        Tạo ví mới
      </button>
    </motion.div>
  );
};

export default WalletEmpty; 