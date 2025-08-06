import { createService } from './serviceFactory';

// Tạo base service với factory
const baseTransactionHistoryService = createService('transactionhistory', 'TransactionHistory', true);

// Thêm method đặc biệt
const transactionHistoryService = {
  // Base CRUD methods từ factory
  ...baseTransactionHistoryService,

  // GET /api/TransactionHistory/GetAll
  getAllTransactionHistories: async () => {
    const res = await fetch('/api/transactionhistory/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách transaction histories');
    return data;
  },

  // GET /api/TransactionHistory/{transactionHistoryId}
  getTransactionHistoryById: async (transactionHistoryId) => {
    const res = await fetch(`/api/transactionhistory/${transactionHistoryId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin transaction history');
    return data;
  },

  // DELETE /api/TransactionHistory/{transactionHistoryId}
  deleteTransactionHistory: async (transactionHistoryId) => {
    const res = await fetch(`/api/transactionhistory/${transactionHistoryId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xóa transaction history thất bại');
    return data;
  },

  // GET /api/TransactionHistory/GetAllByAccount/{accountId}
  getAllTransactionHistoriesByAccount: async (accountId) => {
    try {
      console.log('🔍 TransactionHistoryService: Fetching for account:', accountId);
      
      if (!accountId) {
        console.log('⚠️ No accountId provided, returning empty array');
        return [];
      }

      const res = await fetch(`/api/transactionhistory/getallbyaccount/${accountId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('🔍 TransactionHistory API Response status:', res.status);

      // Nếu không tìm thấy (404) hoặc không có data, trả về array rỗng
      if (res.status === 404) {
        console.log('ℹ️ No transaction history found for account:', accountId);
        return [];
      }

      const data = await res.json();
      console.log('🔍 TransactionHistory API Response data:', data);

      if (!res.ok) {
        console.error('❌ API Error:', data.error);
        // Thay vì throw error, return empty array để không block wallet loading
        return [];
      }

      // Xử lý response data
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.data)) {
        return data.data;
      } else if (data && data.result) {
        return Array.isArray(data.result) ? data.result : [];
      }
      
      return [];
      
    } catch (error) {
      console.error('❌ Error fetching transaction histories:', error);
      // Return empty array thay vì throw error để không block wallet loading
      return [];
    }
  },

  // POST /api/TransactionHistory/AddMoneyToWallet
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

  // POST /api/TransactionHistory/InvoicePayment/{invoiceId}
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

  // POST /api/TransactionHistory/RefundMoneyToWallet/{invoiceId}
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

  // PUT /api/TransactionHistory/SuccessAddToWallet/{transactionHistoryId}
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