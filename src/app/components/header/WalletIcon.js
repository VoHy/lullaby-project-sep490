'use client';

import { useState, useContext } from 'react';
import { FaWallet, FaPlus, FaCheckCircle } from 'react-icons/fa';
import { AuthContext } from '../../../context/AuthContext';
import walletService from '../../../services/api/walletService';
import { useWalletContext } from '@/context/WalletContext';
import { useRouter } from 'next/navigation';

export default function WalletIcon() {
  const { user } = useContext(AuthContext);
  const { wallet, loading, refreshWalletData } = useWalletContext();
  const [showTooltip, setShowTooltip] = useState(false);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

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
        onClick={() => router.push('/wallet')}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setTimeout(() => setShowTooltip(false), 300)}
        className="relative flex items-center gap-2 px-3 py-2 bg-white text-green-600 rounded-full font-medium shadow-sm border border-green-300 hover:bg-green-50 hover:border-green-400 hover:shadow-md transition-all duration-300"
        style={{ minWidth: '140px' }}
      >
        <FaWallet className="text-xl" />
        <span className="hidden sm:inline text-base font-semibold">
          {loading ? (
            <span className="animate-pulse">Đang tải...</span>
          ) : (
            <>
              {formatAmount(getWalletAmount(wallet))} <span className="text-xs font-normal">VNĐ</span>
            </>
          )}
        </span>
        <FaPlus className="text-sm ml-auto transition-transform duration-300 hover:rotate-90" />
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-lg z-50 p-4 animate-fade-in"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setTimeout(() => setShowTooltip(false), 300)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-2">
              <FaWallet className="text-green-600 text-2xl" />
            </div>
            <h4 className="font-semibold text-green-700 text-base mb-2">Ví điện tử</h4>
            {loading ? (
              <p className="text-sm text-gray-500 animate-pulse">Đang tải thông tin ví...</p>
            ) : wallet ? (
              <div className="space-y-2 w-full">
                <p className="text-xl font-bold text-green-600">
                  {formatAmount(getWalletAmount(wallet))} <span className="text-sm font-normal">VNĐ</span>
                </p>
                <p className="text-xs text-gray-500">Số dư hiện tại</p>
                <button
                  onClick={() => router.push('/wallet')}
                  className="w-full px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 shadow-sm transition-all duration-300"
                >
                  <FaCheckCircle className="inline mr-1" />
                  Xem chi tiết
                </button>
              </div>
            ) : (
              <div className="space-y-2 w-full">
                <p className="text-sm text-gray-500">Chưa có ví</p>
                <button
                  onClick={handleCreateWallet}
                  className="w-full px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 shadow-sm transition-all duration-300 disabled:opacity-50"
                  disabled={creating}
                >
                  {creating ? 'Đang tạo ví...' : 'Tạo ví'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tooltip animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}