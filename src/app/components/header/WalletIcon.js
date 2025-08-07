'use client';

import { useState, useContext } from 'react';
import { FaWallet, FaPlus } from 'react-icons/fa';
import { AuthContext } from '../../../context/AuthContext';
import { useWalletContext } from '../../../context/WalletContext';
import walletService from '../../../services/api/walletService';

export default function WalletIcon() {
  const { user } = useContext(AuthContext);
  const { wallet, loading, refreshWalletData } = useWalletContext();
  const [showTooltip, setShowTooltip] = useState(false);
  const [creating, setCreating] = useState(false);

  // Chỉ hiển thị cho customer (roleID = 4)
  if (!user || (user.roleID !== 4 && user.RoleID !== 4)) {
    return null;
  }

  const getWalletAmount = (wallet) => {
    if (!wallet) return 0;
    return wallet.amount || wallet.Amount || 0;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // Hàm tạo ví
  const handleCreateWallet = async () => {
    if (!user) {
      alert('Bạn cần đăng nhập!');
      return;
    }
    setCreating(true);
    try {
      const accountId = user.accountID || user.AccountID;
      await walletService.createWallet(accountId);
      await refreshWalletData();
      alert('Tạo ví thành công!');
    } catch (error) {
      alert(error.message || 'Tạo ví thất bại!');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => window.location.href = '/wallet'}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => {
          // Delay để tránh tooltip biến mất quá nhanh
          setTimeout(() => setShowTooltip(false), 3000);
        }}
        className="relative flex items-center gap-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors"
      >
        <FaWallet className="text-lg" />
        <span className="hidden sm:inline">
          {loading ? (
            <span className="text-sm">Đang tải...</span>
          ) : (
            <span className="text-sm">
              {formatAmount(getWalletAmount(wallet))} VNĐ
            </span>
          )}
        </span>
        <FaPlus className="text-xs" />
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div 
          className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => {
            // Delay để tránh tooltip biến mất quá nhanh
            setTimeout(() => setShowTooltip(false), 3000);
          }}
        >
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 mb-2">Ví điện tử</h4>
            {loading ? (
              <p className="text-sm text-gray-500">Đang tải thông tin ví...</p>
            ) : wallet ? (
              <div className="space-y-2">
                <p className="text-lg font-bold text-green-600">
                  {formatAmount(getWalletAmount(wallet))} VNĐ
                </p>
                <p className="text-xs text-gray-500">
                  Số dư hiện tại
                </p>
                <button
                  onClick={() => window.location.href = '/wallet'}
                  className="w-full px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  Xem chi tiết
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Chưa có ví</p>
                <button
                  onClick={handleCreateWallet}
                  className="w-full px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-60"
                  disabled={creating}
                >
                  {creating ? 'Đang tạo ví...' : 'Tạo ví'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 