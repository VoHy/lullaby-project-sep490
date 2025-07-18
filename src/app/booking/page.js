"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import customerPackageService from '@/services/api/customerPackageService';
import serviceTypeService from '@/services/api/serviceTypeService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import workScheduleService from '@/services/api/workScheduleService';

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = searchParams.get("package");
  const services = searchParams.get("services");

  const [packages, setPackages] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [workSchedules, setWorkSchedules] = useState([]);

  useEffect(() => {
    customerPackageService.getCustomerPackages().then(setPackages);
    serviceTypeService.getServiceTypes().then(setServiceTypes);
    nursingSpecialistService.getNursingSpecialists().then(setNursingSpecialists);
    workScheduleService.getWorkSchedules().then(setWorkSchedules);
  }, []);

  let selectedPackage = null;
  let selectedServices = [];

  if (packageId) {
    selectedPackage = packages.find((pkg) => pkg.PackageID === Number(packageId));
  }

  if (services) {
    const serviceIds = services.split(",").map(Number);
    selectedServices = serviceTypes.filter((st) => serviceIds.includes(st.ServiceID));
  }

  // Tổng tiền
  const total = useMemo(() => {
    if (selectedPackage) {
      return selectedPackage.Price * (1 - selectedPackage.Discount / 100);
    }
    return selectedServices.reduce((sum, s) => sum + s.Price, 0);
  }, [selectedPackage, selectedServices]);

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
    
    if (selectedPackage) {
      if (!isDateValid) return [];
      targetDate = date;
    } else {
      if (!isDatetimeValid) return [];
      targetDate = datetime.split("T")[0];
    }
    
    // Lấy danh sách nurse_id rảnh ngày đó
    const nurseIds = workSchedules
      .filter(ws => ws.workdate === targetDate && ws.status === "available")
      .map(ws => ws.nursing_id);
    return nursingSpecialists.filter(n => nurseIds.includes(n.nursing_id));
  }, [selectedPackage, date, datetime, isDateValid, isDatetimeValid]);

  // Chọn/bỏ chọn nurse
  const handleToggleNurse = (id) => {
    setSelectedNurses(prev =>
      prev.includes(id) ? prev.filter(nid => nid !== id) : [...prev, id]
    );
  };

  // Xử lý thanh toán
  const handlePayment = () => {
    setError("");
    
    if (selectedPackage) {
      // Với gói dịch vụ, chỉ cần chọn ngày
      if (!date || !isDateValid) {
        setError("Vui lòng chọn ngày bắt đầu hợp lệ");
        return;
      }
    } else {
      // Với dịch vụ lẻ, cần chọn ngày giờ
      if (!datetime || !isDatetimeValid) {
        setError("Vui lòng chọn ngày giờ hợp lệ (cách hiện tại ít nhất 30 phút)");
      return;
      }
    }
    
    // Truyền thông tin booking sang trang payment
    const params = new URLSearchParams();
    if (selectedPackage) {
      params.set("package", selectedPackage.PackageID);
      params.set("date", date);
    }
    if (selectedServices.length > 0) {
      params.set("services", selectedServices.map(s => s.ServiceID).join(","));
      params.set("datetime", datetime);
    }
    params.set("note", note);
    if (selectedNurses.length > 0) params.set("nurses", selectedNurses.join(","));
    router.push(`/payment?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">Xác nhận đặt dịch vụ</h1>
        {selectedPackage && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Gói dịch vụ đã chọn</h2>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="font-bold text-lg mb-2">{selectedPackage.PackageName}</p>
              <p className="mb-2">{selectedPackage.Description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <span className="font-semibold">Giá gốc:</span>
                  <span className="text-gray-600 ml-2">{selectedPackage.Price.toLocaleString()}đ</span>
                </div>
                <div>
                  <span className="font-semibold">Giảm giá:</span>
                  <span className="text-green-600 font-semibold ml-2">{selectedPackage.Discount}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedServices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Các dịch vụ lẻ đã chọn</h2>
            <ul className="list-disc pl-6">
              {selectedServices.map((s) => (
                <li key={s.ServiceID} className="mb-1">
                  <span className="font-bold">{s.ServiceName}</span> - {s.Price.toLocaleString()}đ
                  <div className="text-gray-500 text-sm">{s.Description}</div>
                  <div className="text-gray-500 text-sm">Thời gian: {Math.floor(s.Duration / 60)}h {s.Duration % 60}m</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold">Tổng tiền:</span>
            <span className="text-2xl text-pink-600 font-bold">{total.toLocaleString()}đ</span>
          </div>
          </div>
        
        {/* Chọn ngày cho gói dịch vụ hoặc ngày giờ cho dịch vụ lẻ */}
        {selectedPackage ? (
          <div className="mb-6">
            <label className="block font-semibold mb-1">Chọn ngày bắt đầu dịch vụ <span className="text-red-500">*</span></label>
            <input
              type="date"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            {!isDateValid && date && (
              <div className="text-red-500 text-sm mt-1">Vui lòng chọn ngày hợp lệ</div>
            )}
            <div className="text-sm text-gray-600 mt-1">
              Gói dịch vụ có thời gian thực hiện cố định, không cần chọn giờ cụ thể
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block font-semibold mb-1">Chọn ngày giờ đặt dịch vụ <span className="text-red-500">*</span></label>
            <input
              type="datetime-local"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
              min={new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16)}
            />
            {!isDatetimeValid && datetime && (
              <div className="text-red-500 text-sm mt-1">Thời gian phải cách hiện tại ít nhất 30 phút</div>
            )}
          </div>
        )}
        
        {/* Chọn nurse */}
        {(selectedPackage ? isDateValid : isDatetimeValid) && (
          <div className="mb-6">
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
          </div>
        )}
        <div className="mb-6">
          <label className="block font-semibold mb-1">Ghi chú</label>
          <textarea
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Nhập ghi chú nếu có..."
          />
        </div>
        {error && <div className="text-red-500 mb-4 font-semibold">{error}</div>}
        <button
          className="w-full py-3 rounded-full bg-pink-500 text-white font-bold text-lg shadow hover:bg-pink-600 transition"
          onClick={handlePayment}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
} 