import { FaWallet } from 'react-icons/fa';

// Payment Breakdown Component
const PaymentBreakdown = ({ paymentBreakdown, total }) => {
  if (!paymentBreakdown) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-6">
      <h4 className="font-semibold text-gray-700 mb-3">Chi tiết thanh toán</h4>
      <div className="space-y-2 text-sm">
        {paymentBreakdown.subtotal > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tổng tiền gốc:</span>
            <span className="text-gray-700">{paymentBreakdown.subtotal.toLocaleString()}đ</span>
          </div>
        )}
        {paymentBreakdown.totalDiscount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Giảm giá:</span>
            <span className="text-green-600 font-medium">-{paymentBreakdown.totalDiscount.toLocaleString()}đ</span>
          </div>
        )}
        {paymentBreakdown.totalDiscount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Sau giảm giá:</span>
            <span className="text-gray-700 font-medium">{paymentBreakdown.discountedAmount.toLocaleString()}đ</span>
          </div>
        )}
        {paymentBreakdown.extra && paymentBreakdown.extra > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Phí phát sinh ({paymentBreakdown.extra * 1}%):</span>
            <span className="text-orange-600 font-medium">+{paymentBreakdown.extraAmount.toLocaleString()}đ</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-semibold">Tổng cộng:</span>
            <span className="text-gray-800 font-bold">{total.toLocaleString()}đ</span>
          </div>
        </div>
      </div>
      
      {/* Thông tin giải thích về phí phát sinh */}
      {paymentBreakdown.extra && paymentBreakdown.extra > 0 && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-blue-800 text-xs">
            <strong>Lưu ý:</strong> Phí phát sinh {paymentBreakdown.extra * 1}% được áp dụng cho ngày lễ hoặc dịch vụ đặc biệt. 
            Số tiền này sẽ được tính thêm vào hóa đơn khi thanh toán.
          </div>
        </div>
      )}
    </div>
  );
};

// Wallet Info Component
const WalletInfo = ({ myWallet, total }) => {
  if (!myWallet) return null;

  const walletAmount = myWallet.amount || myWallet.Amount || 0;
  const isInsufficient = walletAmount < total;

  return (
    <div className="bg-blue-50 rounded-xl p-4 mb-6">
      <h4 className="font-semibold text-gray-700 mb-3">Thông tin ví</h4>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số dư hiện tại:</span>
          <span className={`font-bold ${isInsufficient ? "text-red-500" : "text-green-600"}`}>
            {walletAmount.toLocaleString()}đ
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số tiền cần trừ:</span>
          <span className="font-bold text-pink-600">{total.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số dư sau thanh toán:</span>
          <span className={`font-bold ${isInsufficient ? "text-red-500" : "text-green-600"}`}>
            {(walletAmount - total).toLocaleString()}đ
          </span>
        </div>
      </div>
      {isInsufficient && (
        <div className="mt-3 p-3 bg-red-100 rounded-lg">
          <div className="text-red-700 text-sm font-semibold">
            ⚠️ Số dư ví không đủ để thanh toán!
          </div>
          <div className="text-red-600 text-xs mt-1">
            Vui lòng nạp thêm {(total - walletAmount).toLocaleString()}đ
          </div>
        </div>
      )}
    </div>
  );
};

// Error Display Component
const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
      <div className="text-red-700 font-semibold text-center mb-2">{error}</div>
      {error.includes('Hóa đơn đã được tạo') && (
        <div className="text-green-700 text-sm text-center">
          ✅ Hóa đơn đã được tạo thành công. Bạn có thể thanh toán sau khi nạp thêm tiền.
        </div>
      )}
    </div>
  );
};

