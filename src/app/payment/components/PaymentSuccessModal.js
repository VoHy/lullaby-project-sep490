import { FaCheckCircle, FaHistory, FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessModal({ isOpen, onClose, invoiceId }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="text-green-600 text-4xl" />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Thanh toán thành công!
        </h2>
        <p className="text-gray-600 mb-6">
          Giao dịch của bạn đã được xử lý thành công. 
          Bạn có thể xem chi tiết trong lịch sử thanh toán.
        </p>

        {/* Invoice ID */}
        {invoiceId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Mã giao dịch</p>
            <p className="font-bold text-gray-800">#{invoiceId}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              router.push('/payment/history');
            }}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FaHistory className="text-sm" />
            Xem lịch sử thanh toán
          </button>
          
          <button
            onClick={() => {
              onClose();
              router.push('/');
            }}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FaHome className="text-sm" />
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
} 