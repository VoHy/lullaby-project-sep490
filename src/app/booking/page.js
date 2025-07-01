"use client";
import { useState, useEffect } from "react";
import authService from "@/services/auth/authService";
import { useSearchParams } from "next/navigation";

const services = [
  "Chăm sóc tại nhà",
  "Điều dưỡng tại nhà",
  "Phục hồi chức năng",
  "Tư vấn y tế 24/7"
];

export default function BookingPage() {
  const user = typeof window !== 'undefined' ? authService.getCurrentUser() : null;
  const isRelative = user && user.role === 'relative';
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const nurseName = searchParams ? searchParams.get('name') : "";
  const [form, setForm] = useState({
    name: isRelative ? user.name || "" : nurseName || "",
    phone: isRelative ? user.phone || "" : "",
    date: "",
    time: "",
    service: services[0],
    note: ""
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isRelative && nurseName) {
      setForm((prev) => ({ ...prev, name: nurseName }));
    }
  }, [nurseName, isRelative]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.phone || !form.date || !form.time) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }
    setSuccess(true);
    setForm({ name: "", phone: "", date: "", time: "", service: services[0], note: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-rose-600 mb-6">Đặt lịch dịch vụ</h1>
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center font-semibold">
            Đặt lịch thành công! Chúng tôi sẽ liên hệ bạn sớm.
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center font-semibold">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Họ tên <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300" disabled={isRelative} />
          </div>
          <div>
            <label className="block font-medium mb-1">Số điện thoại <span className="text-red-500">*</span></label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300" disabled={isRelative} />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block font-medium mb-1">Ngày <span className="text-red-500">*</span></label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Giờ <span className="text-red-500">*</span></label>
              <input type="time" name="time" value={form.time} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Dịch vụ</label>
            <select name="service" value={form.service} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300">
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Ghi chú</label>
            <textarea name="note" value={form.note} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300" rows={3} />
          </div>
          <button type="submit" className="w-full py-3 rounded-full bg-rose-500 text-white font-bold text-lg shadow hover:bg-rose-600 transition">Đặt lịch</button>
        </form>
      </div>
    </div>
  );
} 