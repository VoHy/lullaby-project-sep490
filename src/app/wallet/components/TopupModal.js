'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FaTimes, FaQrcode, FaExternalLinkAlt, FaCopy, FaSpinner } from 'react-icons/fa';
import transactionHistoryService from '@/services/api/transactionHistoryService';
import payOSService from '@/services/api/payOSService';

export default function TopupModal({ open, onClose, wallet, accountId, onAfterRefresh }) {
  const [amount, setAmount] = useState('100000');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [payUrl, setPayUrl] = useState('');
  const [txId, setTxId] = useState(null);
  const [qrSrc, setQrSrc] = useState('');
  const pollTimer = useRef(null);

  useEffect(() => {
    if (!open) {
      // reset when closed
      setSubmitting(false);
      setError('');
      setPayUrl('');
  setQrSrc('');
      setTxId(null);
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
      } catch {}
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
      // Optional: confirm webhook config once before payment flow (no payload per Swagger)
      try {
        await payOSService.confirmWebhook({});
      } catch {}
      const payload = {
        walletID: wallet?.walletID || wallet?.WalletID,
        amount: value,
      };
      const result = await transactionHistoryService.addMoneyToWalletWeb(payload);
      const url = result?.payUrl || result?.checkoutUrl || result?.url || '';
      const tid = result?.transactionHistoryID || result?.TransactionHistoryID || null;
      setTxId(tid);
      setPayUrl(url);
      // Prefer backend-provided QR first
      const backendQrUrl = result?.qrUrl || result?.qrImageUrl || result?.qrLink;
      const backendQrB64 = result?.qrBase64 || result?.qrImageBase64 || result?.qrDataURL;
      if (backendQrUrl) {
        setQrSrc(backendQrUrl);
      } else if (backendQrB64) {
        setQrSrc(String(backendQrB64).startsWith('data:') ? backendQrB64 : `data:image/png;base64,${backendQrB64}`);
      } else if (url) {
        // Fallback: build a QR image URL without any frontend QR library
        setQrSrc(`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(url)}`);
      } else {
        setError('Không nhận được liên kết thanh toán');
      }
      if (url) {
        // Start polling for wallet updates
        startPolling();
      }
    } catch (e) {
      setError(e?.message || 'Không thể tạo giao dịch nạp ví');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  // Build a QR image source from payUrl without using a frontend QR library.
  // You can switch to a backend-provided QR (e.g., result.qrUrl) if available.
  const qrImageSrc = qrSrc;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaQrcode className="text-gray-700" /> Nạp tiền vào ví
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaTimes className="text-gray-500 text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!payUrl ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Số tiền (VNĐ)</label>
              <input
                type="number"
                min="10000"
                step="1000"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
              )}
              <button
                onClick={createTopup}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium disabled:opacity-60"
              >
                {submitting ? <><FaSpinner className="animate-spin" /> Đang tạo yêu cầu...</> : 'Tạo mã QR'}
              </button>
              <p className="text-xs text-gray-500">Hệ thống sẽ tạo đơn thanh toán PayOS và hiển thị QR để bạn quét.</p>
            </div>
      ) : (
            <div className="space-y-5">
              {qrImageSrc ? (
                <div className="flex flex-col items-center">
          <img src={qrImageSrc} alt="QR PayOS" className="w-64 h-64 rounded-lg border" />
                  <div className="mt-3 text-sm text-gray-600 text-center">
                    Quét mã QR bằng ứng dụng ngân hàng để nạp tiền.
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-10 text-gray-500">
                  <FaSpinner className="animate-spin mr-2" /> Đang tạo mã QR...
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(payUrl);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-50"
                >
                  <FaCopy /> Sao chép liên kết
                </button>
                <a
                  href={payUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Mở trang thanh toán <FaExternalLinkAlt />
                </a>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                Sau khi thanh toán thành công, số dư ví sẽ cập nhật tự động trong vài giây.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
