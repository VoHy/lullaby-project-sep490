const walletHistoryService = {
  // Lấy tất cả lịch sử giao dịch
  getWalletHistories: async () => {
    const res = await fetch('/api/TransactionHistory');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách lịch sử giao dịch');
    return data;
  },

  // Lấy lịch sử giao dịch theo WalletID
  getWalletHistoryByWalletId: async (walletId) => {
    const res = await fetch(`/api/TransactionHistory/wallet/${walletId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy lịch sử giao dịch theo wallet');
    return data;
  },

  // Lấy lịch sử giao dịch theo TransactionHistoryID
  getWalletHistoryById: async (transactionHistoryId) => {
    const res = await fetch(`/api/TransactionHistory/${transactionHistoryId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin lịch sử giao dịch');
    return data;
  },

  // Tạo lịch sử giao dịch mới
  createWalletHistory: async (walletHistoryData) => {
    const res = await fetch('/api/TransactionHistory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(walletHistoryData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo lịch sử giao dịch thất bại');
    return result;
  },

  // Cập nhật lịch sử giao dịch
  updateWalletHistory: async (transactionHistoryId, updateData) => {
    const res = await fetch(`/api/TransactionHistory/${transactionHistoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật lịch sử giao dịch thất bại');
    return result;
  },

  // Xóa lịch sử giao dịch
  deleteWalletHistory: async (transactionHistoryId) => {
    const res = await fetch(`/api/TransactionHistory/${transactionHistoryId}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa lịch sử giao dịch thất bại');
    return result;
  },

  // Lấy lịch sử giao dịch theo trạng thái
  getWalletHistoriesByStatus: async (status) => {
    const res = await fetch(`/api/TransactionHistory/status/${status}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy lịch sử giao dịch theo trạng thái');
    return data;
  },

  // Lấy lịch sử giao dịch theo khoảng thời gian
  getWalletHistoriesByDateRange: async (startDate, endDate) => {
    const res = await fetch(`/api/TransactionHistory/date-range?startDate=${startDate}&endDate=${endDate}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy lịch sử giao dịch theo khoảng thời gian');
    return data;
  }
};

export default walletHistoryService; 