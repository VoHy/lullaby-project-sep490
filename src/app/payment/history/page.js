"use client";
import { invoices } from "@/mock/Invoice";
import { useEffect, useState } from "react";

export default function PaymentHistoryPage() {
  const [localInvoices, setLocalInvoices] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(null); // invoice đang xem chi tiết

  useEffect(() => {
    setMounted(true);
    // Lấy các giao dịch vừa thanh toán từ localStorage (giả lập)
    const data = localStorage.getItem("appointments");
    if (data) {
      const arr = JSON.parse(data);
      // Chuyển đổi thành invoice đơn giản
      const mapped = arr.map((appt, idx) => ({
        invoice_id: 1000 + idx,
        content: appt.package ? `Thanh toán gói dịch vụ #${appt.package}` : `Thanh toán dịch vụ lẻ: ${appt.services}`,
        amount: appt.amount || 0,
        created_at: appt.datetime || new Date().toISOString(),
        note: appt.note || "",
        nurses: appt.nurses || ""
      }));
      setLocalInvoices(mapped);
    }
  }, []);

  const allInvoices = [...localInvoices, ...invoices];

  if (!mounted) return null;

  // Modal chi tiết invoice
  const renderDetail = () => {
    if (!selected) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
          <button className="absolute top-2 right-2 text-xl" onClick={() => setSelected(null)}>&times;</button>
          <h2 className="text-2xl font-bold text-pink-600 mb-4">Chi tiết thanh toán</h2>
          <div className="mb-2"><span className="font-semibold">Nội dung: </span>{selected.content}</div>
          <div className="mb-2"><span className="font-semibold">Số tiền: </span><span className="text-pink-600 font-bold">{selected.amount?.toLocaleString()}đ</span></div>
          <div className="mb-2"><span className="font-semibold">Ngày thanh toán: </span>{selected.created_at ? new Date(selected.created_at).toLocaleString() : "-"}</div>
          {selected.note && <div className="mb-2"><span className="font-semibold">Ghi chú: </span>{selected.note}</div>}
          {selected.nurses && <div className="mb-2"><span className="font-semibold">Nurse: </span>{selected.nurses}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-pink-600 mb-8">Lịch sử thanh toán</h1>
        {allInvoices.length === 0 ? (
          <div className="text-gray-500">Bạn chưa có thanh toán nào.</div>
        ) : (
          allInvoices.map((inv) => (
            <div
              key={inv.invoice_id}
              className="mb-6 p-6 rounded-xl shadow bg-white cursor-pointer hover:bg-pink-50"
              onClick={() => setSelected(inv)}
            >
              <div className="mb-2 text-lg font-bold text-blue-700">Thanh toán #{inv.invoice_id}</div>
              <div className="mb-1"><span className="font-semibold">Nội dung: </span>{inv.content}</div>
              <div className="mb-1"><span className="font-semibold">Số tiền: </span><span className="text-pink-600 font-bold">{inv.amount?.toLocaleString()}đ</span></div>
              <div className="mb-1"><span className="font-semibold">Ngày thanh toán: </span>{inv.created_at ? new Date(inv.created_at).toLocaleString() : "-"}</div>
            </div>
          ))
        )}
        {renderDetail()}
      </div>
    </div>
  );
} 