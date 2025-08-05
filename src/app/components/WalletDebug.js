'use client';

import { useWalletContext } from '../../context/WalletContext';

export default function WalletDebug() {
  const { wallet, loading, error } = useWalletContext();

  if (!wallet) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="text-sm font-bold">Wallet Debug:</div>
        <div className="text-xs">
          {loading ? 'Loading...' : error ? `Error: ${error}` : 'No wallet found'}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg shadow-lg z-50">
      <div className="text-sm font-bold">Wallet Debug:</div>
      <div className="text-xs">
        <div>ID: {wallet.walletID || wallet.WalletID}</div>
        <div>Amount: {wallet.amount || wallet.Amount || 0}đ</div>
        <div>Status: {wallet.status || wallet.Status}</div>
        <div>Account: {wallet.accountID || wallet.AccountID}</div>
      </div>
    </div>
  );
} 