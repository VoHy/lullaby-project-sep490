import { createService } from './serviceFactory';

// Tạo base service với factory
const baseWalletHistoryService = createService('wallethistories', 'WalletHistory', true);

// Thêm method đặc biệt
const walletHistoryService = {
  // Base CRUD methods từ factory
  ...baseWalletHistoryService,

  // Thêm method getWalletHistories để đảm bảo
  getWalletHistories: async () => {
    const res = await fetch('/api/wallethistories', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách wallet histories');
    return data;
  },

  getWalletHistoryById: async (id) => {
    const res = await fetch(`/api/wallethistories/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin wallet history');
    return data;
  }
};

export default walletHistoryService; 