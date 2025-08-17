"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useEffect, useState, useContext, Suspense, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useWalletContext } from "@/context/WalletContext";
import { calculateCompletePayment } from '../booking/utils/paymentCalculation';
import {
  PaymentHeader,
  AppointmentInfo,
  PaymentInfo,
  PaymentSuccessModal,
  StaffSelection,
} from './components';

// Custom hooks
import { usePaymentData } from './hooks/usePaymentData';
import { useStaffSelection } from './hooks/useStaffSelection';
import { usePaymentProcessing } from './hooks/usePaymentProcessing';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import customizeTaskService from '@/services/api/customizeTaskService';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const { user } = useContext(AuthContext);
  const { wallet: contextWallet, refreshWalletData } = useWalletContext();

  // Custom hooks
  const {
    booking,
    bookingData,
    loading,
    error: dataError,
    refreshData
  } = usePaymentData(bookingId, user);

  const {
    selectionMode,
    setSelectionMode,
    selectedStaffByTask,
    setSelectedStaffByTask,
    canConfirm,
    assignError,
    setAssignError,
    handleAssignNursing
  } = useStaffSelection(booking, bookingData);

  const {
    isProcessingPayment,
    showSuccessModal,
    setShowSuccessModal,
    lastInvoiceId,
    handleConfirm,
    handlePaymentSuccess
  } = usePaymentProcessing({
    booking,
    bookingData,
    selectionMode,
    selectedStaffByTask,
    canConfirm,
    contextWallet,
    refreshWalletData,
    router
  });

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
  if (dataError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong className="font-bold">Lỗi:</strong>
              <span className="block sm:inline"> {dataError}</span>
            </div>
            <button
              onClick={refreshData}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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

        {/* Error Modal */}
        {dataError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full relative">
              <div className="flex items-center mb-4">
                <span className="text-red-600 text-2xl mr-2">&#9888;</span>
                <span className="text-xl font-bold text-red-700">Lỗi</span>
              </div>
              <div className="text-gray-800 whitespace-pre-line mb-6">{dataError}</div>
              <button
                onClick={refreshData}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Service Information */}
            <ServiceInfoCard 
              bookingData={bookingData}
              customizePackages={booking?.customizePackages || []}
              serviceTypes={booking?.serviceTypes || []}
            />

            {/* Appointment Information */}
            <AppointmentInfo
              datetime={bookingData?.datetime}
              note={bookingData?.note}
              selectedCareProfile={bookingData?.selectedCareProfile}
              selectedStaff={bookingData?.selectedStaff}
              getStaffInfo={getStaffInfo}
            />

            {/* Staff Selection */}
            {selectionMode === 'user' && (
              <StaffSelection
                tasks={booking?.customizeTasks || []}
                serviceTypes={booking?.serviceTypes || []}
                careProfile={booking?.careProfile}
                nursingSpecialists={booking?.nursingSpecialists || []}
                selectedStaffByTask={selectedStaffByTask}
                setSelectedStaffByTask={setSelectedStaffByTask}
                getCandidatesForService={getCandidatesForService}
                onAssign={handleAssignNurseToTask}
                accounts={booking?.accounts || []}
              />
            )}
            
            {assignError && (
              <div className="text-red-500 text-center mt-2 font-semibold">{assignError}</div>
            )}
          </div>

          {/* Right Column */}
          <div>
            <PaymentInfo
              total={bookingData?.total || 0}
              myWallet={contextWallet}
              error={dataError}
              loading={loading}
              handleConfirm={handleConfirm}
              isProcessingPayment={isProcessingPayment}
              paymentBreakdown={bookingData?.paymentCalculation}
              selectionMode={selectionMode}
              setSelectionMode={setSelectionMode}
              canConfirm={canConfirm}
            />
          </div>
        </div>

        {/* Success Modal */}
        <PaymentSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            router.push('/appointments');
          }}
          invoiceId={lastInvoiceId}
          amount={bookingData?.total}
          onGoToBookings={() => {
            setShowSuccessModal(false);
            router.push('/appointments');
          }}
        />
      </div>
    </div>
  );
}

// Helper functions
const getStaffInfo = (serviceId, booking, nursingSpecialists) => {
  if (!booking?.SelectedStaff && !booking?.selectedStaff) return null;

  const selectedStaff = booking.SelectedStaff || booking.selectedStaff || {};
  const staff = selectedStaff[serviceId];
  if (!staff) return null;

  const specialist = nursingSpecialists?.find(n =>
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

const getCandidatesForService = async (customizeTaskId) => {
  try {
    console.log('Fetching nurses for customizeTaskId:', customizeTaskId);
    const freeNurses = await nursingSpecialistService.getAllFreeNursingSpecialists(customizeTaskId);
    console.log('API response:', freeNurses);
    return Array.isArray(freeNurses) ? freeNurses : [];
  } catch (e) {
    console.error('Không thể lấy danh sách nurse rảnh:', e);
    return [];
  }
};

// Function để gán nurse cho task và lên lịch
const handleAssignNurseToTask = async (customizeTaskId, nursingId) => {
  try {
    console.log(`Assigning nurse ${nursingId} to task ${customizeTaskId}`);
    
    // Gọi API để cập nhật nursing assignment và lên lịch
    await customizeTaskService.updateNursing(customizeTaskId, nursingId);
    
    console.log(`Successfully assigned nurse ${nursingId} to task ${customizeTaskId}`);
    
    // Có thể thêm thông báo thành công ở đây
    return true;
  } catch (error) {
    console.error(`Error assigning nurse ${nursingId} to task ${customizeTaskId}:`, error);
    throw new Error(`Không thể gán điều dưỡng: ${error.message || 'Lỗi không xác định'}`);
  }
};

// Service Info Card Component
const ServiceInfoCard = ({ bookingData, customizePackages, serviceTypes }) => {
  // Tính toán thông tin dịch vụ chi tiết
  const serviceDetails = useMemo(() => {
    if (!customizePackages || customizePackages.length === 0) return [];

    return customizePackages.map((pkg) => {
      // Tìm thông tin dịch vụ từ serviceTypes
      const serviceType = serviceTypes.find(s => 
        s.serviceID === pkg.serviceID || 
        s.serviceTypeID === pkg.serviceID ||
        s.ServiceID === pkg.serviceID
      );

      return {
        id: pkg.packageID || pkg.id,
        name: serviceType?.serviceName || pkg.serviceName || pkg.name || `Dịch vụ #${pkg.serviceID}`,
        price: serviceType?.price || pkg.price || pkg.amount || 0,
        quantity: pkg.quantity || 1,
        total: (serviceType?.price || pkg.price || pkg.amount || 0) * (pkg.quantity || 1)
      };
    });
  }, [customizePackages, serviceTypes]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 text-xl font-bold">₫</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Thông tin dịch vụ</h2>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold text-gray-700">Tổng tiền:</span>
        <span className="text-2xl font-bold text-pink-600">
          {bookingData?.total?.toLocaleString()}đ
        </span>
      </div>
      
      {serviceDetails.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Dịch vụ đã đặt</h3>
          <ul className="divide-y divide-gray-200">
            {serviceDetails.map((service, idx) => (
              <li key={service.id || idx} className="py-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="font-semibold text-blue-700 block">
                      {service.name}
                    </span>
                    {service.quantity > 1 && (
                      <span className="text-sm text-gray-600">
                        Số lượng: {service.quantity}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-green-600">
                      {service.total.toLocaleString()}đ
                    </span>
                    {service.quantity > 1 && (
                      <div className="text-xs text-gray-500">
                        {service.price.toLocaleString()}đ/đơn vị
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

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