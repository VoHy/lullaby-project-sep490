'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useWalletContext } from '@/context/WalletContext';
import transactionHistoryService from '@/services/api/transactionHistoryService';
import dynamic from 'next/dynamic';
import invoiceService from '@/services/api/invoiceService';
import { FaWallet, FaPlus, FaSyncAlt, FaFileInvoice, FaTimes, FaCheckCircle, FaClock, FaSpinner } from 'react-icons/fa';
import TopupModal from './components/TopupModal';

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
  const [showTopup, setShowTopup] = useState(false);

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

  // Tính số dư dựa theo giao dịch gần nhất (fallback khi backend chưa cập nhật Amount)
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

  // Hiển thị số dư đồng bộ với header: ưu tiên lấy từ context (wallet.Amount), nếu không có thì fallback computed
  const displayBalance = useMemo(() => {
    const amountFromWallet = wallet ? (wallet.amount ?? wallet.Amount) : null;
    if (typeof amountFromWallet === 'number' && !Number.isNaN(amountFromWallet)) {
      return amountFromWallet;
    }
    return computedCurrentBalance;
  }, [wallet, computedCurrentBalance]);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-4">
          <span className="inline-block bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full p-3 shadow-md">
            <FaWallet className="text-2xl" />
          </span>
          Ví điện tử
        </h1>
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <FaSpinner className="animate-spin" />
            <span className="text-base">Đang tải...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-2xl text-red-700 shadow">{error}</div>
      )}

      {/* Main content: Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Left column: Current wallet balance */}
        <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-2xl">
          <div className="px-8 py-7">
            {wallet ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-gray-600 mb-2">
                      <FaWallet className="text-blue-400" />
                      <span className="font-semibold">Số dư hiện tại</span>
                    </div>
                    <div className="text-4xl font-extrabold text-green-600 mb-1">
                      {displayBalance.toLocaleString('vi-VN')}₫
                    </div>
                    <div className="text-base text-gray-500">
                      Trạng thái: <span className={`font-bold ${(wallet.status || wallet.Status) === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {(wallet.status || wallet.Status) === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setShowTopup(true)}
                    className="w-full inline-flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all"
                  >
                    <FaPlus />
                    Nạp tiền vào ví
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center shadow">
                  <FaWallet className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có ví điện tử</h3>
                <p className="text-gray-500 mb-6">Tạo ví để bắt đầu sử dụng các tiện ích thanh toán.</p>
                <button
                  onClick={async () => {
                    const accountId = user.accountID || user.AccountID;
                    await fetch(`/api/wallet/create/${accountId}`, { method: 'POST' });
                    await refreshWalletData();
                  }}
                  className="inline-flex items-center gap-3 px-7 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all"
                >
                  <FaPlus />
                  Tạo ví mới
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Right column: All wallets list (có thể bổ sung sau) */}
      </div>

      {/* Transaction history */}
      <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between px-8 py-7 border-b border-gray-100 bg-gradient-to-r from-white/90 to-gray-50/80">
          <h2 className="text-2xl font-bold text-gray-900">Lịch sử giao dịch</h2>
          <button
            onClick={async () => {
              const accountId = user.accountID || user.AccountID;
              setLoadingHistories(true);
              const data = await transactionHistoryService.getAllByAccount(accountId);
              setHistories(Array.isArray(data) ? data : []);
              await refreshWalletData();
              setLoadingHistories(false);
            }}
            className="inline-flex items-center gap-3 px-5 py-3 text-base bg-gradient-to-r from-blue-100 to-teal-100 hover:from-blue-200 hover:to-teal-200 rounded-xl font-bold shadow transition-all"
          >
            <FaSyncAlt className={loadingHistories ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>

        <div className="px-8 py-7">
          {loadingHistories && (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <FaSpinner className="animate-spin mr-2 text-2xl text-blue-400" />
              <span className="font-semibold text-lg">Đang tải lịch sử giao dịch...</span>
            </div>
          )}

          {historyError && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-2xl text-red-700 mb-4 shadow">{historyError}</div>
          )}

          {!loadingHistories && (!histories || histories.length === 0) && (
            <div className="text-center py-14">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center shadow">
                <FaFileInvoice className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Chưa có giao dịch nào</p>
            </div>
          )}

          {!loadingHistories && histories && histories.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-base">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-4 text-left font-bold text-gray-700">Thời gian</th>
                    <th className="px-5 py-4 text-left font-bold text-gray-700">Ghi chú</th>
                    <th className="px-5 py-4 text-right font-bold text-gray-700">Số tiền</th>
                    <th className="px-5 py-4 text-right font-bold text-gray-700">Trước</th>
                    <th className="px-5 py-4 text-right font-bold text-gray-700">Sau</th>
                    <th className="px-5 py-4 text-left font-bold text-gray-700">Trạng thái</th>
                    <th className="px-5 py-4 text-left font-bold text-gray-700">Hóa đơn</th>
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
                          className="hover:bg-blue-50 transition-colors"
                        >
                          <td className="px-5 py-4 whitespace-nowrap text-gray-900">
                            {new Date(time).toLocaleString('vi-VN')}
                          </td>
                          <td className="px-5 py-4">
                            <button
                              className="text-left text-blue-700 hover:text-blue-900 hover:underline font-semibold"
                              onClick={() => { setSelectedTx(h); setShowTxModal(true); }}
                            >
                              {note || 'Xem chi tiết'}
                            </button>
                          </td>
                          <td className={`px-5 py-4 text-right font-bold ${isOut ? 'text-red-600' : 'text-green-600'}`}> 
                            {(isOut ? -amount : amount).toLocaleString('vi-VN')}₫
                          </td>
                          <td className="px-5 py-4 text-right text-gray-500">
                            {before.toLocaleString('vi-VN')}₫
                          </td>
                          <td className="px-5 py-4 text-right text-gray-500">
                            {after.toLocaleString('vi-VN')}₫
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${status === 'completed'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}>
                              {status === 'completed' ? <FaCheckCircle /> : <FaClock />}
                              {status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {invId ? (
                              <button
                                className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 hover:underline font-bold"
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
      <TopupModal
        open={showTopup}
        onClose={() => setShowTopup(false)}
        wallet={wallet}
        accountId={user?.accountID || user?.AccountID}
        onAfterRefresh={async () => {
          await refreshWalletData();
          const accountId = user.accountID || user.AccountID;
          const data = await transactionHistoryService.getAllByAccount(accountId);
          setHistories(Array.isArray(data) ? data : []);
        }}
      />

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-700/60 to-gray-900/80 backdrop-blur-sm" onClick={() => setShowInvoiceModal(false)} />
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-7 border-b border-gray-100 bg-gradient-to-r from-white/90 to-gray-50/80">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="inline-block bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full p-2 shadow-md">
                  <FaFileInvoice className="text-xl" />
                </span>
                Chi tiết hóa đơn
              </h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <FaTimes className="text-gray-500 text-xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-8 py-7">
              {invoiceLoading ? (
                <div className="flex items-center justify-center py-14">
                  <FaSpinner className="animate-spin mr-3 text-3xl text-blue-400" />
                  <span className="text-gray-600 font-semibold text-lg">Đang tải thông tin hóa đơn...</span>
                </div>
              ) : invoiceDetail?.error ? (
                <div className="p-4 bg-red-100 border border-red-300 rounded-2xl text-red-700 text-center shadow">{invoiceDetail.error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div className="p-5 bg-gray-50 rounded-xl shadow">
                      <h4 className="font-bold text-gray-900 mb-3">Thông tin cơ bản</h4>
                      <div className="space-y-2 text-base">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Invoice ID:</span>
                          <span className="font-bold text-gray-900">{invoiceDetail?.invoiceID}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booking ID:</span>
                          <span className="font-bold text-gray-900">{invoiceDetail?.bookingID}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trạng thái:</span>
                          <span className="font-bold text-gray-900">{invoiceDetail?.status ? "Đã thanh toán" : "Chưa thanh toán"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="p-5 bg-gray-50 rounded-xl shadow">
                      <h4 className="font-bold text-gray-900 mb-3">Thông tin thanh toán</h4>
                      <div className="space-y-2 text-base">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tổng tiền:</span>
                          <span className="font-bold text-2xl text-green-600">
                            {(invoiceDetail?.totalAmount || 0).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phương thức:</span>
                          <span className="font-bold text-gray-900">{invoiceDetail?.transaction}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thời gian:</span>
                          <span className="font-bold text-gray-900">
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
                      <div className="p-5 bg-gray-50 rounded-xl shadow">
                        <h4 className="font-bold text-gray-900 mb-2">Nội dung</h4>
                        <p className="text-base text-gray-700">{invoiceDetail.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end px-8 py-7 border-t border-gray-100">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-7 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all"
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


