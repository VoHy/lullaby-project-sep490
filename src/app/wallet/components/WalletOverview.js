'use client';

import { motion } from 'framer-motion';
import { FaWallet, FaPlus, FaMinus } from 'react-icons/fa';

const WalletOverview = ({ wallet, onDeposit, onWithdraw }) => {
  if (!wallet) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FaWallet className="text-purple-500" />
          Ví điện tử
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          wallet.Status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {wallet.Status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {wallet.Amount.toLocaleString('vi-VN')}đ
          </div>
          <div className="text-sm text-gray-500">Số dư hiện tại</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            {wallet.Amount > 0 ? wallet.Amount.toLocaleString('vi-VN') : '0'}đ
          </div>
          <div className="text-sm text-gray-500">Tổng nạp</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-red-600">
            0đ
          </div>
          <div className="text-sm text-gray-500">Tổng rút</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onDeposit}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          <FaPlus className="text-sm" />
          Nạp tiền
        </button>
        <button
          onClick={onWithdraw}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          <FaMinus className="text-sm" />
          Rút tiền
        </button>
      </div>

      {wallet.Note && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{wallet.Note}</p>
        </div>
      )}
    </motion.div>
  );
};

export default WalletOverview; 