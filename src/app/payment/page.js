"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useEffect, useState, useContext } from "react";
import customerPackageService from '@/services/api/customerPackageService';
import serviceTypeService from '@/services/api/serviceTypeService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import walletService from '@/services/api/walletService';
import { AuthContext } from "@/context/AuthContext";
import walletHistoryService from '@/services/api/walletHistoryService';
import serviceTasks from '@/mock/ServiceTask';
import serviceTypes from '@/mock/ServiceType';
import nursingSpecialists from '@/mock/NursingSpecialist';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = searchParams.get("package");
  const services = searchParams.get("services");
  const datetime = searchParams.get("datetime");
  const note = searchParams.get("note");
  const nurses = searchParams.get("nurses"); // dạng "1,2"

  const [packages, setPackages] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [wallets, setWallets] = useState([]);

  const { user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    customerPackageService.getCustomerPackages().then(setPackages);
    serviceTypeService.getServiceTypes().then(setServiceTypes);
    nursingSpecialistService.getNursingSpecialists().then(setNursingSpecialists);
    walletService.getWallets().then(setWallets);
  }, []);

  let selectedPackage = null;
  let selectedServices = [];
  let selectedNurses = [];

  if (packageId) {
    selectedPackage = packages.find((pkg) => pkg.package_id === Number(packageId));
  }

  // Lấy danh sách dịch vụ lẻ từ param 'services'
  if (searchParams.get("services")) {
    const serviceIds = searchParams.get("services").split(",").map(Number);
    selectedServices = serviceTypes.filter((st) => serviceIds.includes(st.ServiceID));
  }

  if (nurses) {
    const nurseIds = nurses.split(",").map(Number);
    selectedNurses = nursingSpecialists.filter(n => nurseIds.includes(n.nursing_id));
  }

  // Nếu là package, lấy detail từ serviceTypes (ServiceID=packageId)
  let packageDetail = null;
  if (packageId) {
    packageDetail = serviceTypes.find(s => s.ServiceID === Number(packageId));
  }

  // Tính tổng tiền
  let total = 0;
  if (packageId && packageDetail) {
    total = packageDetail.Price || 0;
  } else if (selectedServices.length > 0) {
    total = selectedServices.reduce((sum, s) => sum + (s.Price || 0), 0);
  }

  // Tìm ví active của user hiện tại
  const myWallet = useMemo(() => {
    if (!user) return null;
    return wallets.find(w => w.AccountID === user.AccountID && w.Status === "active");
  }, [wallets, user]);

  // Parse selectedStaff nếu có (truyền qua URL dạng JSON hoặc stringified object)
  let selectedStaff = {};
  try {
    const staffParam = searchParams.get("selectedStaff");
    if (staffParam) {
      selectedStaff = JSON.parse(decodeURIComponent(staffParam));
    }
  } catch (e) {}

  // Lấy danh sách dịch vụ con nếu là package
  let childServices = [];
  if (packageId) {
    const tasks = serviceTasks.filter(t => t.Package_ServiceID === Number(packageId));
    childServices = tasks.map(t => serviceTypes.find(s => s.ServiceID === t.Child_ServiceID)).filter(Boolean);
  }

  // Lấy thông tin nhân sự đã chọn cho từng dịch vụ
  const getStaffInfo = (serviceId) => {
    const staff = selectedStaff[serviceId];
    if (!staff) return null;
    const found = nursingSpecialists.find(n => n.NursingID === Number(staff.id));
    return found ? { ...staff, name: found.FullName, major: found.Major } : staff;
  };

  // Xử lý xác nhận thanh toán bằng ví
  const handleConfirm = async () => {
    setError("");
    if (!user || !myWallet) {
      setError("Không tìm thấy ví hoặc thông tin tài khoản!");
      return;
    }
    if (myWallet.Amount < total) {
      setError("Số dư ví không đủ để thanh toán!");
      return;
    }
    setLoading(true);
    // Trừ tiền ví (mock localStorage)
    const before = myWallet.Amount;
    myWallet.Amount -= total;
    // Lưu lại vào localStorage (mock update)
    const allWallets = wallets.map(w => w.WalletID === myWallet.WalletID ? { ...w, Amount: myWallet.Amount } : w);
    localStorage.setItem("wallets", JSON.stringify(allWallets));
    // Tạo lịch sử giao dịch
    await walletHistoryService.createWalletHistory({
      WalletID: myWallet.WalletID,
      InvoiceID: null,
      Before: before,
      Amount: -total,
      After: myWallet.Amount,
      Receiver: "Lullaby Service",
      Transferrer: user.FullName || user.username || "User",
      Note: "Thanh toán dịch vụ",
      Status: "success"
    });
    // Lưu lịch hẹn vào localStorage (demo)
    const data = localStorage.getItem("appointments");
    let arr = [];
    if (data) arr = JSON.parse(data);
    arr.push({
      package: packageId,
      services,
      datetime,
      note,
      nurses
    });
    localStorage.setItem("appointments", JSON.stringify(arr));
    setLoading(false);
    alert("Thanh toán thành công bằng ví!");
    router.push("/appointments");
  };

  // Fix hydration: format datetime ở client
  const [formattedDatetime, setFormattedDatetime] = useState("");
  useEffect(() => {
    if (datetime) {
      setFormattedDatetime(new Date(datetime).toLocaleString());
    } else {
      setFormattedDatetime("-");
    }
  }, [datetime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-10 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-2 md:px-0">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 gap-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center shadow-lg mb-2">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-1.293-6.707 6-6a1 1 0 0 0-1.414-1.414L11 12.586l-2.293-2.293A1 1 0 0 0 7.293 11.707l3 3a1 1 0 0 0 1.414 0Z"/></svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 text-center">Thanh toán dịch vụ</h1>
          </div>
          {/* Thông tin dịch vụ/gói */}
          {packageId && packageDetail && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2 text-blue-700">Gói dịch vụ</h2>
              <div className="bg-blue-50 rounded-xl p-4 mb-2">
                <div className="font-bold text-lg text-pink-700 mb-1">{packageDetail.ServiceName}</div>
                <div className="text-gray-700 mb-1">{packageDetail.Description}</div>
                <div className="text-gray-500 text-sm mb-1">Thời gian: {packageDetail.Duration}</div>
                <div className="text-gray-700 font-semibold">Giá gói: <span className="text-pink-600 font-bold">{(packageDetail.Price || 0).toLocaleString()}đ</span></div>
                {packageDetail.Discount && <div className="text-green-600 font-semibold">Giảm giá: {packageDetail.Discount}%</div>}
              </div>
              {childServices.length > 0 && (
                <div className="mt-2">
                  <h3 className="font-semibold text-blue-700 mb-2">Các dịch vụ trong gói:</h3>
                  <ul className="space-y-2">
                    {childServices.map((s, idx) => (
                      <li key={s.ServiceID || idx} className="bg-white rounded-lg shadow p-3 border flex flex-col gap-1">
                        <span className="font-bold text-blue-700">{s.ServiceName}</span>
                        <span className="text-pink-600 font-semibold">{(s.Price || 0).toLocaleString()}đ</span>
                        <div className="text-gray-500 text-sm">{s.Description}</div>
                        <div className="text-gray-500 text-xs">Thời gian: {s.Duration}</div>
                        {getStaffInfo(s.ServiceID) && (
                          <div className="text-xs text-green-700 mt-1">Nhân sự: {getStaffInfo(s.ServiceID).name} ({getStaffInfo(s.ServiceID).type === 'nurse' ? 'Y tá' : 'Chuyên gia'})</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {selectedServices.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2 text-blue-700">Các dịch vụ lẻ</h2>
              <ul className="space-y-2">
                {selectedServices.map((s) => (
                  <li key={s.ServiceID} className="bg-white rounded-lg shadow p-3 border flex flex-col gap-1">
                    <span className="font-bold text-blue-700">{s.ServiceName}</span>
                    <span className="text-pink-600 font-semibold">{(s.Price || 0).toLocaleString()}đ</span>
                    <div className="text-gray-500 text-sm">{s.Description}</div>
                    {getStaffInfo(s.ServiceID) && (
                      <div className="text-xs text-green-700 mt-1">Nhân sự: {getStaffInfo(s.ServiceID).name} ({getStaffInfo(s.ServiceID).type === 'nurse' ? 'Y tá' : 'Chuyên gia'})</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Thông tin khác */}
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <span className="font-semibold">Ngày giờ sử dụng dịch vụ: </span>
              <span>{formattedDatetime}</span>
            </div>
            <div>
              <span className="font-semibold">Ghi chú: </span>
              <span>{note || "-"}</span>
            </div>
          </div>
          {/* Tổng tiền & số dư ví */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Tổng tiền:</span>
              <span className="text-2xl text-pink-600 font-extrabold">{total.toLocaleString()}đ</span>
            </div>
            {myWallet && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Số dư ví:</span>
                <span className={myWallet.Amount < total ? "text-red-500 font-bold" : "text-green-600 font-bold"}>{myWallet.Amount.toLocaleString()}đ</span>
              </div>
            )}
          </div>
          {/* Thông báo lỗi */}
          {error && <div className="text-red-500 mb-4 font-semibold animate-shake text-center">{error}</div>}
          {/* Nút thanh toán */}
          <button
            className="w-full py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-extrabold text-xl shadow-lg hover:scale-105 hover:shadow-xl transition disabled:opacity-60 mt-2"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận thanh toán bằng ví"}
          </button>
        </div>
      </div>
    </div>
  );
} 