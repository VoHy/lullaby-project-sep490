"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useEffect, useState, useContext, Suspense } from "react";
// import customizePackageService from '@/services/api/customizePackageService';
import serviceTypeService from '@/services/api/serviceTypeService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import bookingService from '@/services/api/bookingService';
import walletService from '@/services/api/walletService';
import transactionHistoryService from '@/services/api/transactionHistoryService';
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

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState(null);
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
          walletService.getAllWallets()
        ]);

        setPackages(packagesData);
        setServiceTypes(serviceTypesData);
        setServiceTasks(serviceTasksData);
        setNursingSpecialists(nursingSpecialistsData);
        setCareProfiles(careProfilesData);
        setWallets(walletsData); // Commented out wallet functionality

        // Nếu có bookingId, fetch booking data
        if (bookingId) {
          try {
            const bookingData = await bookingService.getBookingById(bookingId);
            console.log('Booking data received:', bookingData);
            setBooking(bookingData);
          } catch (error) {
            console.error('Error fetching booking:', error);
            setError('Không thể tải thông tin đặt lịch. Vui lòng thử lại sau.');
          }
        }
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
  }, [user, bookingId]);

  // Tính toán dữ liệu từ booking
  const bookingData = useMemo(() => {
    if (!booking) return null;

    console.log('Processing booking data:', booking);
    console.log('Available serviceTypes:', serviceTypes.length);
    console.log('Available serviceTasks:', serviceTasks.length);

    let selectedPackage = null;
    let selectedServices = [];
    let total = 0;
    let childServices = [];

    // Xác định loại booking (package hoặc service) - hỗ trợ nhiều field name
    const packageServiceId = booking.Package_ServiceID || booking.packageServiceID || booking.package_ServiceID;
    const serviceTaskId = booking.ServiceTaskID || booking.serviceTaskID || booking.service_TaskID;
    const serviceId = booking.ServiceID || booking.serviceID || booking.service_ID;
    const careProfileId = booking.CareProfileID || booking.careProfileID || booking.care_ProfileID;
    const appointmentDate = booking.AppointmentDate || booking.appointmentDate || booking.appointment_Date;
    const note = booking.Note || booking.note;
    const status = booking.Status || booking.status;
    const paymentStatus = booking.PaymentStatus || booking.paymentStatus;
    const totalAmount = booking.TotalAmount || booking.totalAmount || booking.total_Amount;

    if (packageServiceId) {
      // Package booking
      selectedPackage = serviceTypes.find(s => 
        s.ServiceID === packageServiceId || 
        s.serviceID === packageServiceId ||
        s.service_ID === packageServiceId
      );
      total = totalAmount || selectedPackage?.Price || selectedPackage?.price || 0;
      
      // Lấy dịch vụ con của package
      const tasks = serviceTasks.filter(t => 
        t.Package_ServiceID === packageServiceId || 
        t.packageServiceID === packageServiceId ||
        t.package_ServiceID === packageServiceId
      );
      childServices = tasks.map(t => {
        const childServiceId = t.Child_ServiceID || t.childServiceID || t.child_ServiceID;
        return serviceTypes.find(s => 
          s.ServiceID === childServiceId || 
          s.serviceID === childServiceId ||
          s.service_ID === childServiceId
        );
      }).filter(Boolean);
    } else if (serviceTaskId) {
      // Service booking via ServiceTask
      const serviceTask = serviceTasks.find(t => 
        t.ServiceTaskID === serviceTaskId || 
        t.serviceTaskID === serviceTaskId ||
        t.service_TaskID === serviceTaskId
      );
      if (serviceTask) {
        const taskServiceId = serviceTask.ServiceID || serviceTask.serviceID || serviceTask.service_ID;
        const serviceType = serviceTypes.find(s => 
          s.ServiceID === taskServiceId || 
          s.serviceID === taskServiceId ||
          s.service_ID === taskServiceId
        );
        selectedServices = [serviceType].filter(Boolean);
        total = totalAmount || serviceType?.Price || serviceType?.price || 0;
      }
    } else if (serviceId) {
      // Service booking directly via ServiceID
      const serviceType = serviceTypes.find(s => 
        s.ServiceID === serviceId || 
        s.serviceID === serviceId ||
        s.service_ID === serviceId
      );
      selectedServices = [serviceType].filter(Boolean);
      total = totalAmount || serviceType?.Price || serviceType?.price || 0;
    }

    const selectedCareProfile = careProfiles.find(cp => 
      cp.CareProfileID === careProfileId || 
      cp.careProfileID === careProfileId ||
      cp.care_ProfileID === careProfileId
    );

    console.log('Processed booking data:', {
      selectedPackage,
      selectedServices,
      total,
      childServices,
      selectedCareProfile,
      datetime: appointmentDate,
      note,
      status,
      paymentStatus
    });

    return {
      selectedPackage,
      selectedServices,
      total,
      childServices,
      selectedCareProfile,
      datetime: appointmentDate,
      note,
      status,
      paymentStatus
    };
  }, [booking, serviceTypes, serviceTasks, careProfiles]);

  // Lấy thông tin nhân sự cho từng dịch vụ
  const getStaffInfo = (serviceId) => {
    if (!booking?.SelectedStaff && !booking?.selectedStaff) return null;
    
    const selectedStaff = booking.SelectedStaff || booking.selectedStaff || {};
    const staff = selectedStaff[serviceId];
    if (!staff) return null;
    
    const specialist = nursingSpecialists.find(n => 
      n.NursingID === Number(staff.id) || 
      n.nursingID === Number(staff.id) ||
      n.nursing_ID === Number(staff.id)
    );
    return {
      name: specialist?.FullName || specialist?.fullName || 'Không xác định',
      role: specialist?.Major || specialist?.major || 'Nhân viên',
      type: staff.type
    };
  };

  const handleConfirm = async () => {
    try {
      setIsProcessingPayment(true);
      setError('');
      
      // Kiểm tra ví của user
      if (!wallets || wallets.length === 0) {
        setError('Không thể tải thông tin ví. Vui lòng thử lại sau.');
        return;
      }

      const userWallet = wallets.find(w => (w.accountID === user.accountID || w.AccountID === user.accountID) && w.status === "active");
      if (!userWallet) {
        setError('Bạn chưa có ví hoặc ví không hoạt động. Vui lòng liên hệ admin.');
        return;
      }

      // Kiểm tra số dư
      const walletAmount = userWallet.Amount || userWallet.amount;
      if (walletAmount < bookingData?.total) {
        setError('Số dư trong ví không đủ để thanh toán. Vui lòng nạp thêm tiền.');
        return;
      }

      // Sử dụng transactionHistoryService để thanh toán hóa đơn
      const paymentData = {
        walletID: userWallet.WalletID || userWallet.walletID,
        invoiceID: bookingId
      };

      // Gọi API thanh toán hóa đơn
      await transactionHistoryService.invoicePayment(bookingId, paymentData);

      // Cập nhật trạng thái booking thành confirmed
      await bookingService.updateStatus(bookingId, 'CONFIRMED');
      
      // Hiển thị modal thành công
      setShowSuccessModal(true);
      setLastInvoiceId(bookingId);
    } catch (error) {
      console.error('Error confirming payment:', error);
      setError('Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại sau.');
    } finally {
      setIsProcessingPayment(false);
    }
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
              packageId={booking?.serviceId}
              packageDetail={bookingData?.selectedPackage}
              selectedServices={bookingData?.selectedServices}
              childServices={bookingData?.childServices}
              total={bookingData?.total}
              getStaffInfo={getStaffInfo}
            />
            
            <AppointmentInfo 
              datetime={bookingData?.datetime}
              note={bookingData?.note}
              selectedCareProfile={bookingData?.selectedCareProfile}
              selectedStaff={bookingData?.selectedStaff}
              getStaffInfo={getStaffInfo}
            />
          </div>
          
          {/* Right Column */}
          <div>
            <PaymentInfo 
              total={bookingData?.total}
              myWallet={wallets && wallets.length > 0 ? wallets.find(w => (w.accountID === user.accountID || w.AccountID === user.accountID) && w.status === "active") : null}
              onConfirm={handleConfirm}
              isProcessingPayment={isProcessingPayment}
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

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải trang thanh toán...</p>
          </div>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
} 