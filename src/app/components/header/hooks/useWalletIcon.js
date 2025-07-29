import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import walletService from '../../../../services/api/walletService';

export const useWalletIcon = () => {
  const { user } = useContext(AuthContext);
  const [wallet, setWallet] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  useEffect(() => {
    const fetchWallet = async () => {
      if (user) {
        try {
          const res = await walletService.getWallets();
          const walletData = Array.isArray(res) ? res : res.wallets || res.data || [];
          const userWallet = walletData.find(w => w.AccountID === user.AccountID);
          setWallet(userWallet || null);
        } catch (error) {
          console.error('Error fetching wallet:', error);
        }
      }
    };

    fetchWallet();
  }, [user]);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    
    try {
      const newAmount = wallet.Amount + parseFloat(depositAmount);
      setWallet({ ...wallet, Amount: newAmount });
      setDepositAmount('');
      setShowDepositModal(false);
      setShowDropdown(false);
    } catch (error) {
      console.error('Error depositing:', error);
    }
  };

  const formatBalance = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const openDepositModal = () => {
    setShowDepositModal(true);
    setShowDropdown(false);
  };

  const closeDepositModal = () => {
    setShowDepositModal(false);
  };

  const viewDetails = () => {
    setShowDropdown(false);
    window.location.href = '/wallet';
  };

  return {
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
  };
}; 