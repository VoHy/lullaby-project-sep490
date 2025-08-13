'use client';

import { useEffect } from 'react';
import { FaTimes, FaCheckCircle, FaClock, FaMoneyBillWave, FaWallet, FaUser } from 'react-icons/fa';

export default function TransactionDetailModal({ open, onClose, transaction }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  if (!transaction) return null;

  const id = transaction.transactionHistoryID || transaction.TransactionHistoryID;
  const walletID = transaction.walletID || transaction.WalletID;
  const invoiceID = transaction.invoiceID || transaction.InvoiceID;
  const before = transaction.before || transaction.Before || 0;
  const amount = transaction.amount || transaction.Amount || 0;
  const after = transaction.after || transaction.After || 0;
  const transferrer = transaction.transferrer || transaction.Transferrer || '';
  const receiver = transaction.receiver || transaction.Receiver || '';
  const note = transaction.note || transaction.Note || '';
  const date = transaction.transactionDate || transaction.TransactionDate;
  const status = transaction.status || transaction.Status || '';

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'đã thanh toán';
      case 'pending':
        return 'chờ xử lý';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FaMoneyBillWave className="text-gray-700" />
            Chi tiết giao dịch
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500 text-lg" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column: Transaction info */}
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-gray-600" />
                  Thông tin giao dịch
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-medium text-gray-900">{id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã ví:</span>
                    <span className="font-medium text-gray-900">{walletID}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã hóa đơn:</span>
                    <span className="font-medium text-gray-900">{invoiceID || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium text-gray-900">
                      {date ? new Date(date).toLocaleString('vi-VN') : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <div className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.toLowerCase() === 'completed'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                        {status.toLowerCase() === 'completed' ? <FaCheckCircle /> : <FaClock />}
                        {getStatusText(status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {(transferrer || receiver) && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaUser className="text-gray-600" />
                    Thông tin người dùng
                  </h4>
                  <div className="space-y-2 text-sm">
                    {transferrer && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Người chuyển:</span>
                        <span className="font-medium text-gray-900">{transferrer}</span>
                      </div>
                    )}
                    {receiver && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Người nhận:</span>
                        <span className="font-medium text-gray-900">{receiver}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right column: Financial info */}
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaWallet className="text-gray-600" />
                  Thông tin tài chính
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số dư trước:</span>
                    <span className="font-medium text-gray-900">{before.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biến động:</span>
                    <span className={`font-bold text-lg ${after < before ? 'text-red-600' : 'text-green-600'}`}>
                      {(after < before ? -amount : amount).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số dư sau:</span>
                    <span className="font-medium text-gray-900">{after.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>

              {note && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Ghi chú</h4>
                  <p className="text-sm text-gray-700">{note}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}


