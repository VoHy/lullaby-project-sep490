'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTimes, FaCreditCard, FaWallet } from 'react-icons/fa';

const DepositModal = ({ isOpen, onClose, amount, setAmount, onDeposit, walletId, myWallet, error, onPayOSPayment }) => {
  const [step, setStep] = useState('input'); // 'input' | 'confirm' | 'success'
  const [tempAmount, setTempAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet'); // 'wallet' | 'payos'

  const validateAmount = (amount) => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      return 'Vui lòng nhập số tiền hợp lệ';
    }
    if (numAmount < 1000) {
      return 'Số tiền tối thiểu là 1,000 VNĐ';
    }
    if (numAmount > 10000000) {
      return 'Số tiền tối đa là 10,000,000 VNĐ';
    }
    if (numAmount % 1000 !== 0) {
      return 'Số tiền phải là bội số của 1,000 VNĐ';
    }
    return '';
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setTempAmount(value);
    setValidationError(validateAmount(value));
  };

  const handleConfirm = async () => {
    const error = validateAmount(tempAmount);
    if (error) {
      setValidationError(error);
      return;
    }

    if (paymentMethod === 'payos') {
      if (onPayOSPayment) {
        onPayOSPayment(tempAmount);
      }
      return;
    }

    setLoading(true);
    try {
      setAmount(tempAmount); // Ensure parent state is updated for direct deposit
      await onDeposit();
      setStep('success');
    } catch (error) {
      console.error('Lỗi nạp tiền:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('input');
    setTempAmount('');
    setLoading(false);
    setValidationError('');
    setPaymentMethod('wallet');
    onClose();
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
            <FaPlus className="text-green-500" />
            Nạp tiền
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        {/* Hiển thị lỗi nếu có */}
        {(error || validationError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error || validationError}</p>
          </div>
        )}

        {step === 'input' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền nạp (VNĐ)
              </label>
              <input
                type="number"
                value={tempAmount}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="1000"
                step="1000"
                max="10000000"
              />
              <div className="mt-1 text-xs text-gray-500">
                <p>• Số tiền tối thiểu: 1,000 VNĐ</p>
                <p>• Số tiền tối đa: 10,000,000 VNĐ</p>
                <p>• Phải là bội số của 1,000 VNĐ</p>
              </div>
            </div>
            
            {myWallet && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Số dư hiện tại: <span className="font-semibold">{myWallet.Amount?.toLocaleString() || '0'} VNĐ</span></p>
              </div>
            )}

            {/* Phương thức thanh toán */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phương thức thanh toán
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-green-600"
                  />
                  <FaWallet className="text-green-500" />
                  <div>
                    <span className="font-medium">Nạp trực tiếp</span>
                    <p className="text-xs text-gray-500">Nạp tiền trực tiếp vào ví (miễn phí)</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="payos"
                    checked={paymentMethod === 'payos'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <FaCreditCard className="text-blue-500" />
                  <div>
                    <span className="font-medium">Thanh toán qua PayOS</span>
                    <p className="text-xs text-gray-500">Chuyển khoản ngân hàng, thẻ ATM, QR Code</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => setStep('confirm')}
                disabled={!tempAmount || parseFloat(tempAmount) < 1000 || validationError || loading}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Xác nhận nạp tiền</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-lg font-bold text-blue-600">
                  {parseFloat(tempAmount).toLocaleString()} VNĐ
                </p>
                <p className="text-sm text-gray-600">
                  Phương thức: {paymentMethod === 'wallet' ? 'Nạp trực tiếp' : 'Thanh toán qua PayOS'}
                </p>
                <p className="text-sm text-gray-600">Số tiền sẽ được nạp vào ví của bạn</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setStep('input')}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận nạp tiền'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-green-600 text-4xl mb-2">✓</div>
            <div className="text-center">
              <h4 className="font-bold text-green-700 mb-2">Nạp tiền thành công!</h4>
              <p className="text-gray-600 text-sm">
                Số tiền {parseFloat(tempAmount).toLocaleString()} VNĐ đã được nạp vào ví của bạn
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

export default DepositModal; 