'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCreditCard, FaQrcode, FaCopy, FaCheck } from 'react-icons/fa';
// import walletService from '@/services/api/walletService';

const PaymentModal = ({ isOpen, onClose, amount, walletId, onSuccess }) => {
  const [step, setStep] = useState('select'); // 'select', 'bank-transfer', 'qr-code', 'processing', 'success'
  const [bankInfo, setBankInfo] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // loadPaymentMethods(); // Xóa toàn bộ logic liên quan đến paymentMethods
    }
  }, [isOpen]);

  // const loadPaymentMethods = async () => { // Xóa toàn bộ logic liên quan đến paymentMethods
  //   try {
  //     const methods = await walletService.getPaymentMethods();
  //     setPaymentMethods(methods);
  //   } catch (error) {
  //     console.error('Error loading payment methods:', error);
  //   }
  // };

  // const handleMethodSelect = async (method) => { // Xóa toàn bộ logic liên quan đến paymentMethods
  //   setSelectedMethod(method);
  //   setLoading(true);

  //   try {
  //     // Tạo giao dịch
  //     const transaction = await walletService.createDepositTransaction(
  //       walletId, 
  //       amount, 
  //       method.id
  //     );
  //     setTransactionId(transaction.TransactionID);

  //     // Xử lý theo phương thức
  //     if (method.id === 'bank_transfer') {
  //       const bankInfo = await walletService.getBankInfo();
  //       setBankInfo(bankInfo);
  //       setStep('bank-transfer');
  //     } else if (method.id === 'momo' || method.id === 'zalopay' || method.id === 'vnpay') {
  //       const qrData = await walletService.generateQRCode(amount, method.id);
  //       setQrCode(qrData);
  //       setStep('qr-code');
  //     } else {
  //       // Xử lý các phương thức khác
  //       setStep('processing');
  //       await processPayment(transaction.TransactionID);
  //     }
  //   } catch (error) {
  //     console.error('Error processing payment:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const processPayment = async (txnId) => {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // const result = await walletService.confirmTransaction(txnId, {});
      
      if (result.success) {
        setStep('success');
        if (onSuccess) {
          onSuccess(result);
        }
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show success message
  };

  const renderStep = () => {
    switch (step) {
      case 'select':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chọn phương thức thanh toán
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* {paymentMethods.map((method) => ( // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*   <button // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*     key={method.id} // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*     onClick={() => handleMethodSelect(method)} // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*     disabled={loading} // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*     className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left" // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*   > // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*     <div className="flex items-center gap-3"> // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*       <span className="text-2xl">{method.icon}</span> // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*       <div className="flex-1"> // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*         <h4 className="font-semibold text-gray-900">{method.name}</h4> // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*         <p className="text-sm text-gray-500">{method.description}</p> // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*         <p className="text-xs text-gray-400 mt-1"> // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*           Thời gian: {method.processingTime} • Phí: {method.fee}đ // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*         </p> // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*       </div> // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*     </div> // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/*   </button> // Xóa toàn bộ logic liên quan đến paymentMethods */}
              {/* ))} // Xóa toàn bộ logic liên quan đến paymentMethods */}
            </div>
          </div>
        );

      case 'bank-transfer':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chuyển khoản ngân hàng
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ngân hàng:</span>
                <span className="font-semibold">{bankInfo.bankName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold">{bankInfo.accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(bankInfo.accountNumber)}
                    className="text-purple-500 hover:text-purple-600"
                  >
                    <FaCopy className="text-sm" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tên tài khoản:</span>
                <span className="font-semibold">{bankInfo.accountName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Nội dung:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{bankInfo.transferContent}</span>
                  <button
                    onClick={() => copyToClipboard(bankInfo.transferContent)}
                    className="text-purple-500 hover:text-purple-600"
                  >
                    <FaCopy className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                💡 Sau khi chuyển khoản, giao dịch sẽ được xử lý trong 5-10 phút.
              </p>
            </div>
          </div>
        );

      case 'qr-code':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quét mã QR để thanh toán
            </h3>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border inline-block">
                <img 
                  src={qrCode.qrCodeUrl} 
                  alt="QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Sử dụng ứng dụng {/* selectedMethod.name */} để quét mã QR
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                ⏱️ Đang chờ thanh toán... Vui lòng hoàn thành giao dịch trong ứng dụng.
              </p>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <h3 className="text-lg font-semibold text-gray-900">
              Đang xử lý thanh toán...
            </h3>
            <p className="text-gray-500">
              Vui lòng chờ trong giây lát
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <FaCheck className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Thanh toán thành công!
            </h3>
            <p className="text-gray-500">
              Số tiền {amount.toLocaleString('vi-VN')}đ đã được nạp vào ví của bạn.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              Hoàn thành
            </button>
          </div>
        );

      default:
        return null;
    }
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
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Nạp tiền {amount.toLocaleString('vi-VN')}đ
          </h2>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {renderStep()}
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal; 