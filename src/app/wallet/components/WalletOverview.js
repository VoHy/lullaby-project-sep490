'use client';

import { motion } from 'framer-motion';
import { FaWallet, FaPlus, FaPowerOff, FaCheck } from 'react-icons/fa';

// Utility function để lấy wallet amount một cách nhất quán
const getWalletAmount = (wallet) => {
  return wallet?.amount || wallet?.Amount || 0;
};

// Utility function để lấy wallet status một cách nhất quán
const getWalletStatus = (wallet) => {
  return wallet?.status || wallet?.Status || 'inactive';
};

// Utility function để lấy wallet note một cách nhất quán
const getWalletNote = (wallet) => {
  return wallet?.note || wallet?.Note || '';
};

const WalletOverview = ({ wallet, onDeposit, onToggleStatus, isUpdatingStatus }) => {
  if (!wallet) return null;

  const amount = getWalletAmount(wallet);
  const status = getWalletStatus(wallet);
  const note = getWalletNote(wallet);
  const isActive = status === 'active';

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
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isActive ? 'Hoạt động' : 'Không hoạt động'}
          </div>
          <button
            onClick={() => onToggleStatus(wallet)}
            disabled={isUpdatingStatus}
            className={`p-2 rounded-lg transition-colors ${
              isActive 
                ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
            } disabled:opacity-50`}
            title={isActive ? 'Vô hiệu hóa ví' : 'Kích hoạt ví'}
          >
            {isUpdatingStatus ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : isActive ? (
              <FaPowerOff className="text-sm" />
            ) : (
              <FaCheck className="text-sm" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {amount.toLocaleString('vi-VN')}đ
          </div>
          <div className="text-sm text-gray-500">Số dư hiện tại</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            {amount > 0 ? amount.toLocaleString('vi-VN') : '0'}đ
          </div>
          <div className="text-sm text-gray-500">Tổng nạp</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {wallet?.walletID || wallet?.WalletID || 'N/A'}
          </div>
          <div className="text-sm text-gray-500">Mã ví</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onDeposit}
          disabled={!isActive}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPlus className="text-sm" />
          Nạp tiền
        </button>
      </div>

      {!isActive && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            Ví đang bị vô hiệu hóa. Vui lòng kích hoạt để sử dụng các tính năng nạp tiền.
          </p>
        </div>
      )}

      {note && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{note}</p>
        </div>
      )}
    </motion.div>
  );
};

export default WalletOverview; 