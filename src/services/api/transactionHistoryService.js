import { createService } from './serviceFactory';

// Tạo base service với factory
const baseTransactionHistoryService = createService('transactionhistory', 'TransactionHistory', true);

// Thêm method đặc biệt
const transactionHistoryService = {
  // Base CRUD methods từ factory
  ...baseTransactionHistoryService,

  // Get all transaction histories
  getAllTransactionHistories: async () => {
    const res = await fetch('/api/transactionhistory/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách transaction histories');
    return data;
  },

  // Get transaction history by ID
  getTransactionHistoryById: async (transactionHistoryId) => {
    const res = await fetch(`/api/transactionhistory/${transactionHistoryId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin transaction history');
    return data;
  },

  // Delete transaction history
  deleteTransactionHistory: async (transactionHistoryId) => {
    const res = await fetch(`/api/transactionhistory/${transactionHistoryId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xóa transaction history thất bại');
    return data;
  },

  // Get all transaction histories by account
  getAllTransactionHistoriesByAccount: async (accountId) => {
    const res = await fetch(`/api/transactionhistory/getallbyaccount/${accountId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách transaction histories theo account');
    return data;
  },

  // Add money to wallet
  addMoneyToWallet: async (walletData) => {
    const res = await fetch('/api/transactionhistory/addmoneytowallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(walletData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Thêm tiền vào wallet thất bại');
    return data;
  },

  // Invoice payment
  invoicePayment: async (invoiceId, paymentData) => {
    const res = await fetch(`/api/transactionhistory/invoicepayment/${invoiceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Thanh toán invoice thất bại');
    return data;
  },

  // Refund money to wallet
  refundMoneyToWallet: async (invoiceId, refundData) => {
    const res = await fetch(`/api/transactionhistory/refundmoneytowallet/${invoiceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(refundData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Hoàn tiền vào wallet thất bại');
    return data;
  },

  // Success add to wallet
  successAddToWallet: async (transactionHistoryId) => {
    const res = await fetch(`/api/transactionhistory/successaddtowallet/${transactionHistoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Cập nhật trạng thái thành công thất bại');
    return data;
  }
};

export default transactionHistoryService; 