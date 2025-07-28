'use client';

import { motion } from 'framer-motion';
import { FaWallet, FaPlus, FaTimes } from 'react-icons/fa';

const WalletIconDropdown = ({ wallet, onDeposit, onViewDetails, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Ví điện tử</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="mb-4">
          <div className="text-2xl font-bold text-purple-600">
            {wallet.Amount.toLocaleString('vi-VN')}đ
          </div>
          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
            wallet.Status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {wallet.Status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={onDeposit}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            <FaPlus className="text-sm" />
            Nạp tiền
          </button>
          <button
            onClick={onViewDetails}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            <FaWallet className="text-sm" />
            Xem chi tiết
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletIconDropdown; 