// Staff Selection Mode Component
const StaffSelectionMode = ({ selectionMode, setSelectionMode }) => (
  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
    <div className="text-sm font-semibold text-purple-800 mb-2">Chọn cách phân công điều dưỡng</div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <button
        type="button"
        className={`px-3 py-2 rounded-lg border text-sm font-medium ${
          selectionMode === 'user' 
            ? 'bg-purple-600 text-white border-purple-600' 
            : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50'
        }`}
        onClick={() => setSelectionMode?.('user')}
      >
        Người dùng chọn
      </button>
      <button
        type="button"
        className={`px-3 py-2 rounded-lg border text-sm font-medium ${
          selectionMode === 'auto' 
            ? 'bg-purple-600 text-white border-purple-600' 
            : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50'
        }`}
        onClick={() => setSelectionMode?.('auto')}
      >
        Hệ thống tự chọn
      </button>
    </div>
    {selectionMode === 'user' && (
      <div className="text-xs text-purple-700 mt-2">
        Bạn cần chọn đủ điều dưỡng cho tất cả dịch vụ trước khi thanh toán.
      </div>
    )}
  </div>
);

// Payment Button Component
const PaymentButton = ({ 
  total, 
  myWallet, 
  loading, 
  isProcessingPayment, 
  selectionMode, 
  canConfirm, 
  handleConfirm 
}) => {
  const walletAmount = myWallet?.amount || myWallet?.Amount || 0;
  const isSufficient = walletAmount >= total;
  const canProceed = isSufficient && (selectionMode !== 'user' || canConfirm);
  const isDisabled = loading || isProcessingPayment || (selectionMode === 'user' && !canConfirm);

  return (
    <div className="space-y-3">
      <button
        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 ${
          canProceed
            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-105 hover:shadow-xl"
            : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 hover:shadow-xl"
        }`}
        onClick={handleConfirm}
        disabled={isDisabled}
      >
        {loading || isProcessingPayment ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Đang xử lý...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <FaWallet />
            {isSufficient 
              ? "Xác nhận thanh toán bằng ví" 
              : "Tạo hóa đơn và chờ thanh toán"
            }
          </div>
        )}
      </button>

      {/* Cancel Button */}
      <button
        className="w-full py-3 rounded-xl font-bold text-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-200"
        onClick={() => window.history.back()}
        disabled={isProcessingPayment}
      >
        Hủy
      </button>
    </div>
  );
};

// Main PaymentInfo Component
export default function PaymentInfo({ 
  total, 
  myWallet, 
  error, 
  loading, 
  handleConfirm,
  isProcessingPayment,
  paymentBreakdown,
  selectionMode,
  setSelectionMode,
  canConfirm,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <FaWallet className="text-green-600 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Thông tin thanh toán</h2>
      </div>

      {/* Payment Breakdown */}
      <PaymentBreakdown paymentBreakdown={paymentBreakdown} total={total} />

      {/* Total Amount */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">Tổng tiền cần thanh toán</div>
          <div className="text-4xl font-bold text-pink-600">{total.toLocaleString()}đ</div>
        </div>
      </div>

      {/* Wallet Information */}
      <WalletInfo myWallet={myWallet} total={total} />

      {/* Error Display */}
      <ErrorDisplay error={error} />

      {/* Process Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="text-blue-800 text-sm">
          <div className="font-semibold mb-2">ℹ️ Quy trình thanh toán:</div>
          <div className="space-y-1 text-xs">
            <div>1. Tạo hóa đơn (luôn luôn)</div>
            <div>2. Kiểm tra số dư ví</div>
            <div>3. Nếu đủ tiền: Thanh toán ngay</div>
            <div>4. Nếu thiếu tiền: Chờ thanh toán sau</div>
          </div>
        </div>
      </div>

      {/* Staff Selection Mode */}
      <StaffSelectionMode 
        selectionMode={selectionMode} 
        setSelectionMode={setSelectionMode} 
      />

      {/* Payment Button */}
      <PaymentButton
        total={total}
        myWallet={myWallet}
        loading={loading}
        isProcessingPayment={isProcessingPayment}
        selectionMode={selectionMode}
        canConfirm={canConfirm}
        handleConfirm={handleConfirm}
      />

      {/* Security Info */}
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