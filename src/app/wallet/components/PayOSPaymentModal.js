'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCreditCard, FaTimes, FaQrcode, FaMobile, FaDesktop } from 'react-icons/fa';

const PayOSPaymentModal = ({ isOpen, onClose, amount, wallet, onPaymentSuccess, error }) => {
  const [step, setStep] = useState('input'); // 'input' | 'qr' | 'processing' | 'success' | 'failed'
  const [paymentMethod, setPaymentMethod] = useState('qr'); // 'qr' | 'mobile' | 'desktop'
  const [qrCode, setQrCode] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const handleCreatePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    console.log('🧪 Test: Bắt đầu tạo PayOS payment, amount:', amount);
    setLoading(true);
    try {
      // Tạo payment session với PayOS (mock data vì không có API tạo payment)
      const mockPaymentData = {
        paymentId: `pay_${Date.now()}`,
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Mock QR code
        paymentUrl: `https://payos.vn/payment/${Date.now()}`,
        amount: parseFloat(amount),
        status: 'pending'
      };
      
      console.log('🧪 Test: Tạo mock payment data:', mockPaymentData);
      
      setPaymentData(mockPaymentData);
      setQrCode(mockPaymentData.qrCode);
      setPaymentUrl(mockPaymentData.paymentUrl);
      setStep('qr');
      console.log('🧪 Test: Chuyển sang step QR');
    } catch (error) {
      console.error('🧪 Test: Lỗi tạo payment:', error);
      setStep('failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    console.log('🧪 Test: Bắt đầu xử lý PayOS payment success');
    setLoading(true);
    try {
      // Xác nhận thanh toán thành công qua webhook
      if (paymentData) {
        console.log('🧪 Test: Gọi webhook APIs với payment data:', paymentData);
        
        // Gọi API webhook handler
        await fetch('/api/payos/webhookhandler', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: paymentData.paymentId,
            status: 'success',
            amount: paymentData.amount,
            walletID: wallet?.walletID || wallet?.WalletID
          })
        });

        // Gọi API webhook process
        await fetch('/api/payos/webhookprocess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: paymentData.paymentId,
            status: 'success',
            amount: paymentData.amount,
            walletID: wallet?.walletID || wallet?.WalletID
          })
        });

        // Gọi API confirm webhook
        await fetch('/api/payos/confirmwebhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: paymentData.paymentId,
            status: 'success',
            amount: paymentData.amount,
            walletID: wallet?.walletID || wallet?.WalletID
          })
        });
        
        console.log('🧪 Test: Webhook APIs được gọi thành công');
      }
      
      setStep('success');
      console.log('🧪 Test: PayOS payment thành công');
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } catch (error) {
      console.error('🧪 Test: Lỗi xử lý PayOS payment:', error);
      setStep('failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('input');
    setQrCode(null);
    setPaymentUrl(null);
    setPaymentData(null);
    setLoading(false);
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
            <FaCreditCard className="text-blue-500" />
            Thanh toán qua PayOS
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

        {step === 'input' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Thông tin thanh toán</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Số tiền:</span> {parseFloat(amount).toLocaleString()} VNĐ</p>
                <p><span className="font-medium">Phương thức:</span> PayOS</p>
                <p><span className="font-medium">Mô tả:</span> Nạp tiền vào ví</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phương thức thanh toán
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="qr"
                    checked={paymentMethod === 'qr'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <FaQrcode className="text-blue-500" />
                  <span>Quét mã QR</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mobile"
                    checked={paymentMethod === 'mobile'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <FaMobile className="text-green-500" />
                  <span>Thanh toán qua điện thoại</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="desktop"
                    checked={paymentMethod === 'desktop'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <FaDesktop className="text-purple-500" />
                  <span>Thanh toán qua máy tính</span>
                </label>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-semibold text-yellow-800 mb-2">Lưu ý:</h5>
              <p className="text-sm text-yellow-700">
                Hiện tại hệ thống đang sử dụng dữ liệu mẫu để demo. 
                Trong môi trường production, cần tích hợp với PayOS API thực tế.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleCreatePayment}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Đang tạo...' : 'Tạo thanh toán'}
              </button>
            </div>
          </div>
        )}

        {step === 'qr' && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Quét mã QR để thanh toán</h4>
              <p className="text-sm text-gray-600 mb-4">
                Sử dụng ứng dụng ngân hàng để quét mã QR bên dưới
              </p>
              
              {qrCode && (
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
              )}
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-semibold text-yellow-800 mb-2">Hướng dẫn:</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Mở ứng dụng ngân hàng trên điện thoại</li>
                <li>• Chọn tính năng quét mã QR</li>
                <li>• Quét mã QR bên trên</li>
                <li>• Xác nhận thông tin và hoàn tất thanh toán</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('input')}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={handlePaymentSuccess}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Đang xử lý...' : 'Tôi đã thanh toán'}
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h4 className="font-semibold text-gray-900 mb-2">Đang xử lý thanh toán</h4>
            <p className="text-sm text-gray-600">Vui lòng chờ trong giây lát...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-green-600 text-4xl mb-2">✓</div>
            <div className="text-center">
              <h4 className="font-bold text-green-700 mb-2">Thanh toán thành công!</h4>
              <p className="text-gray-600 text-sm">
                Số tiền {parseFloat(amount).toLocaleString()} VNĐ đã được nạp vào ví của bạn
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

        {step === 'failed' && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-red-600 text-4xl mb-2">✗</div>
            <div className="text-center">
              <h4 className="font-bold text-red-700 mb-2">Thanh toán thất bại</h4>
              <p className="text-gray-600 text-sm">
                Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setStep('input')}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Thử lại
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PayOSPaymentModal; 