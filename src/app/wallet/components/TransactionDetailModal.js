'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaWallet, FaCalendar, FaMoneyBillWave, FaUser, FaStickyNote, FaClock, FaCheckCircle } from 'react-icons/fa';

const TransactionDetailModal = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  // Đóng modal bằng phím ESC
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'paid': return 'Đã thanh toán';
      case 'failed': return 'Thất bại';
      default: return 'Không xác định';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaWallet className="text-purple-500" />
            Chi tiết giao dịch
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaWallet className="text-purple-500" />
                <span className="font-semibold text-gray-700">Thông tin giao dịch</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-medium">#{transaction.transactionHistoryID}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã ví:</span>
                  <span className="font-medium">#{transaction.walletID}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã hóa đơn:</span>
                  <span className="font-medium">#{transaction.invoiceID}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {getStatusText(transaction.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendar className="text-purple-500" />
                <span className="font-semibold text-gray-700">Thời gian</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày giao dịch:</span>
                  <span className="font-medium">{formatDate(transaction.transactionDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin số tiền */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaMoneyBillWave className="text-purple-500 text-xl" />
              <span className="font-semibold text-gray-700 text-lg">Thông tin số tiền</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Số dư trước</div>
                <div className="text-lg font-bold text-gray-800">
                  {transaction.before?.toLocaleString('vi-VN')}₫
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Số tiền giao dịch</div>
                <div className={`text-lg font-bold ${transaction.amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {transaction.amount > 0 ? '-' : ''}{transaction.amount?.toLocaleString('vi-VN')}₫
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Số dư sau</div>
                <div className="text-lg font-bold text-gray-800">
                  {transaction.after?.toLocaleString('vi-VN')}₫
                </div>
              </div>
            </div>
            {/* Thêm thông tin về loại giao dịch */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Loại giao dịch</div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  transaction.amount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.amount > 0 ? 'Nạp tiền' : 'Thanh toán'}
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin người tham gia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaUser className="text-blue-500" />
                <span className="font-semibold text-gray-700">Người chuyển</span>
              </div>
              <div className="text-sm text-gray-600">{transaction.transferrer}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaUser className="text-green-500" />
                <span className="font-semibold text-gray-700">Người nhận</span>
              </div>
              <div className="text-sm text-gray-600">{transaction.receiver}</div>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaStickyNote className="text-yellow-500" />
              <span className="font-semibold text-gray-700">Ghi chú</span>
            </div>
            <div className="text-sm text-gray-600">{transaction.note}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TransactionDetailModal; 