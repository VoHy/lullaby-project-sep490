import { createService } from './serviceFactory';

// Tạo base service với factory
const baseWalletService = createService('Wallet', 'Wallet');

// Thêm các method đặc biệt
const walletService = {
  // Base CRUD methods từ factory
  ...baseWalletService,

  // === WALLET HISTORY ===
  getWalletHistories: async (walletId) => {
    const res = await fetch(`/api/Wallet/${walletId}/histories`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy lịch sử wallet');
    return data;
  },

  // === THANH TOÁN THẬT ===
  
  // Tạo giao dịch nạp tiền
  createDepositTransaction: async (walletId, amount, paymentMethod) => {
    const res = await fetch('/api/Wallet/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletId,
        amount,
        paymentMethod
      })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo giao dịch nạp tiền thất bại');
    return result;
  },

  // Lấy danh sách phương thức thanh toán
  getPaymentMethods: async () => {
    const res = await fetch('/api/payment-methods');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách phương thức thanh toán');
    return data;
  },

  // Xác nhận giao dịch
  confirmTransaction: async (transactionId, paymentData) => {
    const res = await fetch(`/api/transactions/${transactionId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xác nhận giao dịch thất bại');
    return result;
  },

  // Kiểm tra trạng thái giao dịch
  getTransactionStatus: async (transactionId) => {
    const res = await fetch(`/api/transactions/${transactionId}/status`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể kiểm tra trạng thái giao dịch');
    return data;
  },

  // Lấy thông tin ngân hàng
  getBankInfo: async () => {
    const res = await fetch('/api/bank-info');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin ngân hàng');
    return data;
  },

  // Tạo QR Code thanh toán
  generateQRCode: async (amount, paymentMethod) => {
    const res = await fetch('/api/payment/qr-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, paymentMethod })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo QR Code thất bại');
    return result;
  }
};

export default walletService; 