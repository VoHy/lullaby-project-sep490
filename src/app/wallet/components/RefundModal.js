'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUndo, FaTimes, FaCheck } from 'react-icons/fa';

const RefundModal = ({ isOpen, onClose, invoice, onRefund, error }) => {
  const [loading, setLoading] = useState(false);
  const [confirmRefund, setConfirmRefund] = useState(false);

  const handleRefund = async () => {
    if (!invoice) return;
    
    setLoading(true);
    try {
      await onRefund(invoice.invoiceID || invoice.InvoiceID);
      setConfirmRefund(true);
    } catch (error) {
      console.error('Refund error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmRefund(false);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  const invoiceAmount = invoice?.amount || invoice?.Amount || 0;

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
            <FaUndo className="text-orange-500" />
            Yêu cầu hoàn tiền
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!confirmRefund ? (
          <div className="space-y-4">
            {/* Thông tin hóa đơn */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Thông tin hoàn tiền</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Mã hóa đơn:</span> {invoice?.invoiceID || invoice?.InvoiceID}</p>
                <p><span className="font-medium">Số tiền hoàn:</span> {invoiceAmount.toLocaleString()} VNĐ</p>
                <p><span className="font-medium">Lý do:</span> {invoice?.refundReason || 'Yêu cầu hoàn tiền từ khách hàng'}</p>
              </div>
            </div>

            {/* Thông báo */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Lưu ý</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Số tiền sẽ được hoàn vào ví của bạn</li>
                <li>• Quá trình hoàn tiền có thể mất 1-3 ngày làm việc</li>
                <li>• Bạn sẽ nhận được thông báo khi hoàn tiền thành công</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleRefund}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Đang xử lý...' : 'Gửi yêu cầu hoàn tiền'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="text-green-600 text-4xl mb-2">✓</div>
            <div className="text-center">
              <h4 className="font-bold text-green-700 mb-2">Yêu cầu hoàn tiền đã được gửi!</h4>
              <p className="text-gray-600 text-sm">
                Yêu cầu hoàn tiền cho hóa đơn {invoice?.invoiceID || invoice?.InvoiceID} đã được gửi thành công.
                Chúng tôi sẽ xử lý trong thời gian sớm nhất.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              Đóng
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RefundModal; 