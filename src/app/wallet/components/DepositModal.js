'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTimes } from 'react-icons/fa';
// import walletService from '@/services/api/walletService';
// import walletHistoryService from '@/services/api/walletHistoryService';

const DepositModal = ({ isOpen, onClose, amount, setAmount, onDeposit, walletId, myWallet }) => {
  const [step, setStep] = useState('input'); // 'input' | 'qr' | 'success'
  const [tempAmount, setTempAmount] = useState('');
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateQR = async () => {
    if (!tempAmount || parseFloat(tempAmount) <= 0) return;
    setLoading(true);
          // const qrData = await walletService.generateQRCode(parseFloat(tempAmount), 'bank_transfer');
    setQr(qrData.qrCodeUrl);
    setStep('qr');
    setLoading(false);
  };

  const handleConfirm = async () => {
    setLoading(true);
    // Cộng tiền vào ví (mock)
    if (myWallet) {
      const before = myWallet.Amount;
      myWallet.Amount += parseFloat(tempAmount);
      // Lưu lại vào localStorage (mock update)
      const allWallets = JSON.parse(localStorage.getItem('wallets')) || [];
      const updatedWallets = allWallets.map(w => w.WalletID === myWallet.WalletID ? { ...w, Amount: myWallet.Amount } : w);
      localStorage.setItem('wallets', JSON.stringify(updatedWallets));
      // Tạo lịch sử giao dịch
              // await walletHistoryService.createWalletHistory({
        WalletID: myWallet.WalletID,
        Before: before,
        Amount: parseFloat(tempAmount),
        After: myWallet.Amount,
        Note: 'Nạp tiền ví (QR code)',
        Status: 'success'
      });
    }
    setStep('success');
    setLoading(false);
    if (onDeposit) onDeposit();
  };

  const handleClose = () => {
    setStep('input');
    setTempAmount('');
    setQr(null);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaPlus className="text-green-500" />
            Nạp tiền
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
        {step === 'input' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền nạp (VNĐ)
              </label>
              <input
                type="number"
                value={tempAmount}
                onChange={(e) => setTempAmount(e.target.value)}
                placeholder="Nhập số tiền..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleGenerateQR}
                disabled={!tempAmount || parseFloat(tempAmount) <= 0 || loading}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Đang tạo mã QR...' : 'Tạo mã QR'}
              </button>
            </div>
          </div>
        )}
        {step === 'qr' && (
          <div className="flex flex-col items-center gap-4">
            <div className="mb-2 font-semibold text-gray-700">Quét mã QR để nạp tiền</div>
            {qr && <img src={qr} alt="QR code" className="w-48 h-48 rounded-lg border" />}
            <button
              onClick={handleConfirm}
              className="w-full py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 mt-2"
              disabled={loading}
            >
              Tôi đã chuyển khoản
            </button>
          </div>
        )}
        {step === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-green-600 text-3xl mb-2">✔</div>
            <div className="font-bold text-green-700 mb-2">Nạp tiền thành công!</div>
            <button
              onClick={handleClose}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 mt-2"
            >
              Đóng
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DepositModal;
// Không có chức năng rút tiền, chỉ cho phép nạp tiền vào ví. 