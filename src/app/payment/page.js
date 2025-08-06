"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useEffect, useState, useContext, Suspense } from "react";
// import customizePackageService from '@/services/api/customizePackageService';
import serviceTypeService from '@/services/api/serviceTypeService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import bookingService from '@/services/api/bookingService';
import walletService from '@/services/api/walletService';
import transactionHistoryService from '@/services/api/transactionHistoryService';
import invoiceService from '@/services/api/invoiceService';
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

        // Fetch wallet data riêng để debug
        let walletsData = [];
        try {
          walletsData = await walletService.getAllWallets();
        } catch (walletError) {
          console.error('❌ Lỗi khi lấy ví:', walletError);
        }
        const [
          packagesData,
          serviceTypesData,
          serviceTasksData,
          nursingSpecialistsData
        ] = await Promise.all([
          // customizePackageService.getCustomizePackages(),
          serviceTypeService.getServiceTypes(),
          serviceTaskService.getServiceTasks(),
          nursingSpecialistService.getNursingSpecialists()
        ]);

        setPackages(packagesData);
        setServiceTypes(serviceTypesData);
        setServiceTasks(serviceTasksData);
        setNursingSpecialists(nursingSpecialistsData);
        setCareProfiles([]); // Không cần care profiles từ API nữa
        setWallets(walletsData);

        // Nếu có bookingId, fetch booking data với careProfile
        if (bookingId) {
          try {
            const bookingData = await bookingService.getBookingByIdWithCareProfile(bookingId);
            setBooking(bookingData);
          } catch (error) {
            setError('Không thể tải thông tin đặt lịch. Vui lòng thử lại sau.');
          }
        }
      } catch (error) {
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

    let selectedPackage = null;
    let selectedServices = [];
    let total = 0;
    let childServices = [];

    // Parse booking data theo cấu trúc thực tế từ API
    const bookingID = booking.bookingID || booking.booking_ID;
    const careProfileID = booking.careProfileID || booking.care_ProfileID;
    const workdate = booking.workdate || booking.work_date;
    const amount = booking.amount || booking.totalAmount || booking.total_Amount;
    const status = booking.status || booking.Status;
    const extra = booking.extra || booking.Extra;
    const isSchedule = booking.isSchedule || booking.is_schedule;
    const createdAt = booking.createdAt || booking.created_at;
    const updatedAt = booking.updatedAt || booking.updated_at;

    // Nếu booking chỉ có amount mà không có service details, sử dụng amount làm total
    if (amount && (!booking.customizePackageCreateDto && !booking.customizePackageCreateDtos)) {
      total = amount;
    } else {
      // Lấy thông tin từ customizePackageCreateDto (cho service booking)
      const customizePackageCreateDtos = booking.customizePackageCreateDtos || booking.customize_package_create_dtos || [];

      // Lấy thông tin từ customizePackageCreateDto (cho package booking)
      const customizePackageCreateDto = booking.customizePackageCreateDto || booking.customize_package_create_dto;

      if (customizePackageCreateDto) {
        // Package booking
        const serviceID = customizePackageCreateDto.serviceID || customizePackageCreateDto.service_ID;
        const quantity = customizePackageCreateDto.quantity || 1;

        selectedPackage = serviceTypes && serviceTypes.length > 0 ? serviceTypes.find(s =>
          s.serviceID === serviceID ||
          s.serviceTypeID === serviceID ||
          s.ServiceID === serviceID
        ) : null;

        total = amount || selectedPackage?.price || selectedPackage?.Price || 0;

        // Lấy dịch vụ con của package
        if (selectedPackage) {
          const tasks = serviceTasks.filter(t =>
            t.package_ServiceID === serviceID ||
            t.packageServiceID === serviceID ||
            t.Package_ServiceID === serviceID
          );
          childServices = tasks.map(t => {
            const childServiceId = t.child_ServiceID || t.childServiceID || t.Child_ServiceID;
            return serviceTypes && serviceTypes.length > 0 ? serviceTypes.find(s =>
              s.serviceID === childServiceId ||
              s.serviceTypeID === childServiceId ||
              s.ServiceID === childServiceId
            ) : null;
          }).filter(Boolean);
        }
      } else if (customizePackageCreateDtos && customizePackageCreateDtos.length > 0) {
        // Service booking - multiple services
        selectedServices = customizePackageCreateDtos.map(dto => {
          const serviceID = dto.serviceID || dto.service_ID;
          const quantity = dto.quantity || 1;

          const serviceType = serviceTypes && serviceTypes.length > 0 ? serviceTypes.find(s =>
            s.serviceID === serviceID ||
            s.serviceTypeID === serviceID ||
            s.ServiceID === serviceID
          ) : null;

          return {
            ...serviceType,
            quantity: quantity
          };
        }).filter(Boolean);

        total = amount || selectedServices.reduce((sum, service) =>
          sum + ((service.price || service.Price || 0) * (service.quantity || 1)), 0
        );
      }
    }

    const selectedCareProfile = (() => {
      // Lấy care profile info từ booking.careProfile
      if (!booking || !booking.careProfile) return null;

      const careProfile = booking.careProfile;
      return {
        careProfileID: careProfile.careProfileID,
        profileName: careProfile.profileName || 'Người được chăm sóc',
        dateOfBirth: careProfile.dateOfBirth,
        phoneNumber: careProfile.phoneNumber,
        address: careProfile.address,
        status: careProfile.status || 'active',
        note: careProfile.note
      };
    })();

    return {
      selectedPackage,
      selectedServices,
      total,
      childServices,
      selectedCareProfile,
      datetime: workdate,
      note: extra,
      status,
      bookingID
    };
  }, [booking, serviceTypes, serviceTasks, careProfiles]);

  // Lấy thông tin nhân sự cho từng dịch vụ
  const getStaffInfo = (serviceId) => {
    if (!booking?.SelectedStaff && !booking?.selectedStaff) return null;

    const selectedStaff = booking.SelectedStaff || booking.selectedStaff || {};
    const staff = selectedStaff[serviceId];
    if (!staff) return null;

    const specialist = nursingSpecialists && nursingSpecialists.length > 0 ? nursingSpecialists.find(n =>
      n.NursingID === Number(staff.id) ||
      n.nursingID === Number(staff.id) ||
      n.nursing_ID === Number(staff.id)
    ) : null;
    return {
      name: specialist?.FullName || specialist?.fullName || 'Không xác định',
      role: specialist?.Major || specialist?.major || 'Nhân viên',
      type: staff.type
    };
  };

  // Handle payment confirmation
  const handleConfirm = async () => {
    if (!booking || !bookingData) {
      setError('Không có thông tin booking để thanh toán');
      return;
    }

    try {
      setIsProcessingPayment(true);
      setError('');

      // 1. Tạo invoice trước (luôn luôn)
      const invoiceData = {
        bookingID: booking.bookingID || booking.booking_ID,
        content: `Thanh toán cho booking #${booking.bookingID || booking.booking_ID} - Số tiền: ${bookingData.total?.toLocaleString('vi-VN')}₫`
      };

      const createdInvoice = await invoiceService.createInvoice(invoiceData);

      // 2. Kiểm tra ví có đủ tiền không
      const userWallet = wallets.find(w => w.accountID === user.accountID);
      if (!userWallet) {
        console.error('❌ Không tìm thấy ví của user:', user.accountID);
        setError(`Không tìm thấy ví của bạn. User AccountID: ${user.accountID}, Available wallets: ${wallets.map(w => `ID:${w.walletID}, AccountID:${w.accountID}`).join(', ')}`);
        return;
      }



      if (userWallet.amount < bookingData.total) {
        // Không đủ tiền: giữ invoice pending, không tạo transaction
        setError(`Số dư ví không đủ để thanh toán. Cần: ${bookingData.total?.toLocaleString('vi-VN')}₫, Hiện có: ${userWallet.amount?.toLocaleString('vi-VN')}₫. Hóa đơn đã được tạo với trạng thái "Chờ thanh toán". Vui lòng nạp thêm tiền vào ví và thử lại.`);
        return;
      }

      // 3. Đủ tiền: tạo transaction history
      const paymentData = {
        walletID: userWallet.walletID,
        amount: bookingData.total,
        before: userWallet.amount,
        after: userWallet.amount - bookingData.total,
        transferrer: user.accountID,
        receiver: user.accountID, // Self-payment
        note: `Thanh toán cho booking #${booking.bookingID || booking.booking_ID}`,
        status: 'completed'
      };

      // Lấy invoiceId từ response
      const invoiceId = createdInvoice.invoiceID || createdInvoice.id || createdInvoice.invoiceId;
      if (!invoiceId) {
        console.log('Backend không trả về invoiceId, sử dụng bookingId làm invoiceId');
        console.log('Lưu ý: Backend API cần được cập nhật để trả về invoiceId trong response');
        // Tạm thời sử dụng bookingId vì backend không trả về invoiceId
        const fallbackInvoiceId = booking.bookingID || booking.booking_ID;

        if (!fallbackInvoiceId) {
          console.error('Không tìm thấy bookingId để làm fallback');
          setError('Không thể lấy thông tin hóa đơn. Vui lòng thử lại.');
          return;
        }


        const createdTransaction = await transactionHistoryService.invoicePayment(fallbackInvoiceId, paymentData);

      } else {
        const createdTransaction = await transactionHistoryService.invoicePayment(invoiceId, paymentData);

      }

      // 5. Trừ tiền từ ví
      const newAmount = userWallet.amount - bookingData.total;
      await walletService.updateWalletAmount(userWallet.walletID, newAmount);

      // 6. Refresh wallet data để cập nhật header
      try {
        const refreshedWallets = await walletService.getAllWallets();
        setWallets(refreshedWallets);
      } catch (refreshError) {
        console.error('❌ Lỗi khi refresh wallet:', refreshError);
      }

      // Hiển thị modal thành công
      const finalInvoiceId = createdInvoice.invoiceID || createdInvoice.id || createdInvoice.invoiceId || (booking.bookingID || booking.booking_ID);
      setLastInvoiceId(finalInvoiceId);
      setShowSuccessModal(true);

      // Thông báo thành công
      alert('Thanh toán thành công! Đặt lịch đã được xác nhận.');

    } catch (error) {
      console.error('❌ Lỗi trong quá trình thanh toán:', error);
      setError(`Có lỗi xảy ra khi thanh toán: ${error.message}`);
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
              bookingData={bookingData}
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
              total={bookingData?.total || 0}
              myWallet={(() => {

                if (!wallets || wallets.length === 0) {
                  return null;
                }

                // Tìm wallet đầu tiên có status active
                const activeWallet = wallets.find(w => {
                  const status = w.status || w.Status;
                  return status === "active";
                });

                if (activeWallet) {
                  return activeWallet;
                }

                return null;
              })()}
              error={error}
              loading={loading}
              handleConfirm={handleConfirm}
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