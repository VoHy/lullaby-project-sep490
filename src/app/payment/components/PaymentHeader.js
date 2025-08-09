import { FaCreditCard } from 'react-icons/fa';

export default function PaymentHeader() {
  return (
    <div className="text-center mb-8">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center shadow-lg mx-auto mb-4">
        <FaCreditCard className="text-white text-3xl" />
      </div>
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        Thanh toán dịch vụ
      </h1>
      <p className="text-gray-600 mt-2">Xác nhận thông tin và hoàn tất thanh toán</p>
    </div>
  );
} 