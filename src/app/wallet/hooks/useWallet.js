import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import walletService from '@/services/api/walletService';
import transactionHistoryService from '@/services/api/transactionHistoryService';

// Utility function để lấy accountID một cách nhất quán
const getAccountId = (user) => {
  return user?.accountID || user?.AccountID;
};

export const useWallet = () => {
  const { user } = useContext(AuthContext);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const accountId = getAccountId(user);
        console.log('🔍 Debug: User account ID:', accountId);
        console.log('🔍 Debug: User object:', user);
        
        if (!accountId) {
          setError('Không tìm thấy thông tin tài khoản');
          setLoading(false);
          return;
        }
        
        // Lấy ví của user
        console.log('🔍 Debug: Đang tìm ví cho account ID:', accountId);
        let userWallet = await walletService.getWalletByAccountId(accountId);
        console.log('🔍 Debug: Ví hiện tại:', userWallet);
        
        // Nếu chưa có ví, tạo ví mới
        if (!userWallet) {
          console.log('🔍 Debug: Tạo ví mới cho user:', accountId);
          try {
            const createResult = await walletService.createWallet(accountId);
            console.log('🔍 Debug: Kết quả tạo ví:', createResult);
            
            if (createResult.message === "Wallet was created successfully.") {
              // Lấy lại ví vừa tạo
              console.log('🔍 Debug: Lấy lại ví vừa tạo');
              userWallet = await walletService.getWalletByAccountId(accountId);
              console.log('🔍 Debug: Ví sau khi tạo:', userWallet);
            }
          } catch (createError) {
            // Nếu lỗi tạo ví (có thể ví đã tồn tại), thử lấy lại
            console.log('🔍 Debug: Lỗi tạo ví, thử lấy lại:', createError.message);
            userWallet = await walletService.getWalletByAccountId(accountId);
            console.log('🔍 Debug: Ví sau khi lấy lại:', userWallet);
            
            // Nếu vẫn không có ví, báo lỗi
            if (!userWallet) {
              throw new Error('Không thể tạo hoặc tìm thấy ví');
            }
          }
        } else {
          console.log('🔍 Debug: Đã tìm thấy ví:', userWallet);
        }
        
        setWallet(userWallet || null);
        console.log('🔍 Debug: Set wallet state:', userWallet);
        
        // Lấy lịch sử giao dịch nếu có ví
        if (userWallet) {
          console.log('🔍 Debug: Lấy transaction history cho account:', accountId);
          const historyData = await transactionHistoryService.getAllTransactionHistoriesByAccount(accountId);
          console.log('🔍 Debug: Transaction history:', historyData);
          setTransactions(historyData || []);
        } else {
          console.log('🔍 Debug: Không có ví, set empty transactions');
          setTransactions([]);
        }
      } catch (error) {
        console.error('❌ Error fetching wallet data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      console.log('🔍 Debug: User detected, fetching wallet data');
      fetchWalletData();
    } else {
      console.log('🔍 Debug: No user detected');
    }
  }, [user]);

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
        walletID: wallet.walletID || wallet.WalletID,
        amount: parseFloat(amount)
      };
      
      const result = await transactionHistoryService.addMoneyToWallet(depositData);
      
      // Cập nhật số dư ví
      const updatedWallet = await walletService.getWalletById(wallet.walletID || wallet.WalletID);
      setWallet(updatedWallet);
      
      // Cập nhật lịch sử giao dịch
      const accountId = getAccountId(user);
      const newHistory = await transactionHistoryService.getAllTransactionHistoriesByAccount(accountId);
      setTransactions(newHistory || []);
      
      return true;
    } catch (error) {
      console.error('Error depositing:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleInvoicePayment = async (invoiceId) => {
    if (!wallet) {
      throw new Error('Không tìm thấy ví');
    }
    
    try {
      setLoading(true);
      
      // Gọi API thanh toán hóa đơn
      const paymentData = {
        walletID: wallet.walletID || wallet.WalletID,
        invoiceID: invoiceId
      };
      
      const result = await transactionHistoryService.invoicePayment(invoiceId, paymentData);
      
      // Cập nhật số dư ví
      const updatedWallet = await walletService.getWalletById(wallet.walletID || wallet.WalletID);
      setWallet(updatedWallet);
      
      // Cập nhật lịch sử giao dịch
      const accountId = getAccountId(user);
      const newHistory = await transactionHistoryService.getAllTransactionHistoriesByAccount(accountId);
      setTransactions(newHistory || []);
      
      return result;
    } catch (error) {
      console.error('Error processing invoice payment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (invoiceId) => {
    if (!wallet) {
      throw new Error('Không tìm thấy ví');
    }
    
    try {
      setLoading(true);
      
      // Gọi API hoàn tiền
      const refundData = {
        walletID: wallet.walletID || wallet.WalletID,
        invoiceID: invoiceId
      };
      
      const result = await transactionHistoryService.refundMoneyToWallet(invoiceId, refundData);
      
      // Cập nhật số dư ví
      const updatedWallet = await walletService.getWalletById(wallet.walletID || wallet.WalletID);
      setWallet(updatedWallet);
      
      // Cập nhật lịch sử giao dịch
      const accountId = getAccountId(user);
      const newHistory = await transactionHistoryService.getAllTransactionHistoriesByAccount(accountId);
      setTransactions(newHistory || []);
      
      return result;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleWalletStatus = async (walletData) => {
    if (!walletData) return;
    
    try {
      setUpdatingStatus(true);
      const walletId = walletData.walletID || walletData.WalletID;
      const currentStatus = walletData.status || walletData.Status;
      const isActive = currentStatus === 'active';
      
      let result;
      if (isActive) {
        result = await walletService.deactivateWallet(walletId);
      } else {
        result = await walletService.activateWallet(walletId);
      }
      
      // Cập nhật ví sau khi thay đổi trạng thái
      const updatedWallet = await walletService.getWalletById(walletId);
      setWallet(updatedWallet);
      
      return result;
    } catch (error) {
      console.error('Error toggling wallet status:', error);
      throw error;
    } finally {
      setUpdatingStatus(false);
    }
  };

  const updateWalletNote = async (walletId, note) => {
    try {
      const result = await walletService.updateWalletNote(walletId, { note });
      
      // Cập nhật ví sau khi thay đổi ghi chú
      const updatedWallet = await walletService.getWalletById(walletId);
      setWallet(updatedWallet);
      
      return result;
    } catch (error) {
      console.error('Error updating wallet note:', error);
      throw error;
    }
  };

  const refreshWalletData = async () => {
    try {
      setLoading(true);
      const accountId = getAccountId(user);
      console.log('🔍 Debug: Refresh wallet data cho account:', accountId);
      
      let userWallet = await walletService.getWalletByAccountId(accountId);
      console.log('🔍 Debug: Ví hiện tại khi refresh:', userWallet);
      
      // Nếu chưa có ví, tạo ví mới
      if (!userWallet) {
        console.log('🔍 Debug: Chưa có ví, tạo ví mới khi refresh');
        try {
          const createResult = await walletService.createWallet(accountId);
          console.log('🔍 Debug: Kết quả tạo ví khi refresh:', createResult);
          
          if (createResult.message === "Wallet was created successfully.") {
            // Lấy lại ví vừa tạo
            userWallet = await walletService.getWalletByAccountId(accountId);
            console.log('🔍 Debug: Ví sau khi tạo khi refresh:', userWallet);
          }
        } catch (createError) {
          console.log('🔍 Debug: Lỗi tạo ví khi refresh, thử lấy lại:', createError.message);
          userWallet = await walletService.getWalletByAccountId(accountId);
          
          if (!userWallet) {
            throw new Error('Không thể tạo hoặc tìm thấy ví');
          }
        }
      }
      
      setWallet(userWallet || null);
      console.log('🔍 Debug: Set wallet state khi refresh:', userWallet);
      
      if (userWallet) {
        const historyData = await transactionHistoryService.getAllTransactionHistoriesByAccount(accountId);
        setTransactions(historyData || []);
      }
    } catch (error) {
      console.error('Error refreshing wallet data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    wallet,
    transactions,
    loading,
    error,
    updatingStatus,
    handleDeposit,
    handleInvoicePayment,
    handleRefund,
    toggleWalletStatus,
    updateWalletNote,
    refreshWalletData
  };
}; 