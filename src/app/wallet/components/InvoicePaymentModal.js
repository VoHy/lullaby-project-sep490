'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCreditCard, FaTimes, FaCheck } from 'react-icons/fa';

const InvoicePaymentModal = ({ isOpen, onClose, invoice, wallet, onPayment, error }) => {
  const [loading, setLoading] = useState(false);
  const [confirmPayment, setConfirmPayment] = useState(false);

  const handlePayment = async () => {
    if (!invoice || !wallet) return;
    
    setLoading(true);
    try {
      await onPayment(invoice.invoiceID || invoice.InvoiceID);
      setConfirmPayment(true);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmPayment(false);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  const invoiceAmount = invoice?.amount || invoice?.Amount || 0;
  const walletBalance = wallet?.amount || wallet?.Amount || 0;
  const canPay = walletBalance >= invoiceAmount;

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
            <FaCreditCard className="text-blue-500" />
            Thanh toán hóa đơn
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

        {!confirmPayment ? (
          <div className="space-y-4">
            {/* Thông tin hóa đơn */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Thông tin hóa đơn</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Mã hóa đơn:</span> {invoice?.invoiceID || invoice?.InvoiceID}</p>
                <p><span className="font-medium">Số tiền:</span> {invoiceAmount.toLocaleString()} VNĐ</p>
                <p><span className="font-medium">Mô tả:</span> {invoice?.description || invoice?.Description || 'Thanh toán dịch vụ'}</p>
              </div>
            </div>

            {/* Thông tin ví */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Thông tin ví</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Số dư hiện tại:</span> {walletBalance.toLocaleString()} VNĐ</p>
                <p><span className="font-medium">Số tiền cần thanh toán:</span> {invoiceAmount.toLocaleString()} VNĐ</p>
                {canPay ? (
                  <p className="text-green-600 font-medium">✓ Đủ tiền để thanh toán</p>
                ) : (
                  <p className="text-red-600 font-medium">✗ Không đủ tiền để thanh toán</p>
                )}
              </div>
            </div>

            {/* Cảnh báo nếu không đủ tiền */}
            {!canPay && (
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-red-600 text-sm">
                  Số dư ví không đủ để thanh toán. Vui lòng nạp thêm tiền vào ví.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handlePayment}
                disabled={!canPay || loading}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Đang xử lý...' : 'Thanh toán'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="text-green-600 text-4xl mb-2">✓</div>
            <div className="text-center">
              <h4 className="font-bold text-green-700 mb-2">Thanh toán thành công!</h4>
              <p className="text-gray-600 text-sm">
                Hóa đơn {invoice?.invoiceID || invoice?.InvoiceID} đã được thanh toán thành công
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

export default InvoicePaymentModal; 