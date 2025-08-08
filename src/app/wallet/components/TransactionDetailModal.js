'use client';

import { useEffect } from 'react';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Chi tiết giao dịch</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div className="text-gray-500">Mã giao dịch</div>
          <div className="font-medium">{id}</div>

          <div className="text-gray-500">Mã ví</div>
          <div className="font-medium">{walletID}</div>

          <div className="text-gray-500">Mã hóa đơn</div>
          <div className="font-medium">{invoiceID ?? '-'}</div>

          <div className="text-gray-500">Người chuyển</div>
          <div className="font-medium">{transferrer || '-'}</div>

          <div className="text-gray-500">Người nhận</div>
          <div className="font-medium">{receiver || '-'}</div>

          <div className="text-gray-500">Ghi chú</div>
          <div className="font-medium">{note || '-'}</div>

          <div className="text-gray-500">Thời gian</div>
          <div className="font-medium">{date ? new Date(date).toLocaleString('vi-VN') : '-'}</div>

          <div className="text-gray-500">Trạng thái</div>
          <div>
            <span className={`px-2 py-1 rounded-full text-xs ${status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{status}</span>
          </div>

          <div className="text-gray-500">Số dư trước</div>
          <div className="font-medium">{before.toLocaleString('vi-VN')}₫</div>

          <div className="text-gray-500">Biến động</div>
          <div className={`font-medium ${after < before ? 'text-red-600' : 'text-green-600'}`}>
            {(after < before ? -amount : amount).toLocaleString('vi-VN')}₫
          </div>

          <div className="text-gray-500">Số dư sau</div>
          <div className="font-medium">{after.toLocaleString('vi-VN')}₫</div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">Đóng</button>
        </div>
      </div>
    </div>
  );
}


