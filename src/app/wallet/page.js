'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWallet } from 'react-icons/fa';
import { useWallet } from './hooks/useWallet';
import { 
  WalletOverview, 
  TransactionHistory, 
  DepositModal, 
  WithdrawModal,
  WalletLoading,
  WalletEmpty 
} from './components';

const WalletPage = () => {
  const { wallet, transactions, loading, handleDeposit, handleWithdraw } = useWallet();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchText, setSearchText] = useState('');

  const onDepositClick = () => {
    setShowDepositModal(true);
  };

  const onWithdrawClick = () => {
    setShowWithdrawModal(true);
  };

  const onDepositConfirm = async () => {
    const success = await handleDeposit(depositAmount);
    if (success) {
      setDepositAmount('');
      setShowDepositModal(false);
    }
  };

  const onWithdrawConfirm = async () => {
    const success = await handleWithdraw(withdrawAmount);
    if (success) {
      setWithdrawAmount('');
      setShowWithdrawModal(false);
    }
  };

  if (loading) {
    return <WalletLoading />;
  }

  if (!wallet) {
    return <WalletEmpty />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <FaWallet className="text-purple-500" />
            Ví điện tử
          </h1>
          <p className="text-gray-600">Quản lý tài khoản và giao dịch của bạn</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wallet Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <WalletOverview 
              wallet={wallet}
              onDeposit={onDepositClick}
              onWithdraw={onWithdrawClick}
            />
          </motion.div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
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

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        amount={depositAmount}
        setAmount={setDepositAmount}
        onDeposit={onDepositConfirm}
        walletId={wallet.WalletID}
      />

      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        amount={withdrawAmount}
        setAmount={setWithdrawAmount}
        onWithdraw={onWithdrawConfirm}
        walletAmount={wallet.Amount}
      />
    </div>
  );
};

export default WalletPage;