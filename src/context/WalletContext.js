'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import walletService from '@/services/api/walletService';

const WalletContext = createContext({
  wallet: null,
  wallets: [],
  loading: false,
  error: null,
  refreshWalletData: async () => {},
});

export const WalletProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wallet, setWallet] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectUserWallet = useCallback((allWallets, currentUser) => {
    if (!Array.isArray(allWallets) || !currentUser) return null;
    const userAccountId = currentUser.accountID || currentUser.AccountID;
    const mine = allWallets.filter(w => (w.accountID || w.AccountID) === userAccountId);
    if (mine.length === 0) return null;
    const active = mine.find(w => (w.status || w.Status) === 'active');
    return active || mine[0];
  }, []);

  const refreshWalletData = useCallback(async () => {
    try {
      if (!user) {
        setWallet(null);
        setWallets([]);
        return null;
      }
      setLoading(true);
      setError(null);
      // Lấy tất cả ví rồi chọn ví của user
      const all = await walletService.getAllWallets();
      setWallets(Array.isArray(all) ? all : []);
      const selected = selectUserWallet(all, user);
      setWallet(selected || null);
      return selected || null;
    } catch (err) {
      setError(err?.message || 'Không thể tải dữ liệu ví');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, selectUserWallet]);

  useEffect(() => {
    // Khi user thay đổi (đăng nhập/đăng xuất), refresh ví
    refreshWalletData();
  }, [refreshWalletData]);

  const value = useMemo(() => ({
    wallet,
    wallets,
    loading,
    error,
    refreshWalletData,
  }), [wallet, wallets, loading, error, refreshWalletData]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);

export default WalletContext;


