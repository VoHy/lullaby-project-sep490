'use client';

import React from 'react';
import invoiceService from '@/services/api/invoiceService';

const RevenueTab = () => {
  const [invoices, setInvoices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Chỉ tính doanh thu với status là "paid"
  const totals = React.useMemo(() => {
    const isPaid = (inv) => {
      const status = inv.status ?? inv.Status;
      return String(status).toLowerCase() === 'paid';
    };
    const paidInvoices = (invoices || []).filter(isPaid);

    const sum = paidInvoices.reduce((acc, i) => acc + (i.totalAmount ?? i.total_amount ?? 0), 0);

    const today = new Date();
    const todayString = today.toDateString();
    const daily = paidInvoices
      .filter((i) => {
        const d = new Date(i.paymentDate ?? i.PaymentDate);
        return d.toDateString() === todayString;
      })
      .reduce((acc, i) => acc + (i.totalAmount ?? i.total_amount ?? 0), 0);

    // Sửa lỗi tính doanh thu tháng: phải lấy tháng và năm từ ngày thanh toán của từng invoice
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    const monthly = paidInvoices
      .filter((i) => {
        const d = new Date(i.paymentDate ?? i.PaymentDate);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce((acc, i) => acc + (i.totalAmount ?? i.total_amount ?? 0), 0);

    return { total: sum, daily, monthly };
  }, [invoices]);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await invoiceService.getAllInvoices();
        setInvoices(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || 'Không thể tải hóa đơn');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Đang tải doanh thu...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Báo cáo Doanh thu</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Doanh thu hôm nay (đã thanh toán)</h3>
          <p className="text-3xl font-bold">{totals.daily.toLocaleString()} VND</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Doanh thu tháng này (đã thanh toán)</h3>
          <p className="text-3xl font-bold">{totals.monthly.toLocaleString()} VND</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Tổng doanh thu (hóa đơn đã thanh toán)</h3>
          <p className="text-3xl font-bold">{totals.total.toLocaleString()} VND</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Tất cả hóa đơn</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {(invoices || []).map((inv) => {
            const status = String(inv.status ?? inv.Status).toLowerCase();
            return (
              <div key={inv.invoiceID ?? inv.invoice_ID} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">Hóa đơn #{inv.invoiceID ?? inv.invoice_ID}</div>
                  <div className="text-xs text-gray-600">Ngày: {new Date(inv.paymentDate ?? inv.PaymentDate).toLocaleString('vi-VN')}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${status === 'paid' ? 'text-green-600' : 'text-gray-600'}`}>
                    {(inv.totalAmount ?? inv.total_amount ?? 0).toLocaleString()} VND
                  </div>
                  <div className={`text-xs ${status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>{inv.status ?? inv.Status}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RevenueTab;
