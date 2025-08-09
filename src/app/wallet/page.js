'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useWalletContext } from '@/context/WalletContext';
import transactionHistoryService from '@/services/api/transactionHistoryService';
import dynamic from 'next/dynamic';
import payOSService from '@/services/api/payOSService';
import invoiceService from '@/services/api/invoiceService';

export default function WalletPage() {
  const router = useRouter();
  const { user, isLoading } = useContext(AuthContext);
  const { wallet, wallets, loading, error, refreshWalletData } = useWalletContext();
  const [histories, setHistories] = useState([]);
  const [loadingHistories, setLoadingHistories] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);
  const [showTxModal, setShowTxModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState(null);

  const TransactionDetailModal = useMemo(() => dynamic(() => import('./components/TransactionDetailModal'), {
    loading: () => <div className="fixed inset-0 flex items-center justify-center"><div className="bg-white p-6 rounded-xl shadow">Đang tải...</div></div>
  }), []);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }
    refreshWalletData();
    // Tải lịch sử giao dịch theo tài khoản
    const fetchHistories = async () => {
      try {
        setLoadingHistories(true);
        setHistoryError(null);
        const accountId = user.accountID || user.AccountID;
        const data = await transactionHistoryService.getAllByAccount(accountId);
        setHistories(Array.isArray(data) ? data : []);
      } catch (e) {
        setHistoryError(e?.message || 'Không thể tải lịch sử giao dịch');
      } finally {
        setLoadingHistories(false);
      }
    };
    fetchHistories();
  }, [user, isLoading, router, refreshWalletData]);

  // Tính số dư hiện tại dựa theo giao dịch gần nhất (nếu backend chưa cập nhật Amount)
  const computedCurrentBalance = useMemo(() => {
    try {
      const walletId = wallet?.walletID || wallet?.WalletID;
      if (!walletId || !Array.isArray(histories) || histories.length === 0) {
        return wallet ? (wallet.amount || wallet.Amount || 0) : 0;
      }
      const related = histories.filter(h => (h.walletID || h.WalletID) === walletId);
      if (related.length === 0) {
        return wallet ? (wallet.amount || wallet.Amount || 0) : 0;
      }
      const latest = related.reduce((prev, cur) => {
        const tPrev = new Date(prev.transactionDate || prev.TransactionDate).getTime();
        const tCur = new Date(cur.transactionDate || cur.TransactionDate).getTime();
        return tCur > tPrev ? cur : prev;
      });
      return latest.after || latest.After || (wallet.amount || wallet.Amount || 0);
    } catch {
      return wallet ? (wallet.amount || wallet.Amount || 0) : 0;
    }
  }, [histories, wallet]);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Ví điện tử</h1>
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-red-600 mb-3">{error}</div>}

      {wallet ? (
        <div className="rounded-xl border p-4 bg-white shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-gray-600">Số dư hiện tại</div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {computedCurrentBalance.toLocaleString('vi-VN')}₫
              </div>
              <div className="text-sm text-gray-500">
                Trạng thái: {(wallet.status || wallet.Status) === 'active' ? 'Hoạt động' : 'Không hoạt động'}
              </div>
            </div>
          <button
              onClick={async () => {
                const amount = prompt('Nhập số tiền muốn nạp (VNĐ):', '100000');
                const value = Number(amount);
                if (!amount || Number.isNaN(value) || value <= 0) return;
                try {
                  // Gọi API tạo giao dịch nạp nội bộ (tùy backend có thể trả link PayOS)
                  const payload = {
                    walletID: wallet.walletID || wallet.WalletID,
                    amount: value,
                  };
                  const result = await transactionHistoryService.addMoneyToWalletWeb(payload);

                  // Nếu backend trả về link thanh toán PayOS, mở tab mới
                  const payUrl = result?.payUrl || result?.checkoutUrl || result?.url;
                  if (payUrl) {
                    window.open(payUrl, '_blank');
                  }

                  // Sau khi tạo yêu cầu, refresh dữ liệu để cập nhật lịch sử chờ webhook xác nhận
                  await refreshWalletData();
                  const accountId = user.accountID || user.AccountID;
                  const data = await transactionHistoryService.getAllByAccount(accountId);
                  setHistories(Array.isArray(data) ? data : []);
                  alert('Đã tạo yêu cầu nạp tiền. Nếu có link thanh toán PayOS, vui lòng hoàn tất thanh toán.');
                } catch (e) {
                  alert(e?.message || 'Không thể nạp tiền');
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Nạp tiền
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border p-4 bg-white shadow">
          <div className="mb-2">Bạn chưa có ví.</div>
          <button
            onClick={async () => {
              const accountId = user.accountID || user.AccountID;
              await fetch(`/api/wallet/create/${accountId}`, { method: 'POST' });
              await refreshWalletData();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Tạo ví
          </button>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Tất cả ví của bạn</h2>
        <div className="grid gap-3">
          {(wallets || []).filter(w => (w.accountID || w.AccountID) === (user.accountID || user.AccountID)).map(w => (
            <div key={w.walletID || w.WalletID} className="border rounded-lg p-3 bg-white">
              <div className="font-medium">Ví #{w.walletID || w.WalletID}</div>
              <div>Số dư: {(w.amount || w.Amount || 0).toLocaleString('vi-VN')}₫</div>
              <div>Trạng thái: {(w.status || w.Status) === 'active' ? 'Hoạt động' : 'Không hoạt động'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Lịch sử giao dịch</h2>
          <button
            onClick={async () => {
              const accountId = user.accountID || user.AccountID;
              setLoadingHistories(true);
              const data = await transactionHistoryService.getAllByAccount(accountId);
              setHistories(Array.isArray(data) ? data : []);
              await refreshWalletData();
              setLoadingHistories(false);
            }}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Làm mới
          </button>
        </div>
        {loadingHistories && <div>Đang tải lịch sử...</div>}
        {historyError && <div className="text-red-600 mb-3">{historyError}</div>}

        {!loadingHistories && (!histories || histories.length === 0) && (
          <div className="text-gray-500">Chưa có giao dịch.</div>
        )}

        {histories && histories.length > 0 && (
          <div className="overflow-x-auto bg-white border rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left">Thời gian</th>
                  <th className="px-4 py-2 text-left">Ghi chú</th>
                  <th className="px-4 py-2 text-right">Số tiền</th>
                  <th className="px-4 py-2 text-right">Trước</th>
                  <th className="px-4 py-2 text-right">Sau</th>
                  <th className="px-4 py-2 text-left">Trạng thái</th>
                  <th className="px-4 py-2 text-left">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {histories
                  .slice()
                  .sort((a, b) => new Date(b.transactionDate || b.TransactionDate) - new Date(a.transactionDate || a.TransactionDate))
                  .map(h => {
                    const time = h.transactionDate || h.TransactionDate;
                    const note = h.note || h.Note || '';
                    const amount = h.amount || h.Amount || 0;
                    const before = h.before || h.Before || 0;
                    const after = h.after || h.After || 0;
                    const status = h.status || h.Status || '';
                    const isOut = after < before; // chi tiêu
                    const invId = h.invoiceID || h.InvoiceID;
                    return (
                      <tr
                        key={h.transactionHistoryID || h.TransactionHistoryID}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="px-4 py-2 whitespace-nowrap">{new Date(time).toLocaleString('vi-VN')}</td>
                        <td className="px-4 py-2">
                          <button className="text-left w-full" onClick={() => { setSelectedTx(h); setShowTxModal(true); }}>{note || 'Xem chi tiết'}</button>
                        </td>
                        <td className={`px-4 py-2 text-right font-medium ${isOut ? 'text-red-600' : 'text-green-600'}`}>
                          {(isOut ? -amount : amount).toLocaleString('vi-VN')}₫
                        </td>
                        <td className="px-4 py-2 text-right text-gray-500">{before.toLocaleString('vi-VN')}₫</td>
                        <td className="px-4 py-2 text-right text-gray-500">{after.toLocaleString('vi-VN')}₫</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {invId ? (
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={async () => {
                                try {
                                  setInvoiceLoading(true);
                                  setShowInvoiceModal(true);
                                  const inv = await invoiceService.getInvoiceById(invId);
                                  setInvoiceDetail(inv);
                                } catch (e) {
                                  setInvoiceDetail({ error: e?.message || 'Không thể tải invoice' });
                                } finally {
                                  setInvoiceLoading(false);
                                }
                              }}
                            >
                              #{invId}
                            </button>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <TransactionDetailModal open={showTxModal} onClose={() => setShowTxModal(false)} transaction={selectedTx} />
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowInvoiceModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Chi tiết hóa đơn</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            {invoiceLoading ? (
              <div>Đang tải...</div>
            ) : invoiceDetail?.error ? (
              <div className="text-red-600">{invoiceDetail.error}</div>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div className="text-gray-500">Invoice ID</div>
                <div className="font-medium">{invoiceDetail?.invoiceID}</div>
                <div className="text-gray-500">Booking ID</div>
                <div className="font-medium">{invoiceDetail?.bookingID}</div>
                <div className="text-gray-500">Tổng tiền</div>
                <div className="font-medium">{(invoiceDetail?.totalAmount || 0).toLocaleString('vi-VN')}₫</div>
                <div className="text-gray-500">Phương thức</div>
                <div className="font-medium">{invoiceDetail?.transaction}</div>
                <div className="text-gray-500">Nội dung</div>
                <div className="font-medium">{invoiceDetail?.content}</div>
                <div className="text-gray-500">Thời gian</div>
                <div className="font-medium">{invoiceDetail?.paymentDate ? new Date(invoiceDetail.paymentDate).toLocaleString('vi-VN') : '-'}</div>
                <div className="text-gray-500">Trạng thái</div>
                <div className="font-medium">{invoiceDetail?.status}</div>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowInvoiceModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


