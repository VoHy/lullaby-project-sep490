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
  PaymentSuccessModal
} from './components';

// Custom hooks
import { usePaymentData } from './hooks/usePaymentData';
import { useStaffSelection } from './hooks/useStaffSelection';
import { usePaymentProcessing } from './hooks/usePaymentProcessing';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import customizeTaskService from '@/services/api/customizeTaskService';
import bookingService from '@/services/api/bookingService';
import notificationService from '@/services/api/notificationService';

// Icons
import { Clock, Calendar } from 'lucide-react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const { user } = useContext(AuthContext);
  const { wallet: contextWallet, refreshWalletData } = useWalletContext();

  // State cho relative selection
  const [selectedRelativeByTask, setSelectedRelativeByTask] = useState({});
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Custom hooks
  const {
    booking,
    bookingData,
    loading,
    error: dataError,
    refreshData,
    relatives,
    serviceTypes,
    serviceTasks,
    accounts,
    zoneDetails,
    zones
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

  // Hàm tìm manager theo zone
  const findManagerByZone = useCallback((zoneID) => {
    if (!zoneID || !accounts || !zones) return null;

    // Tìm zone có zoneID này
    const zone = zones.find(z => z.zoneID === zoneID);
    if (!zone?.managerID) {
      return null;
    }

    // Tìm manager theo managerID từ zone
    const manager = accounts.find(acc =>
      acc.roleID === 3 &&
      acc.accountID === zone.managerID
    );
    return manager;
  }, [accounts, zones]);

  // Hàm lấy zoneID từ careProfile
  const getZoneIDFromCareProfile = useCallback(() => {
    if (bookingData?.zoneID) {
      return bookingData.zoneID;
    }

    // Nếu chưa có zoneID, lấy từ zoneDetailID của careProfile
    if (bookingData?.selectedCareProfile?.zoneDetailID && zoneDetails?.length > 0) {
      const zoneDetail = zoneDetails.find(zd =>
        zd.zoneDetailID === bookingData.selectedCareProfile.zoneDetailID ||
        zd.ZoneDetailID === bookingData.selectedCareProfile.zoneDetailID ||
        zd.zonedetailid === bookingData.selectedCareProfile.zoneDetailID
      );
      if (zoneDetail) {
        return zoneDetail.zoneID || zoneDetail.ZoneID;
      }
    }

    return null;
  }, [bookingData, zoneDetails]);

  // Hàm wrapper cho handleConfirm để gửi thông báo cho manager
  const handleConfirmWithNotify = useCallback(async () => {
    try {
      // Nếu chọn "Hệ thống tự chọn" và có thể lấy được zoneID
      if (selectionMode === 'auto') {
        // Kiểm tra xem accounts đã được load chưa
        if (!accounts || accounts.length === 0) {
          console.warn('Accounts chưa được load, bỏ qua thông báo manager');
          // Tiếp tục xử lý thanh toán mà không gửi thông báo
          await handleConfirm();
          return;
        }

        const zoneID = getZoneIDFromCareProfile();

        if (zoneID) {
          const manager = findManagerByZone(zoneID);
          if (manager) {
            try {
              await notificationService.createNotification({
                accountID: manager.accountID,
                message: "Bạn có yêu cầu điều phối chuyên viên mới"
              });
            } catch (notifyError) {
              console.error('Lỗi khi gửi thông báo cho manager:', notifyError);
              // Không throw error vì thanh toán vẫn có thể tiếp tục
            }
          } else {
            console.warn('Không tìm thấy manager cho zone:', zoneID);
          }
        } else {
          console.warn('Không thể xác định zoneID từ careProfile');
        }
      } else {
      }

      // Tiếp tục xử lý thanh toán
      await handleConfirm();
    } catch (error) {
      console.error('Error in payment confirmation:', error);
      throw error;
    }
  }, [selectionMode, zones, accounts, getZoneIDFromCareProfile, findManagerByZone, handleConfirm]);

  // Khởi tạo selectedRelativeByTask từ customizeTasks
  useEffect(() => {
    if (booking?.customizeTasks && Array.isArray(booking.customizeTasks)) {
      const initialRelativeSelection = {};
      booking.customizeTasks.forEach(task => {
        const customizeTaskId = task.customizeTaskID || task.customize_TaskID || task.id;
        const relativeId = task.relativeID || task.RelativeID;
        if (customizeTaskId && relativeId) {
          initialRelativeSelection[customizeTaskId] = relativeId;
        }
      });
      setSelectedRelativeByTask(initialRelativeSelection);
    }
  }, [booking?.customizeTasks]);

  // Hàm xử lý hủy booking
  const handleCancelBooking = async () => {
    if (!bookingId) {
      return;
    }

    setIsCancelling(true);
    setCancelError("");

    try {
      await bookingService.deleteBooking(parseInt(bookingId));

      // Chuyển về trang appointments
      router.push('/appointments');
    } catch (error) {
      console.error('Lỗi khi hủy booking:', error);
      setCancelError(`Không thể hủy booking. ${error.message || 'Vui lòng thử lại sau.'}`);
    } finally {
      setIsCancelling(false);
      setShowCancelModal(false);
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
            {/* Appointment Information */}
            <AppointmentInfo
              datetime={bookingData?.datetime}
              note={bookingData?.note}
              selectedCareProfile={bookingData?.selectedCareProfile}
              selectedStaff={bookingData?.selectedStaff}
              getStaffInfo={getStaffInfo}
            />
            {/* Service Information */}
            <ServiceInfoCard
              bookingData={bookingData}
              customizePackages={booking?.customizePackages || []}
              serviceTypes={booking?.serviceTypes || []}
              customizeTasks={booking?.customizeTasks || []}
              selectionMode={selectionMode}
              selectedStaffByTask={selectedStaffByTask}
              setSelectedStaffByTask={setSelectedStaffByTask}
              getCandidatesForService={getCandidatesForService}
              onAssign={handleAssignNurseToTask}
              accounts={booking?.accounts || []}
              selectedRelativeByTask={selectedRelativeByTask}
              relatives={relatives || []}
              setSelectedRelativeByTask={setSelectedRelativeByTask}
            />

            {/* Cancel Booking Section */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-purple-800 mb-2">Chọn cách phân công điều dưỡng</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`px-3 py-2 rounded-lg border text-sm font-medium ${selectionMode === 'user'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50'
                    }`}
                  onClick={() => setSelectionMode?.('user')}
                >
                  Người dùng chọn
                </button>
                <button
                  type="button"
                  className={`px-3 py-2 rounded-lg border text-sm font-medium ${selectionMode === 'auto'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50'
                    }`}
                  onClick={() => setSelectionMode?.('auto')}
                >
                  Hệ thống tự chọn
                </button>
              </div>
              {selectionMode === 'user' && (
                <div className="text-xs text-purple-700 mt-2">
                  Bạn cần chọn đủ điều dưỡng cho tất cả dịch vụ trước khi thanh toán.
                </div>
              )}
            </div>

            {/* Error display for staff assignment */}
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
              handleConfirm={handleConfirmWithNotify}
              isProcessingPayment={isProcessingPayment}
              paymentBreakdown={bookingData?.paymentCalculation}
              canConfirm={canConfirm}
              onCancel={handleCancelBooking}
              isCancelling={isCancelling}
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

        {/* Cancel Booking Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative">
              <div className="flex items-center mb-4">
                <span className="text-red-600 text-2xl mr-2"></span>
                <span className="text-xl font-bold text-red-700">Xác nhận hủy booking</span>
              </div>
              <div className="text-gray-800 mb-6">
                <p className="mb-2">Bạn có chắc chắn muốn hủy booking này không?</p>
                <p className="text-sm text-gray-600 mb-2">Booking ID: <span className="font-semibold">{bookingId}</span></p>
                {bookingData?.datetime && (
                  <p className="text-sm text-gray-600 mb-2">Ngày: <span className="font-semibold">{new Date(bookingData.datetime).toLocaleDateString('vi-VN')}</span></p>
                )}
                {bookingData?.selectedCareProfile?.profileName && (
                  <p className="text-sm text-gray-600 mb-2">Người được chăm sóc: <span className="font-semibold">{bookingData.selectedCareProfile.profileName}</span></p>
                )}
                <p className="text-sm text-red-600 font-semibold">Hành động này không thể hoàn tác.</p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={isCancelling}
                  className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
                >
                  Không hủy
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={isCancelling}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  {isCancelling ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang hủy...
                    </div>
                  ) : (
                    'Hủy booking'
                  )}
                </button>
              </div>
              {cancelError && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <div className="text-red-700 text-sm font-semibold">{cancelError}</div>
                </div>
              )}
            </div>
          </div>
        )}
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
    const freeNurses = await nursingSpecialistService.getAllFreeNursingSpecialists(customizeTaskId);
    return Array.isArray(freeNurses) ? freeNurses : [];
  } catch (e) {
    console.error('Không thể lấy danh sách nurse rảnh:', e);
    return [];
  }
};

// Function để gán nurse cho task (chỉ lưu vào state, không gọi API)
const handleAssignNurseToTask = async (customizeTaskId, nursingId) => {
  try {
    // Chỉ lưu vào state, KHÔNG gọi API ngay
    // API sẽ được gọi khi user xác nhận thanh toán
    return true;
  } catch (error) {
    console.error(`Error selecting nurse ${nursingId} for task ${customizeTaskId}:`, error);
    throw new Error(`Không thể chọn điều dưỡng: ${error.message || 'Lỗi không xác định'}`);
  }
};

// Service Info Card Component
const ServiceInfoCard = ({
  bookingData,
  customizePackages,
  serviceTypes,
  customizeTasks = [],
  selectionMode,
  selectedStaffByTask,
  setSelectedStaffByTask,
  getCandidatesForService,
  onAssign,
  accounts = [],
  selectedRelativeByTask = {}, // thêm dòng này
  relatives = [],
  setSelectedRelativeByTask
}) => {
  // State cho việc chọn điều dưỡng
  const [loadingMap, setLoadingMap] = useState({});
  const [candidatesByTask, setCandidatesByTask] = useState({});
  const [openTaskId, setOpenTaskId] = useState(null);
  const [relativeModalTaskId, setRelativeModalTaskId] = useState(null);

  // Tính toán thông tin dịch vụ chi tiết (KHÔNG group, mỗi customizeTask là 1 suất)
  const serviceDetails = useMemo(() => {
    if (!customizeTasks || customizeTasks.length === 0) return [];
    return customizeTasks.map((task, idx) => {
      const serviceType = serviceTypes.find(s =>
        s.serviceID === task.serviceID ||
        s.serviceTypeID === task.serviceID ||
        s.ServiceID === task.serviceID
      );
      return {
        id: task.customizeTaskID || task.id || idx,
        name: serviceType?.serviceName || `Dịch vụ #${task.serviceID}`,
        price: serviceType?.price || 0,
        total: serviceType?.price || 0,
        startTime: task.startTime,
        endTime: task.endTime,
        taskOrder: task.taskOrder,
        customizeTaskId: task.customizeTaskID || task.id,
        forMom: serviceType?.forMom || false, // Add forMom property
        // ... các trường khác nếu cần
      };
    });
  }, [customizeTasks, serviceTypes]);

  // Load candidates cho các task
  useEffect(() => {
    if (selectionMode !== 'user') return;

    let cancelled = false;
    const load = async () => {
      for (const service of serviceDetails) {
        const customizeTaskId = service.customizeTaskId;
        if (!customizeTaskId || candidatesByTask[customizeTaskId]) continue;

        setLoadingMap((m) => ({ ...m, [customizeTaskId]: true }));

        try {
          const list = await getCandidatesForService?.(customizeTaskId);
          if (!cancelled) {
            setCandidatesByTask((m) => ({ ...m, [customizeTaskId]: list || [] }));
          }
        } catch (error) {
          console.error(`Error loading candidates for customizeTaskId ${customizeTaskId}:`, error);
          if (!cancelled) {
            setCandidatesByTask((m) => ({ ...m, [customizeTaskId]: [] }));
          }
        } finally {
          if (!cancelled) {
            setLoadingMap((m) => ({ ...m, [customizeTaskId]: false }));
          }
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [serviceDetails, selectionMode, getCandidatesForService]);

  // Format thời gian
  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const date = new Date(timeString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return timeString;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-xl font-bold">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Thông tin dịch vụ đã đặt</h2>
        </div>
      </div>

      {serviceDetails.length > 0 && (
        <div>
          <ul className="divide-y divide-gray-200 mb-6">
            {serviceDetails.map((service, idx) => {

              const customizeTaskId = service.customizeTaskId;
              const candidates = candidatesByTask[customizeTaskId] || [];
              const isLoading = loadingMap[customizeTaskId];
              const selectedNurseId = selectedStaffByTask?.[customizeTaskId];
              const selectedNurse = candidates.find(n =>
                String(n.NursingID || n.nursingID) === String(selectedNurseId)
              );

              // Lấy relative đã chọn cho dịch vụ này
              const selectedRelativeId = selectedRelativeByTask[customizeTaskId];
              const selectedRelative = relatives.find(r => r.relativeID === selectedRelativeId);


              return (
                <li key={service.id || idx} className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-blue-700 text-lg">
                          {service.name}
                        </span>
                      </div>

                      {/* Thông tin thời gian */}
                      {(service.startTime || service.endTime) && (
                        <div className="text-sm text-gray-600 mb-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-600" />
                            <span>Bắt đầu: {formatTime(service.startTime)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-red-600" />
                            <span>Kết thúc: {formatTime(service.endTime)}</span>
                          </div>
                        </div>
                      )}

                      {service.quantity > 1 && (
                        <span className="text-sm text-gray-600">
                          Số lượng: {service.quantity}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-red-600 text-lg">
                        {service.total.toLocaleString()}đ
                      </span>
                      {service.quantity > 1 && (
                        <div className="text-xs text-gray-500">
                          {service.price.toLocaleString()}đ/đơn vị
                        </div>
                      )}
                    </div>
                  </div>

                  {customizeTaskId && (
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex justify-between items-center gap-2 flex-wrap">
                        <div className="text-sm text-gray-500">
                          {selectionMode === 'user'
                            ? (isLoading ? 'Đang tải...' : `${candidates.length} điều dưỡng có sẵn`)
                            : 'Phân công điều dưỡng: Hệ thống tự chọn'}
                        </div>
                        {selectionMode === 'user' && (
                          <button
                            className="bg-purple-600 text-white border-purple-600 border text-white px-4 py-2 rounded transition-colors hover:bg-purple-700"
                            onClick={() => setOpenTaskId(customizeTaskId)}
                          >
                            {selectedNurse
                              ? `Đã chọn: ${selectedNurse.Full_Name || selectedNurse.fullName || selectedNurse.FullName || selectedNurse.name || 'Điều dưỡng'}`
                              : 'Chọn điều dưỡng'}
                          </button>
                        )}
                        {!service.forMom && (
                          <button
                            className="bg-purple-600 text-white border-purple-600 border text-white px-4 py-2 rounded transition-colors hover:bg-purple-700"
                            onClick={() => setRelativeModalTaskId(customizeTaskId)}
                          >
                            {selectedRelative ? 'Đổi con' : 'Chọn con'}
                          </button>
                        )}
                      </div>
                      {selectedRelative && !service.forMom && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                          <strong>Con đã chọn:</strong> {selectedRelative.relativeName || selectedRelative.name}
                          {selectedRelative.dateOfBirth && (
                            <span className="ml-2">
                              ({new Date(selectedRelative.dateOfBirth).toLocaleDateString('vi-VN')})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Tổng tiền ở cuối */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-700">Tổng tiền:</span>
              <span className="text-2xl font-bold text-red-600">
                {bookingData?.total?.toLocaleString()}đ
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal chọn điều dưỡng */}
      {openTaskId && (() => {
        const service = serviceDetails.find(s => s.customizeTaskId === openTaskId);
        const candidates = candidatesByTask[openTaskId] || [];
        const isLoading = loadingMap[openTaskId];
        const selectedNurseId = selectedStaffByTask?.[openTaskId];

        if (!service) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-xl max-h-3xl relative">
              <h4 className="text-lg font-bold mb-4">Chọn điều dưỡng cho dịch vụ:
                <span className="text-blue-600">{service.name}</span></h4>
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setOpenTaskId(null)}
              >×</button>

              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {isLoading && (
                  <div className="text-center text-gray-500">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Đang tải danh sách điều dưỡng...
                  </div>
                )}

                {!isLoading && candidates.length === 0 && (
                  <div className="text-center text-gray-500 p-4">
                    <div className="text-lg font-semibold mb-2">Không có điều dưỡng phù hợp</div>
                  </div>
                )}

                {!isLoading && candidates.map((nurse) => {
                  const account = accounts?.find(acc => String(acc.accountID) === String(nurse.accountID));
                  const isSelected = String(nurse.NursingID || nurse.nursingID) === String(selectedNurseId);

                  return (
                    <div
                      key={nurse.NursingID || nurse.nursingID}
                      className={`border rounded-lg p-4 flex gap-4 items-center hover:bg-blue-50 transition cursor-pointer ${isSelected ? 'bg-blue-100 border-blue-300' : ''
                        }`}
                      onClick={async () => {
                        try {
                          const nurseId = nurse.NursingID || nurse.nursingID;
                          setSelectedStaffByTask?.((prev) => ({
                            ...prev,
                            [openTaskId]: nurseId
                          }));

                          if (onAssign) {
                            await onAssign(openTaskId, nurseId);
                          }

                          setOpenTaskId(null);
                        } catch (err) {
                          console.error('Error assigning nurse:', err);
                        }
                      }}
                    >
                      <img
                        src={account?.avatarUrl || 'https://via.placeholder.com/48'}
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-blue-700 text-lg">
                          {nurse.Full_Name || nurse.fullName || nurse.FullName || nurse.name || `Nurse #${nurse.NursingID || nurse.nursingID}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          Năm sinh: {nurse.birthYear || nurse.BirthYear || nurse.dateOfBirth?.slice(0, 4) || nurse.birth_year || (account?.dateOfBirth?.slice(0, 4)) || '---'}
                        </div>
                        <div className="text-sm text-gray-600">
                          SĐT: {account?.phoneNumber || nurse.phoneNumber || nurse.PhoneNumber || nurse.phone_number || '---'}
                        </div>
                        <div className="italic text-pink-600 text-sm">
                          {nurse.slogan || nurse.Slogan || 'Không có slogan'}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="text-green-600 text-2xl">✓</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal chọn con cho dịch vụ */}
      {relativeModalTaskId && (() => {
        const customizeTaskId = relativeModalTaskId;
        const selectedRelativeId = selectedRelativeByTask[customizeTaskId];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl relative">
              <h4 className="text-lg font-bold mb-4">Chọn con cho dịch vụ</h4>
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setRelativeModalTaskId(null)}
              >×</button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {relatives.map((relative) => {
                  const relativeId = relative.relativeID || relative.relativeid || relative.id;
                  const isSelected = String(selectedRelativeId) === String(relativeId);
                  return (
                    <div
                      key={relativeId}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                      onClick={async () => {
                        try {
                          await customizeTaskService.updateRelative(customizeTaskId, relativeId);
                          setSelectedRelativeByTask?.((prev) => ({ ...prev, [customizeTaskId]: relativeId }));
                          setRelativeModalTaskId(null);
                        } catch (e) {
                          console.error('Không thể cập nhật người thân:', e);
                        }
                      }}
                    >
                      <div className="font-medium text-gray-800">{relative.relativeName || relative.name || 'Người thân'}</div>
                      {relative.dateOfBirth && (
                        <div className="text-sm text-gray-600">{new Date(relative.dateOfBirth).toLocaleDateString('vi-VN')}</div>
                      )}
                      {isSelected && <div className="text-green-600 mt-1">✓ Đã chọn</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
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