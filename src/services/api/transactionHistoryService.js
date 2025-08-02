import { createService } from './serviceFactory';

// Tạo base service với factory
const baseTransactionHistoryService = createService('transactionhistories', 'TransactionHistory', true);

// Thêm method đặc biệt
const transactionHistoryService = {
  // Base CRUD methods từ factory
  ...baseTransactionHistoryService,

  // Thêm method getTransactionHistories để đảm bảo
  getTransactionHistories: async () => {
    const res = await fetch('/api/transactionhistories', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách transaction histories');
    return data;
  },

  getTransactionHistoryById: async (id) => {
    const res = await fetch(`/api/transactionhistories/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin transaction history');
    return data;
  }
};

export default transactionHistoryService; 