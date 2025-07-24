"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import authService from '@/services/auth/authService';
import bookingService from '@/services/api/bookingService';
import serviceTypeService from '@/services/api/serviceTypeService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import invoiceService from '@/services/api/invoiceService';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null); // Lịch hẹn đang xem chi tiết
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    const user = authService.getCurrentUser();
    bookingService.getBookingServices().then(data => {
      setAppointments(data.filter(a => a.AccountID === user.AccountID));
    });
    serviceTypeService.getServiceTypes().then(setServiceTypes);
    nursingSpecialistService.getNursingSpecialists().then(setNursingSpecialists);
    invoiceService.getInvoices().then(setInvoices);
  }, [router]);

  // Hàm render thông tin lịch hẹn
  const renderAppointment = (appt, idx) => {
    let pkg = null;
    let svcs = [];
    let nurses = [];
    if (appt.package) {
      pkg = packages.find(p => p.package_id === Number(appt.package));
    }
    if (appt.services) {
      const ids = appt.services.split(",").map(Number);
      svcs = serviceTypes.filter(s => ids.includes(s.servicetype_id));
    }
    if (appt.nurses) {
      const ids = appt.nurses.split(",").map(Number);
      nurses = nursingSpecialists.filter(n => ids.includes(n.nursing_id));
    }
    return (
      <div key={idx} className="mb-8 p-6 rounded-xl shadow bg-white cursor-pointer hover:bg-pink-50" onClick={() => setSelected({ ...appt, idx })}>
        <div className="mb-2 text-lg font-bold text-pink-600">Lịch hẹn #{idx + 1}</div>
        {pkg && (
          <div className="mb-2">
            <span className="font-semibold">Gói dịch vụ: </span>{pkg.package_name}
          </div>
        )}
        {svcs.length > 0 && (
          <div className="mb-2">
            <span className="font-semibold">Dịch vụ lẻ: </span>
            {svcs.map(s => s.servicetype_name).join(", ")}
          </div>
        )}
        <div className="mb-2">
          <span className="font-semibold">Ngày giờ: </span>{appt.datetime ? new Date(appt.datetime).toLocaleString() : "-"}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Nurse: </span>
          {nurses.length === 0 ? "Không chọn" : nurses.map(n => n.full_name).join(", ")}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Trạng thái: </span>
          <span className="text-green-600 font-semibold">Đã thanh toán</span>
        </div>
      </div>
    );
  };

  // Render chi tiết lịch hẹn (modal đơn giản)
  const renderDetail = () => {
    if (!selected) return null;
    let pkg = null;
    let svcs = [];
    let nurses = [];
    if (selected.package) {
      pkg = packages.find(p => p.package_id === Number(selected.package));
    }
    if (selected.services) {
      const ids = selected.services.split(",").map(Number);
      svcs = serviceTypes.filter(s => ids.includes(s.servicetype_id));
    }
    if (selected.nurses) {
      const ids = selected.nurses.split(",").map(Number);
      nurses = nursingSpecialists.filter(n => ids.includes(n.nursing_id));
    }
    // Giả lập lấy invoice đầu tiên (demo)
    const invoice = invoices[0];
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
          <button className="absolute top-2 right-2 text-xl" onClick={() => setSelected(null)}>&times;</button>
          <h2 className="text-2xl font-bold text-pink-600 mb-4">Chi tiết lịch hẹn</h2>
          {pkg && (
            <div className="mb-2"><span className="font-semibold">Gói dịch vụ: </span>{pkg.package_name}</div>
          )}
          {svcs.length > 0 && (
            <div className="mb-2"><span className="font-semibold">Dịch vụ lẻ: </span>{svcs.map(s => s.servicetype_name).join(", ")}</div>
          )}
          <div className="mb-2"><span className="font-semibold">Ngày giờ: </span>{selected.datetime ? new Date(selected.datetime).toLocaleString() : "-"}</div>
          <div className="mb-2"><span className="font-semibold">Nurse: </span>{nurses.length === 0 ? "Không chọn" : nurses.map(n => n.full_name).join(", ")}</div>
          <div className="mb-2"><span className="font-semibold">Ghi chú: </span>{selected.note || "-"}</div>
          <div className="mb-2"><span className="font-semibold">Trạng thái: </span><span className="text-green-600 font-semibold">Đã thanh toán</span></div>
          <div className="mb-4">
            <span className="font-semibold">Lịch sử thanh toán: </span>
            <button
              className="ml-2 px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
              onClick={() => {
                setSelected(null);
                window.location.href = "/payment/history";
              }}
            >
              Xem lịch sử thanh toán
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-pink-600 mb-8">Lịch hẹn của bạn</h1>
        {appointments.length === 0 ? (
          <div className="text-gray-500">Bạn chưa có lịch hẹn nào.</div>
        ) : (
          appointments.map(renderAppointment)
        )}
        {renderDetail()}
      </div>
    </div>
  );
} 