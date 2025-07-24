"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import serviceTypes from '@/mock/ServiceType';
import serviceTasks from '@/mock/ServiceTask';
import workSchedules from "@/mock/WorkSchedule";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get('service');
  const packageId = searchParams.get('package');

  // Lấy thông tin dịch vụ lẻ hoặc package
  let detail = null;
  let childServices = [];
  let total = 0;

  if (serviceId) {
    detail = serviceTypes.find(s => s.ServiceID === Number(serviceId));
    total = detail?.Price || 0;
  }

  if (packageId) {
    detail = serviceTypes.find(s => s.ServiceID === Number(packageId));
    const tasks = serviceTasks.filter(t => t.Package_ServiceID === Number(packageId));
    childServices = tasks.map(t => serviceTypes.find(s => s.ServiceID === t.Child_ServiceID)).filter(Boolean);
    total = childServices.reduce((sum, s) => sum + (s.Price || 0), 0);
  }

  // Form state
  const [date, setDate] = useState(""); // Chỉ chọn ngày cho gói dịch vụ
  const [datetime, setDatetime] = useState(""); // Chọn ngày giờ cho dịch vụ lẻ
  const [note, setNote] = useState("");
  const [selectedNurses, setSelectedNurses] = useState([]);
  const [error, setError] = useState("");

  // Kiểm tra ngày hợp lệ cho gói dịch vụ (phải từ ngày mai trở đi)
  const isDateValid = useMemo(() => {
    if (!date) return false;
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    return selected >= today;
  }, [date]);

  // Kiểm tra ngày giờ hợp lệ cho dịch vụ lẻ (cách hiện tại ít nhất 30 phút)
  const isDatetimeValid = useMemo(() => {
    if (!datetime) return false;
    const selected = new Date(datetime);
    const now = new Date();
    return selected.getTime() - now.getTime() >= 30 * 60 * 1000;
  }, [datetime]);

  // Lọc nurse rảnh dựa vào workSchedules
  const availableNurses = useMemo(() => {
    let targetDate = null;
    
    if (detail?.ServiceID) { // Use detail.ServiceID to check if it's a package or service
      if (detail.ServiceID.toString().includes(',')) { // If it's a package, we don't have a specific date/time
        return []; // No specific date/time for packages, so no nurses available
      } else { // If it's a service, we need a date/time
        if (!isDatetimeValid) return [];
        targetDate = datetime.split("T")[0];
      }
    } else { // If it's a package, we don't have a specific date/time
      return [];
    }
    
    // Lấy danh sách nurse_id rảnh ngày đó
    const NurseID = workSchedules
      .filter(ws => ws.WorkDate === targetDate && ws.Status === "active")
      .map(ws => ws.NurseID);
    return NurseID.filter(n => NurseID.includes(n.NurseID));
  }, [detail, datetime, isDatetimeValid]);

  // Chọn/bỏ chọn nurse
  const handleToggleNurse = (id) => {
    setSelectedNurses(prev =>
      prev.includes(id) ? prev.filter(nid => nid !== id) : [...prev, id]
    );
  };

  // Xử lý thanh toán
  const handlePayment = () => {
    setError("");
    
    if (detail?.ServiceID) { // Use detail.ServiceID to check if it's a package or service
      if (detail.ServiceID.toString().includes(',')) { // If it's a package, we don't have a specific date/time
        if (selectedNurses.length === 0) {
          setError("Vui lòng chọn ít nhất một nurse cho gói dịch vụ.");
          return;
        }
      } else { // If it's a service, we need a date/time
        if (!datetime || !isDatetimeValid) {
          setError("Vui lòng chọn ngày giờ hợp lệ (cách hiện tại ít nhất 30 phút)");
          return;
        }
      }
    } else { // If it's a service, we need a date/time
      if (!datetime || !isDatetimeValid) {
        setError("Vui lòng chọn ngày giờ hợp lệ (cách hiện tại ít nhất 30 phút)");
        return;
      }
    }
    
    // Truyền thông tin booking sang trang payment
    const params = new URLSearchParams();
    if (detail?.ServiceID) { // Use detail.ServiceID to check if it's a package or service
      if (detail.ServiceID.toString().includes(',')) { // If it's a package, we don't have a specific date/time
        params.set("package", detail.ServiceID);
        params.set("nurses", selectedNurses.join(","));
      } else { // If it's a service, we need a date/time
        params.set("service", detail.ServiceID);
        params.set("datetime", datetime);
      }
    }
    params.set("note", note);
    router.push(`/payment?${params.toString()}`);
  };

  return (
    
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 bg-white rounded-xl shadow p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold shadow"
            onClick={() => router.back()}
          >
            ← Quay lại
          </button>
          <h1 className="text-3xl font-bold text-pink-600 text-center flex-1">Xác nhận đặt dịch vụ</h1>
        </div>
        {/* Hiển thị chi tiết dịch vụ lẻ */}
        {serviceId && detail && (
          <section className="mb-8 border rounded-lg p-4 bg-blue-50 shadow-sm">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Dịch vụ đã chọn</h2>
            <div className="mb-2 text-lg font-bold text-pink-600">{detail.ServiceName}</div>
            <div className="mb-2 text-gray-700">{detail.Description}</div>
            <div className="flex flex-wrap gap-4 mb-2">
              <div><span className="font-semibold">Giá:</span> <span className="text-gray-800">{detail.Price.toLocaleString('vi-VN')}đ</span></div>
              <div><span className="font-semibold">Thời gian:</span> <span className="text-gray-800">{detail.Duration}</span></div>
            </div>
          </section>
        )}
        {/* Hiển thị chi tiết package */}
        {packageId && detail && (
          <section className="mb-8 border rounded-lg p-4 bg-blue-50 shadow-sm">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Gói dịch vụ đã chọn</h2>
            <div className="mb-2 text-lg font-bold text-pink-600">{detail.ServiceName}</div>
            <div className="mb-2 text-gray-700">{detail.Description}</div>
            <div className="flex flex-wrap gap-4 mb-2">
              <div><span className="font-semibold">Giá gói:</span> <span className="text-gray-800">{detail.Price.toLocaleString('vi-VN')}đ</span></div>
              <div><span className="font-semibold">Thời gian:</span> <span className="text-gray-800">{detail.Duration}</span></div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-purple-700 mt-4">Các dịch vụ trong gói</h3>
            <ul className="list-disc pl-6">
              {childServices.map((s) => (
                <li key={s.ServiceID} className="mb-1">
                  <span className="font-bold text-blue-700">{s.ServiceName}</span> - <span className="text-pink-600">{s.Price.toLocaleString('vi-VN')}đ</span>
                  <div className="text-gray-500 text-sm">{s.Description}</div>
                  <div className="text-gray-500 text-sm">Thời gian: {s.Duration}</div>
                </li>
              ))}
            </ul>
          </section>
        )}
        {/* Hiển thị tổng tiền */}
        <section className="mb-6 border rounded-lg p-4 bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-between shadow-sm">
          <span className="text-lg font-semibold">Tổng tiền:</span>
          <span className="text-2xl text-pink-600 font-bold">{total.toLocaleString('vi-VN')}đ</span>
        </section>
        {/* Chọn ngày cho gói dịch vụ hoặc ngày giờ cho dịch vụ lẻ */}
        {detail?.ServiceID && detail.ServiceID.toString().includes(',') ? (
          <section className="mb-6 border rounded-lg p-4 bg-white">
            <label className="block font-semibold mb-1">Chọn nurse (có thể chọn nhiều hoặc không chọn)</label>
            {availableNurses.length === 0 ? (
              <div className="text-gray-500">Không có nurse nào rảnh vào thời điểm này.</div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {availableNurses.map(n => (
                  <label key={n.nursing_id} className={`border rounded px-4 py-2 cursor-pointer ${selectedNurses.includes(n.nursing_id) ? 'bg-pink-100 border-pink-400' : 'bg-white'}`}>
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedNurses.includes(n.nursing_id)}
                      onChange={() => handleToggleNurse(n.nursing_id)}
                    />
                    {n.full_name} ({n.major})
                  </label>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="mb-6 border rounded-lg p-4 bg-white">
            <label className="block font-semibold mb-1">Chọn ngày giờ đặt dịch vụ <span className="text-red-500">*</span></label>
            <input
              type="datetime-local"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
              min={new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16)}
              autoFocus
            />
            {!isDatetimeValid && datetime && (
              <div className="text-red-500 text-sm mt-1">Thời gian phải cách hiện tại ít nhất 30 phút</div>
            )}
          </section>
        )}
        {/* Chọn nurse */}
        {detail?.ServiceID && detail.ServiceID.toString().includes(',') && (
          <section className="mb-6 border rounded-lg p-4 bg-white">
            <label className="block font-semibold mb-1">Chọn nurse (có thể chọn nhiều hoặc không chọn)</label>
            {availableNurses.length === 0 ? (
              <div className="text-gray-500">Không có nurse nào rảnh vào thời điểm này.</div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {availableNurses.map(n => (
                  <label key={n.nursing_id} className={`border rounded px-4 py-2 cursor-pointer ${selectedNurses.includes(n.nursing_id) ? 'bg-pink-100 border-pink-400' : 'bg-white'}`}>
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedNurses.includes(n.nursing_id)}
                      onChange={() => handleToggleNurse(n.nursing_id)}
                    />
                    {n.full_name} ({n.major})
                  </label>
                ))}
              </div>
            )}
          </section>
        )}
        <section className="mb-6 border rounded-lg p-4 bg-white">
          <label className="block font-semibold mb-1">Ghi chú</label>
          <textarea
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Nhập ghi chú nếu có..."
          />
        </section>
        {error && <div className="text-red-500 mb-4 font-semibold">{error}</div>}
        <button
          className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg shadow hover:scale-105 transition"
          onClick={handlePayment}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
} 