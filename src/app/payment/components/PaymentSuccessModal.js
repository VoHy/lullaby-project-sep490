import { FaCheckCircle, FaHistory, FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useWalletContext } from '@/context/WalletContext';

export default function PaymentSuccessModal({ isOpen, onClose, invoiceId, amount }) {
  const router = useRouter();
  const { refreshWalletData } = useWalletContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>
          
          {/* Success Message */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Thanh toán thành công!
          </h3>
          <p className="text-gray-600 mb-6">
            Hóa đơn #{invoiceId} đã được thanh toán thành công.
            <br />
            Số tiền: {amount?.toLocaleString('vi-VN')}₫
          </p>
          
          {/* Countdown */}
          <p className="text-sm text-gray-500 mb-6">
            Bạn sẽ được chuyển về trang booking sau 3 giây...
          </p>
          
          {/* Action Button */}
          <button
            onClick={async () => {
              try {
                console.log('🔄 Refreshing wallet from PaymentSuccessModal...');
                await refreshWalletData();
                console.log('✅ Wallet refreshed from PaymentSuccessModal');
              } catch (error) {
                console.warn('⚠️ Could not refresh wallet from modal:', error);
              }
              onClose();
              router.push('/appointments'); // Redirect to appointments page
            }}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Đi đến trang lịch hẹn ngay
          </button>
        </div>
      </div>
    </div>
  );
}