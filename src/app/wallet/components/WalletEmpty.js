'use client';

import { motion } from 'framer-motion';
import { FaWallet, FaPlus } from 'react-icons/fa';

const WalletEmpty = ({ onCreateWallet }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl shadow-lg p-8 text-center"
    >
      <div className="mb-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaWallet className="text-3xl text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Chưa có ví điện tử
        </h3>
        <p className="text-gray-600 mb-6">
          Bạn cần tạo ví điện tử để có thể nạp tiền và sử dụng các dịch vụ thanh toán.
        </p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Tính năng ví điện tử:</h4>
        <ul className="text-left space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <FaPlus className="text-green-500 text-xs" />
            Nạp tiền an toàn và nhanh chóng
          </li>
          <li className="flex items-center gap-2">
            <FaPlus className="text-green-500 text-xs" />
            Thanh toán dịch vụ chăm sóc
          </li>
          <li className="flex items-center gap-2">
            <FaPlus className="text-green-500 text-xs" />
            Xem lịch sử giao dịch chi tiết
          </li>
          <li className="flex items-center gap-2">
            <FaPlus className="text-green-500 text-xs" />
            Quản lý số dư dễ dàng
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        {/* Button test tạo ví thủ công */}
        <button
          onClick={onCreateWallet}
          className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <FaPlus className="text-sm" />
          Tạo ví ngay
        </button>
        
        <p className="text-xs text-gray-500">
          Ví sẽ được tạo tự động khi bạn đăng nhập
        </p>
      </div>
    </motion.div>
  );
};

export default WalletEmpty; 