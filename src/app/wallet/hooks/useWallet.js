import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
// import walletService from '@/services/api/walletService';

export const useWallet = () => {
  const { user } = useContext(AuthContext);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        // const walletData = await walletService.getWallets();
        // Find user's wallet
        const userWallet = walletData.find(w => w.AccountID === user?.AccountID);
        setWallet(userWallet || null);
        // Get transaction history for user's wallet
        if (userWallet) {
          // const historyData = await walletService.getWalletHistories(userWallet.WalletID);
          setTransactions(historyData || []);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  const handleDeposit = async (amount) => {
    if (!amount || parseFloat(amount) <= 0) return;
    try {
      const newAmount = wallet.Amount + parseFloat(amount);
      setWallet({ ...wallet, Amount: newAmount });
      const newTransaction = {
        TransactionHistoryID: transactions.length + 1,
        WalletID: wallet.WalletID,
        Before: wallet.Amount,
        Amount: parseFloat(amount),
        After: newAmount,
        Transferrer: user?.FullName || 'User',
        Receiver: "Lullaby",
        InvoiceID: null,
        Note: 'Nạp tiền ví',
        Status: 'success',
        TransactionDate: new Date().toISOString()
      };
      setTransactions([newTransaction, ...transactions]);
      return true;
    } catch (error) {
      console.error('Error depositing:', error);
      return false;
    }
  };

  return {
    wallet,
    transactions,
    loading,
    handleDeposit
  };
}; 