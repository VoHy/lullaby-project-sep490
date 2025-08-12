'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FaTimes, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';
import transactionHistoryService from '@/services/api/transactionHistoryService';

export default function TopupModal({ open, onClose, wallet, accountId, onAfterRefresh }) {
  const [amount, setAmount] = useState('0');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [payUrl, setPayUrl] = useState('');
  const pollTimer = useRef(null);

  useEffect(() => {
    if (!open) {
      // Reset khi đóng modal
      setSubmitting(false);
      setError('');
      setPayUrl('');
      if (pollTimer.current) {
        clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
    }
  }, [open]);

  const startPolling = () => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    let elapsed = 0;
    pollTimer.current = setInterval(async () => {
      elapsed += 5000;
      try {
        await onAfterRefresh?.();
      } catch { }
      if (elapsed >= 120000) {
        clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
    }, 5000);
  };

  const createTopup = async () => {
    try {
      setSubmitting(true);
      setError('');
      const value = Number(amount);
      if (!value || Number.isNaN(value) || value <= 0) {
        setError('Số tiền không hợp lệ');
        setSubmitting(false);
        return;
      }

      // Gọi API POST /api/TransactionHistory/AddMoneyToWalletWeb với returnUrl
      const payload = {
        walletID: wallet?.walletID || wallet?.WalletID,
        amount: value,
        returnUrl: `${window.location.origin}/wallet`, // URL quay về trang wallet
      };

      const result = await transactionHistoryService.addMoneyToWalletWeb(payload);
      // Xử lý trường hợp API trả về object hoặc string
      let paymentUrl = '';
      if (typeof result === 'string') {
        paymentUrl = result.trim();
      } else if (result && typeof result === 'object') {
        paymentUrl = (result.payUrl || result.url || result.link || '').trim();
      }
      if (typeof paymentUrl === 'string' && paymentUrl.startsWith('https://')) {
        // Mở trực tiếp trang thanh toán trong tab mới
        window.open(paymentUrl, '_blank');
        setPayUrl(paymentUrl); // Giữ payUrl để polling kiểm tra trạng thái
        startPolling();
        onClose(); // Đóng modal sau khi mở trang
      } else {
        setError('Không nhận được liên kết thanh toán hợp lệ');
      }
    } catch (e) {
      setError(e?.message || 'Không thể tạo giao dịch nạp ví');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-700/60 to-gray-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-gray-100 bg-gradient-to-r from-white/90 to-gray-50/80">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="inline-block bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full p-2 shadow-md">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/><path d="M12 6v6l4.25 2.52" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            Nạp tiền vào ví
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <FaTimes className="text-gray-500 text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-7">
          {!payUrl ? (
            <div className="space-y-6">
              <label className="block text-base font-semibold text-gray-700 mb-2">Số tiền muốn nạp (VNĐ)</label>
              <input
                type="number"
                min="10000"
                step="1000"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-medium bg-white/90 shadow-sm transition-all"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền..."
              />
              {error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-red-700 text-base font-medium shadow">{error}</div>
              )}
              <button
                onClick={createTopup}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? <><FaSpinner className="animate-spin" /> Đang tạo yêu cầu...</> : <><FaExternalLinkAlt /> Nạp tiền</>}
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#3b82f6"/></svg>
                Hệ thống sẽ chuyển bạn đến trang thanh toán PayOS. Số tiền tối thiểu là 1.000 VNĐ.
              </div>
            </div>
          ) : (
            <div className="space-y-7 text-center">
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <FaSpinner className="animate-spin mb-3 text-3xl text-blue-400" />
                <span className="font-semibold text-lg">Đang chờ xác nhận thanh toán...</span>
              </div>
              <div className="p-4 bg-green-100 border border-green-300 rounded-xl text-green-800 text-base font-medium shadow">
                Sau khi thanh toán thành công, số dư ví sẽ cập nhật tự động trong vài giây.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}