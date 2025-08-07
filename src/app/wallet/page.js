'use client';

import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaUser, FaUsers } from 'react-icons/fa';
import { useWalletContext } from '../../context/WalletContext';
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from '../../context/AuthContext';
import walletService from '@/services/api/walletService';
import {
  WalletOverview,
  TransactionHistory,
  DepositModal,
  PayOSPaymentModal,
  WalletLoading,
  WalletEmpty
} from './components';

// TabNavigation đồng bộ với profile
const TabNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const tabs = [
    {
      id: 'profile',
      name: 'Thông tin cá nhân',
      icon: <FaUser className="text-sm" />,
      href: '/profile',
      active: pathname === '/profile',
    },
    {
      id: 'care-profiles',
      name: 'Hồ sơ người thân',
      icon: <FaUsers className="text-sm" />,
      href: '/profile/patient',
      active: pathname === '/profile/patient',
    },
    {
      id: 'wallet',
      name: 'Ví điện tử',
      icon: <FaWallet className="text-sm" />,
      href: '/wallet',
      active: pathname === '/wallet',
    }
  ];
  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-8">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => router.push(tab.href)}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-all duration-200 ${tab.active
            ? 'bg-white text-purple-600 border-b-2 border-purple-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
        >
          {tab.icon}
          {tab.name}
        </button>
      ))}
    </div>
  );
};

export default function WalletPage(props) {
  const { wallet, transactions, loading, error, handleDeposit, refreshWalletData } = useWalletContext();
  const { user } = useContext(AuthContext);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showPayOSModal, setShowPayOSModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [depositError, setDepositError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onDepositClick = () => {
    setDepositError('');
    setShowDepositModal(true);
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0';
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const onDepositConfirm = async () => {
    try {
      setDepositError('');
      await handleDeposit(depositAmount);
      setDepositAmount('');
      setShowDepositModal(false);
      // Refresh data after successful deposit
      await refreshWalletData();
    } catch (error) {
      setDepositError(error.message);
    }
  };

  const onPayOSPayment = (amount) => {
    setDepositAmount(amount);
    setShowDepositModal(false);
    setShowPayOSModal(true);
  };

  const onPayOSSuccess = async () => {
    setShowPayOSModal(false);
    await refreshWalletData();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshWalletData();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Function test tạo ví thủ công
  const handleCreateWallet = async () => {
    try {
      if (!user) throw new Error('Bạn cần đăng nhập!');
      const accountId = user.accountID;
      await walletService.createWallet(accountId);
      await refreshWalletData();
    } catch (error) {
      alert(error.message || 'Tạo ví thất bại!');
    }
  };

  if (loading) {
    return <WalletLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lỗi tải dữ liệu ví</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
              Ví điện tử
            </h1>
            <p className="text-gray-600">Quản lý số dư và lịch sử giao dịch</p>
          </div>
          <TabNavigation />
          <WalletEmpty onCreateWallet={handleCreateWallet} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Ví điện tử
          </h1>
          <p className="text-gray-600">Quản lý số dư và lịch sử giao dịch</p>
        </div>
        <TabNavigation />

        {/* Nội dung chính của Ví điện tử */}
        <div className="bg-white rounded-xl shadow-lg">
          {/* Header với nút refresh */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center flex-1"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center gap-3 mb-2">
                <FaWallet className="text-purple-500" />
                Ví điện tử
              </h1>
              <p className="text-gray-600 text-lg">Quản lý tài khoản và giao dịch của bạn một cách an toàn, tiện lợi.</p>
            </motion.div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
              title="Làm mới dữ liệu"
            >
              {refreshing ? 'Đang tải...' : '🔄'}
            </button>
          </div>

          {/* Card số dư và nạp tiền */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center mb-8"
          >
            <div className="text-lg text-gray-500 mb-2">Số dư ví của bạn</div>
            <div className="text-4xl font-extrabold text-pink-600 mb-4">
              {formatCurrency(wallet?.amount || 0)}đ
            </div>
            <button
              onClick={onDepositClick}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:scale-105 hover:shadow-xl transition"
            >
              Nạp tiền vào ví
            </button>
          </motion.div>

          {/* Lịch sử giao dịch */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Lịch sử giao dịch</h2>
            <TransactionHistory
              transactions={transactions}
              searchText={searchText}
              setSearchText={setSearchText}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          </motion.div>
        </div>
      </div>

      {/* Modal nạp tiền */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        amount={depositAmount}
        setAmount={setDepositAmount}
        onDeposit={onDepositConfirm}
        walletId={wallet?.WalletID || wallet?.walletID}
        myWallet={wallet}
        error={depositError}
        onPayOSPayment={onPayOSPayment}
      />

      {/* Modal PayOS Payment */}
      <PayOSPaymentModal
        isOpen={showPayOSModal}
        onClose={() => setShowPayOSModal(false)}
        amount={depositAmount}
        wallet={wallet}
        onPaymentSuccess={onPayOSSuccess}
        error={depositError}
      />
    </div >
  );
}