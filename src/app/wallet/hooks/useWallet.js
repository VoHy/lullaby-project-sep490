import { useWalletContext } from '../../../context/WalletContext';

// Re-export để tương thích với code cũ
export const useWallet = () => {
  return useWalletContext();
}; 