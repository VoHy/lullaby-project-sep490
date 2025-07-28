'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWallet } from 'react-icons/fa';
import { useWallet } from './hooks/useWallet';
import { useRouter, usePathname } from "next/navigation";
import { FaUser, FaUsers } from "react-icons/fa";
import { 
  WalletOverview, 
  TransactionHistory, 
  DepositModal, 
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
          className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-all duration-200 ${
            tab.active
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
  const { wallet, transactions, loading, handleDeposit } = useWallet();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchText, setSearchText] = useState('');

  const onDepositClick = () => {
    setShowDepositModal(true);
  };

  const onDepositConfirm = async () => {
    const success = await handleDeposit(depositAmount);
    if (success) {
      setDepositAmount('');
      setShowDepositModal(false);
    }
  };

  if (loading) {
    return <WalletLoading />;
  }

  if (!wallet) {
    return <WalletEmpty />;
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
          {/* Giữ lại phần nội dung ví điện tử của trang này */}
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center gap-3 mb-2">
              <FaWallet className="text-purple-500" />
              Ví điện tử
            </h1>
            <p className="text-gray-600 text-lg">Quản lý tài khoản và giao dịch của bạn một cách an toàn, tiện lợi.</p>
          </motion.div>

          {/* Card số dư và nạp tiền */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center mb-8"
          >
            <div className="text-lg text-gray-500 mb-2">Số dư ví của bạn</div>
            <div className="text-4xl font-extrabold text-pink-600 mb-4">{wallet.Amount.toLocaleString()}đ</div>
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
        walletId={wallet.WalletID}
        myWallet={wallet}
      />
    </div>
  );
}