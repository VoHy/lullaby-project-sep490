'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import walletService from '@/services/api/walletService';
import transactionHistoryService from '@/services/api/transactionHistoryService';

const WalletContext = createContext();

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utility function để lấy accountID một cách nhất quán
  const getAccountId = (user) => {
    return user?.accountID || user?.AccountID;
  };

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const accountId = getAccountId(user);
      
      if (!accountId) {
        setError('Không tìm thấy thông tin tài khoản');
        setLoading(false);
        return;
      }
      
      // Lấy ví của user
      const response = await walletService.getWalletByAccountId(accountId);
      
      // Xử lý response - có thể data nằm trong response.data hoặc response trực tiếp
      let userWallet = null;
      if (response) {
        // Kiểm tra nếu response có data property
        if (response.data) {
          userWallet = response.data;
        } else if (response.walletID || response.amount !== undefined) {
          // Response trực tiếp là wallet object
          userWallet = response;
        } else if (Array.isArray(response) && response.length > 0) {
          // Response là array, lấy phần tử đầu tiên
          userWallet = response[0];
        }
      }
      
      if (!userWallet) {
        throw new Error('Không tìm thấy ví cho tài khoản này');
      }
      
      // Đảm bảo wallet có đủ thông tin cần thiết
      const processedWallet = {
        walletID: userWallet.walletID,
        accountID: userWallet.accountID,
        amount: userWallet.amount,
        status: userWallet.status,
        note: userWallet.note,
        ...userWallet // Giữ lại tất cả properties khác
      };
      
      setWallet(processedWallet);
      
      // Lấy lịch sử giao dịch - KHÔNG để lỗi này block wallet loading
      try {
        const historyData = await transactionHistoryService.getAllTransactionHistoriesByAccount(accountId);
        setTransactions(Array.isArray(historyData) ? historyData : []);
      } catch (historyError) {
        setTransactions([]); // Set empty array instead of failing
      }
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Refresh wallet data
  const refreshWalletData = async () => {
    await fetchWalletData();
  };

  // Handle deposit
  const handleDeposit = async (amount) => {
    if (!amount || parseFloat(amount) <= 0) {
      throw new Error('Số tiền không hợp lệ');
    }
    
    if (!wallet) {
      throw new Error('Không tìm thấy ví');
    }
    
    try {
      setLoading(true);
      
      // Gọi API nạp tiền
      const depositData = {
        walletID: wallet.walletID,
        amount: parseFloat(amount)
      };
      
      const result = await transactionHistoryService.addMoneyToWallet(depositData);
      
      // Refresh wallet data
      await refreshWalletData();
      
      return true;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle invoice payment
  const handleInvoicePayment = async (invoiceId) => {
    if (!wallet) {
      throw new Error('Không tìm thấy ví');
    }
    
    try {
      setLoading(true);
      
      // Gọi API thanh toán hóa đơn
      const paymentData = {
        walletID: wallet.walletID,
        invoiceID: invoiceId
      };
      
      const result = await transactionHistoryService.invoicePayment(invoiceId, paymentData);
      
      // Refresh wallet data
      await refreshWalletData();
      
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle refund
  const handleRefund = async (invoiceId) => {
    if (!wallet) {
      throw new Error('Không tìm thấy ví');
    }
    
    try {
      setLoading(true);
      
      // Gọi API hoàn tiền
      const refundData = {
        walletID: wallet.walletID,
        invoiceID: invoiceId
      };
      
      const result = await transactionHistoryService.refundMoneyToWallet(invoiceId, refundData);
      
      // Refresh wallet data
      await refreshWalletData();
      
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Toggle wallet status
  const toggleWalletStatus = async (walletData) => {
    if (!walletData) return;
    
    try {
      setLoading(true);
      const walletId = walletData.walletID;
      const currentStatus = walletData.status;
      const isActive = currentStatus === 'active';
      
      let result;
      if (isActive) {
        result = await walletService.deactivateWallet(walletId);
      } else {
        result = await walletService.activateWallet(walletId);
      }
      
      // Refresh wallet data
      await refreshWalletData();
      
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update wallet note
  const updateWalletNote = async (walletId, note) => {
    try {
      const result = await walletService.updateWalletNote(walletId, { note });
      
      // Refresh wallet data
      await refreshWalletData();
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Fetch wallet data when user changes
  useEffect(() => {
    if (user) {
      fetchWalletData();
    } else {
      setWallet(null);
      setTransactions([]);
      setLoading(false);
    }
  }, [user]);

  const value = {
    wallet,
    transactions,
    loading,
    error,
    handleDeposit,
    handleInvoicePayment,
    handleRefund,
    toggleWalletStatus,
    updateWalletNote,
    refreshWalletData
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};