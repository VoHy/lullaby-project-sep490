'use client';

import { useState } from 'react';
import { useWallet } from '@/app/wallet/hooks/useWallet';
import { 
  WalletOverview, 
  TransactionHistory, 
  DepositModal, 
  WithdrawModal,
  WalletLoading,
  WalletEmpty 
} from '@/app/wallet/components';

const WalletTab = () => {
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
    <div className="space-y-6">
      <WalletOverview 
        wallet={wallet}
        onDeposit={onDepositClick}
        onWithdraw={onWithdrawClick}
      />
      
      <TransactionHistory 
        transactions={transactions}
        searchText={searchText}
        setSearchText={setSearchText}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

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

export default WalletTab; 