'use client';

import { motion } from 'framer-motion';
import { FaWallet } from 'react-icons/fa';
import { useWalletIcon } from './hooks/useWalletIcon';
import WalletIconDropdown from './WalletIconDropdown';
import DepositModal from '../../wallet/components/DepositModal';

const WalletIcon = () => {
  const {
    wallet,
    showDropdown,
    showDepositModal,
    depositAmount,
    setDepositAmount,
    formatBalance,
    handleDeposit,
    toggleDropdown,
    openDepositModal,
    closeDepositModal,
    viewDetails
  } = useWalletIcon();

  if (!wallet) return null;

  return (
    <>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="relative flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
        >
          <FaWallet className="text-purple-500 text-lg" />
          <span className="font-semibold text-gray-700">
            {formatBalance(wallet.Amount)}đ
          </span>
          {wallet.Status === 'active' && (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </button>

        {showDropdown && (
          <WalletIconDropdown
            wallet={wallet}
            onDeposit={openDepositModal}
            onViewDetails={viewDetails}
            onClose={toggleDropdown}
          />
        )}
      </div>

      <DepositModal
        isOpen={showDepositModal}
        onClose={closeDepositModal}
        amount={depositAmount}
        setAmount={setDepositAmount}
        onDeposit={handleDeposit}
      />
    </>
  );
};

export default WalletIcon; 