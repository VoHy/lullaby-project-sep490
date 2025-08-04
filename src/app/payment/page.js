"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useEffect, useState, useContext } from "react";
// import customizePackageService from '@/services/api/customizePackageService';
import serviceTypeService from '@/services/api/serviceTypeService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
// import walletService from '@/services/api/walletService';
import { AuthContext } from "@/context/AuthContext";

// Thay thế import mock data bằng services
import serviceTaskService from '@/services/api/serviceTaskService';
import careProfileService from '@/services/api/careProfileService';
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
  const [serviceTasks, setServiceTasks] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useContext(AuthContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState(null);

  // Load data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const [
          packagesData,
          serviceTypesData,
          serviceTasksData,
          nursingSpecialistsData,
          careProfilesData,
          walletsData
        ] = await Promise.all([
          // customizePackageService.getCustomizePackages(),
          serviceTypeService.getServiceTypes(),
          serviceTaskService.getServiceTasks(),
          nursingSpecialistService.getNursingSpecialists(),
          careProfileService.getCareProfiles(),
          // walletService.getWallets()
        ]);

        setPackages(packagesData);
        setServiceTypes(serviceTypesData);
        setServiceTasks(serviceTasksData);
        setNursingSpecialists(nursingSpecialistsData);
        setCareProfiles(careProfilesData);
        setWallets([]); // Commented out wallet functionality
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

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

  // Lấy thông tin CareProfile
  const selectedCareProfile = careProfiles.find(cp => cp.CareProfileID === Number(careProfileId));

  // Lấy thông tin nhân sự cho từng dịch vụ
  const getStaffInfo = (serviceId) => {
    const staff = selectedStaff[serviceId];
    if (!staff) return null;
    
    const specialist = nursingSpecialists.find(n => n.NursingID === Number(staff.id));
    return {
      name: specialist?.FullName || 'Không xác định',
      role: specialist?.Major || 'Nhân viên',
      type: staff.type
    };
  };

  const handleConfirm = async () => {
    // Logic xử lý thanh toán
    setShowSuccessModal(true);
    setLastInvoiceId(Math.floor(Math.random() * 1000000));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu thanh toán...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <PaymentHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <ServiceInfo 
              packageDetail={packageDetail}
              selectedServices={selectedServices}
              childServices={childServices}
              total={total}
            />
            
            <AppointmentInfo 
              datetime={datetime}
              note={note}
              selectedCareProfile={selectedCareProfile}
              selectedStaff={selectedStaff}
              getStaffInfo={getStaffInfo}
            />
          </div>
          
          {/* Right Column */}
          <div>
            <PaymentInfo 
              total={total}
              myWallet={myWallet}
              onConfirm={handleConfirm}
            />
          </div>
        </div>
        
        <PaymentSuccessModal 
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          invoiceId={lastInvoiceId}
        />
      </div>
    </div>
  );
} 