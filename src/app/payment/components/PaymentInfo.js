import { FaWallet } from 'react-icons/fa';

export default function PaymentInfo({ 
  total, 
  myWallet, 
  error, 
  loading, 
  handleConfirm,
  isProcessingPayment
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <FaWallet className="text-green-600 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Thông tin thanh toán</h2>
      </div>

      {/* Tổng tiền */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">Tổng tiền cần thanh toán</div>
          <div className="text-4xl font-bold text-pink-600">{total.toLocaleString()}đ</div>
        </div>
      </div>

      {/* Thông tin ví */}
      {myWallet && (
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">Thông tin ví</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Số dư hiện tại:</span>
              <span className={`font-bold ${myWallet.Amount < total ? "text-red-500" : "text-green-600"}`}>
                {myWallet.Amount.toLocaleString()}đ
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Số tiền cần trừ:</span>
              <span className="font-bold text-pink-600">{total.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Số dư sau thanh toán:</span>
              <span className={`font-bold ${myWallet.Amount < total ? "text-red-500" : "text-green-600"}`}>
                {(myWallet.Amount - total).toLocaleString()}đ
              </span>
            </div>
          </div>
          {myWallet.Amount < total && (
            <div className="mt-3 p-3 bg-red-100 rounded-lg">
              <div className="text-red-700 text-sm font-semibold">
                ⚠️ Số dư ví không đủ để thanh toán!
              </div>
              <div className="text-red-600 text-xs mt-1">
                Vui lòng nạp thêm {(total - myWallet.Amount).toLocaleString()}đ
              </div>
            </div>
          )}
        </div>
      )}

      {/* Thông báo lỗi */}
      {error && (
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
          <div className="text-red-700 font-semibold text-center">{error}</div>
        </div>
      )}

      {/* Nút thanh toán */}
      <button
        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 ${
          myWallet && myWallet.Amount >= total
            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-105 hover:shadow-xl"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        onClick={handleConfirm}
        disabled={loading || (myWallet && myWallet.Amount < total) || isProcessingPayment}
      >
        {loading || isProcessingPayment ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Đang xử lý...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <FaWallet />
            Xác nhận thanh toán bằng ví
          </div>
        )}
      </button>

      {/* Thông tin bảo mật */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span>Giao dịch được bảo mật</span>
        </div>
      </div>
    </div>
  );
} 