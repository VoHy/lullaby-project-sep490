'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMinus, FaTimes } from 'react-icons/fa';

const WithdrawModal = ({ isOpen, onClose, amount, setAmount, onWithdraw, walletAmount }) => {
  const [tempAmount, setTempAmount] = useState('');

  const handleWithdraw = () => {
    if (!tempAmount || parseFloat(tempAmount) <= 0) return;
    if (parseFloat(tempAmount) > walletAmount) return;
    
    setAmount(tempAmount);
    onWithdraw();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaMinus className="text-blue-500" />
            Rút tiền
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số tiền rút (VNĐ)
            </label>
            <input
              type="number"
              value={tempAmount}
              onChange={(e) => setTempAmount(e.target.value)}
              placeholder="Nhập số tiền..."
              max={walletAmount}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Số dư khả dụng: {walletAmount.toLocaleString('vi-VN')}đ
            </p>
          </div>
          
          {parseFloat(tempAmount) > walletAmount && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                Số tiền rút không được vượt quá số dư hiện tại
              </p>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleWithdraw}
              disabled={!tempAmount || parseFloat(tempAmount) <= 0 || parseFloat(tempAmount) > walletAmount}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Rút tiền
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WithdrawModal; 