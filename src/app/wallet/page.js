'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useWalletContext } from '@/context/WalletContext';
import transactionHistoryService from '@/services/api/transactionHistoryService';
import dynamic from 'next/dynamic';
import payOSService from '@/services/api/payOSService';
import invoiceService from '@/services/api/invoiceService';
import { FaWallet, FaPlus, FaSyncAlt, FaFileInvoice, FaTimes, FaCheckCircle, FaClock, FaSpinner } from 'react-icons/fa';

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
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FaWallet className="text-gray-700" />
          Ví điện tử
        </h1>
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <FaSpinner className="animate-spin" />
            <span className="text-sm">Đang tải...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Main content: Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left column: Current wallet balance */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            {wallet ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <FaWallet className="text-gray-500" />
                      <span>Số dư hiện tại</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {computedCurrentBalance.toLocaleString('vi-VN')}₫
                    </div>
                    <div className="text-sm text-gray-500">
                      Trạng thái: <span className={`font-medium ${(wallet.status || wallet.Status) === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {(wallet.status || wallet.Status) === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={async () => {
                      const amount = prompt('Nhập số tiền muốn nạp (VNĐ):', '100000');
                      const value = Number(amount);
                      if (!amount || Number.isNaN(value) || value <= 0) return;
                      try {
                        const payload = {
                          walletID: wallet.walletID || wallet.WalletID,
                          amount: value,
                        };
                        const result = await transactionHistoryService.addMoneyToWalletWeb(payload);
                        const payUrl = result?.payUrl || result?.checkoutUrl || result?.url;
                        if (payUrl) {
                          window.open(payUrl, '_blank');
                        }
                        await refreshWalletData();
                        const accountId = user.accountID || user.AccountID;
                        const data = await transactionHistoryService.getAllByAccount(accountId);
                        setHistories(Array.isArray(data) ? data : []);
                        alert('Đã tạo yêu cầu nạp tiền. Nếu có link thanh toán PayOS, vui lòng hoàn tất thanh toán.');
                      } catch (e) {
                        alert(e?.message || 'Không thể nạp tiền');
                      }
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium"
                  >
                    <FaPlus />
                    Nạp tiền vào ví
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FaWallet className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có ví điện tử</h3>
                <p className="text-gray-500 mb-6">Tạo ví để bắt đầu sử dụng các tiện ích thanh toán.</p>
                <button
                  onClick={async () => {
                    const accountId = user.accountID || user.AccountID;
                    await fetch(`/api/wallet/create/${accountId}`, { method: 'POST' });
                    await refreshWalletData();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium"
                >
                  <FaPlus />
                  Tạo ví mới
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: All wallets list */}
      </div>

      {/* Transaction history */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Lịch sử giao dịch</h2>
          <button
            onClick={async () => {
              const accountId = user.accountID || user.AccountID;
              setLoadingHistories(true);
              const data = await transactionHistoryService.getAllByAccount(accountId);
              setHistories(Array.isArray(data) ? data : []);
              await refreshWalletData();
              setLoadingHistories(false);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            <FaSyncAlt className={loadingHistories ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>

        <div className="p-6">
          {loadingHistories && (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <FaSpinner className="animate-spin mr-2" />
              Đang tải lịch sử giao dịch...
            </div>
          )}

          {historyError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-4">
              {historyError}
            </div>
          )}

          {!loadingHistories && (!histories || histories.length === 0) && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <FaFileInvoice className="text-2xl text-gray-400" />
              </div>
              <p className="text-gray-500">Chưa có giao dịch nào</p>
            </div>
          )}

          {!loadingHistories && histories && histories.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Thời gian</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Ghi chú</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Số tiền</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Trước</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Sau</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Trạng thái</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Hóa đơn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
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
                      const isOut = after < before;
                      const invId = h.invoiceID || h.InvoiceID;
                      return (
                        <tr
                          key={h.transactionHistoryID || h.TransactionHistoryID}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                            {new Date(time).toLocaleString('vi-VN')}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              className="text-left text-gray-900 hover:text-gray-700 hover:underline"
                              onClick={() => { setSelectedTx(h); setShowTxModal(true); }}
                            >
                              {note || 'Xem chi tiết'}
                            </button>
                          </td>
                          <td className={`px-4 py-3 text-right font-semibold ${isOut ? 'text-red-600' : 'text-green-600'}`}>
                            {(isOut ? -amount : amount).toLocaleString('vi-VN')}₫
                          </td>
                          <td className="px-4 py-3 text-right text-gray-500">
                            {before.toLocaleString('vi-VN')}₫
                          </td>
                          <td className="px-4 py-3 text-right text-gray-500">
                            {after.toLocaleString('vi-VN')}₫
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status === 'completed'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}>
                              {status === 'completed' ? <FaCheckCircle /> : <FaClock />}
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {invId ? (
                              <button
                                className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:underline font-medium"
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
                                <FaFileInvoice />
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
      </div>
      <TransactionDetailModal open={showTxModal} onClose={() => setShowTxModal(false)} transaction={selectedTx} />

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowInvoiceModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FaFileInvoice className="text-gray-700" />
                Chi tiết hóa đơn
              </h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500 text-lg" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {invoiceLoading ? (
                <div className="flex items-center justify-center py-12">
                  <FaSpinner className="animate-spin mr-3 text-2xl text-gray-400" />
                  <span className="text-gray-600">Đang tải thông tin hóa đơn...</span>
                </div>
              ) : invoiceDetail?.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
                  {invoiceDetail.error}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Thông tin cơ bản</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Invoice ID:</span>
                          <span className="font-medium text-gray-900">{invoiceDetail?.invoiceID}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booking ID:</span>
                          <span className="font-medium text-gray-900">{invoiceDetail?.bookingID}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trạng thái:</span>
                          <span className="font-medium text-gray-900">{invoiceDetail?.status ? "Đã thanh toán" : "Chưa thanh toán"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Thông tin thanh toán</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tổng tiền:</span>
                          <span className="font-bold text-lg text-green-600">
                            {(invoiceDetail?.totalAmount || 0).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phương thức:</span>
                          <span className="font-medium text-gray-900">{invoiceDetail?.transaction}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thời gian:</span>
                          <span className="font-medium text-gray-900">
                            {invoiceDetail?.paymentDate
                              ? new Date(invoiceDetail.paymentDate).toLocaleString('vi-VN')
                              : 'Đã thanh toán'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {invoiceDetail?.content && (
                    <div className="md:col-span-2">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Nội dung</h4>
                        <p className="text-sm text-gray-700">{invoiceDetail.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


