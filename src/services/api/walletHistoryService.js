import walletHistories from '../../mock/WalletHistory';

const walletHistoryService = {
  // Lấy tất cả lịch sử giao dịch
  getWalletHistories: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return walletHistories;
  },

  // Lấy lịch sử giao dịch theo WalletID
  getWalletHistoryByWalletId: async (walletId) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return walletHistories.filter(history => history.WalletID === walletId);
  },

  // Lấy lịch sử giao dịch theo TransactionHistoryID
  getWalletHistoryById: async (transactionHistoryId) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return walletHistories.find(history => history.TransactionHistoryID === transactionHistoryId);
  },

  // Tạo lịch sử giao dịch mới
  createWalletHistory: async (walletHistoryData) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newHistory = {
      TransactionHistoryID: walletHistories.length + 1,
      ...walletHistoryData,
      TransactionDate: new Date().toISOString()
    };
    walletHistories.push(newHistory);
    return newHistory;
  },

  // Cập nhật lịch sử giao dịch
  updateWalletHistory: async (transactionHistoryId, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = walletHistories.findIndex(history => history.TransactionHistoryID === transactionHistoryId);
    if (index !== -1) {
      walletHistories[index] = { ...walletHistories[index], ...updateData };
      return walletHistories[index];
    }
    throw new Error('Wallet history not found');
  },

  // Xóa lịch sử giao dịch
  deleteWalletHistory: async (transactionHistoryId) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = walletHistories.findIndex(history => history.TransactionHistoryID === transactionHistoryId);
    if (index !== -1) {
      const deletedHistory = walletHistories.splice(index, 1)[0];
      return deletedHistory;
    }
    throw new Error('Wallet history not found');
  },

  // Lấy lịch sử giao dịch theo trạng thái
  getWalletHistoriesByStatus: async (status) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return walletHistories.filter(history => history.Status === status);
  },

  // Lấy lịch sử giao dịch theo khoảng thời gian
  getWalletHistoriesByDateRange: async (startDate, endDate) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return walletHistories.filter(history => {
      const transactionDate = new Date(history.TransactionDate);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
  }
};

export default walletHistoryService; 