'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTimes } from 'react-icons/fa';
import PaymentModal from '@/app/payment/components/PaymentModal';

const DepositModal = ({ isOpen, onClose, amount, setAmount, onDeposit, walletId }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tempAmount, setTempAmount] = useState('');

  const handleProceedToPayment = () => {
    if (!tempAmount || parseFloat(tempAmount) <= 0) return;

    setAmount(tempAmount);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (result) => {
    // Gọi callback từ parent component
    if (onDeposit) {
      onDeposit();
    }
    setShowPaymentModal(false);
    setTempAmount('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
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
              <FaPlus className="text-green-500" />
              Nạp tiền
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
                Số tiền nạp (VNĐ)
              </label>
              <input
                type="number"
                value={tempAmount}
                onChange={(e) => setTempAmount(e.target.value)}
                placeholder="Nhập số tiền..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleProceedToPayment}
                disabled={!tempAmount || parseFloat(tempAmount) <= 0}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={parseFloat(tempAmount) || 0}
        walletId={walletId}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default DepositModal; 