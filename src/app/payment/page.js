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
import careProfiles from '@/mock/CareProfile';
import { 
  PaymentHeader, 
  ServiceInfo, 
  AppointmentInfo, 
  PaymentInfo,
  PaymentSuccessModal
} from './components';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = searchParams.get("package");
  const services = searchParams.get("services");
  const datetime = searchParams.get("datetime");
  const note = searchParams.get("note");
  const nurses = searchParams.get("nurses"); // dạng "1,2"
  const careProfileId = searchParams.get("careProfileId");

  const [packages, setPackages] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [wallets, setWallets] = useState([]);

  const { user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState(null);

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

  // Lấy thông tin CareProfile đã chọn
  const selectedCareProfile = careProfileId ? careProfiles.find(p => p.CareProfileID === Number(careProfileId)) : null;

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
    const invoiceId = 1000 + arr.length;
    arr.push({
      package: packageId,
      services,
      datetime,
      note,
      nurses,
      careProfileId: searchParams.get("careProfileId"),
      selectedStaff: searchParams.get("selectedStaff"),
      amount: total,
      createdAt: new Date().toISOString(),
      userId: user.AccountID // Thêm user ID để lọc theo user
    });
    localStorage.setItem("appointments", JSON.stringify(arr));
    setLoading(false);
    setLastInvoiceId(invoiceId);
    setShowSuccessModal(true);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <PaymentHeader />

        {/* Layout 2 Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Row 1: Thông tin dịch vụ */}
          <div>
            <ServiceInfo 
              packageId={packageId}
              packageDetail={packageDetail}
              childServices={childServices}
              selectedServices={selectedServices}
              getStaffInfo={getStaffInfo}
            />
            
            {/* Thông tin lịch hẹn */}
            <AppointmentInfo 
              formattedDatetime={formattedDatetime}
              note={note}
              selectedCareProfile={selectedCareProfile}
            />
          </div>

          {/* Row 2: Thông tin thanh toán */}
          <PaymentInfo 
            total={total}
            myWallet={myWallet}
            error={error}
            loading={loading}
            handleConfirm={handleConfirm}
          />
        </div>
      </div>

      {/* Success Modal */}
      <PaymentSuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        invoiceId={lastInvoiceId}
      />
    </div>
  );
} 