import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaCreditCard, FaCalendarAlt, FaStickyNote, FaUser, FaPhone,
  FaMapMarkerAlt, FaBirthdayCake, FaWallet, FaCheckCircle, FaHistory, FaHome, FaTimes
} from 'react-icons/fa';
import { HiOutlineUserGroup, HiOutlineCheck } from 'react-icons/hi2';
import customizeTaskService from '@/services/api/customizeTaskService';

// PaymentHeader Component
export function PaymentHeader() {
  return (
    <div className="text-center mb-8">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center shadow-lg mx-auto mb-4">
        <FaCreditCard className="text-white text-3xl" />
      </div>
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        Thanh toán dịch vụ
      </h1>
      <p className="text-gray-600 mt-2">Xác nhận thông tin và hoàn tất thanh toán</p>
    </div>
  );
}

// Helper component for AppointmentInfo
function InfoItem({ icon, label, value, full }) {
  return (
    <div className={`flex items-start gap-2 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-blue-500 mt-1">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{label}:</p>
        <p className="font-medium text-gray-800">{value || 'Chưa có thông tin'}</p>
      </div>
    </div>
  );
}

// AppointmentInfo Component
export function AppointmentInfo({
  datetime,
  note,
  selectedCareProfile
}) {
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Chưa có thông tin';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return 'Chưa có thông tin';
    }
  };

  const formattedDateTime = formatDateTime(datetime);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
      {/* Tiêu đề */}
      <h4 className="text-lg font-bold text-gray-800 border-b pb-2">
        Thông tin lịch hẹn
      </h4>

      {/* Thời gian */}
      <div className="flex items-center gap-3 text-gray-700">
        <FaCalendarAlt className="text-blue-600 text-lg" />
        <div>
          <p className="text-sm text-gray-500">Thời gian</p>
          <p className="font-medium">{formattedDateTime}</p>
        </div>
      </div>

      {/* Thông tin người được chăm sóc */}
      {selectedCareProfile && (
        <div className="bg-blue-50 rounded-xl p-2 space-y-1">
          <div className="flex items-center gap-2">
            <FaUser className="text-blue-600" />
            <h5 className="font-semibold text-gray-800">
              Người được chăm sóc
            </h5>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
            <InfoItem icon={<FaUser />} label="Tên" value={selectedCareProfile.profileName} />
            {selectedCareProfile.dateOfBirth && (
              <InfoItem icon={<FaBirthdayCake />} label="Ngày sinh" value={new Date(selectedCareProfile.dateOfBirth).toLocaleDateString('vi-VN')} />
            )}
            {selectedCareProfile.phoneNumber && (
              <InfoItem icon={<FaPhone />} label="Số điện thoại" value={selectedCareProfile.phoneNumber} />
            )}
            <InfoItem
              icon={<FaUser />}
              label="Trạng thái"
              value={selectedCareProfile.status?.toLowerCase() === 'active' ? 'Hoạt động' : 'Không hoạt động'}
            />
            {selectedCareProfile.address && (
              <InfoItem icon={<FaMapMarkerAlt />} label="Địa chỉ" value={selectedCareProfile.address} full />
            )}
            {selectedCareProfile.note && (
              <InfoItem icon={<FaStickyNote />} label="Ghi chú" value={selectedCareProfile.note} full />
            )}
          </div>
        </div>
      )}

      {/* Ghi chú phí phát sinh */}
      {note && (
        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl">
          <FaStickyNote className="text-yellow-600 mt-1" />
          <div>
            <p className="text-sm text-gray-600">Ghi chú</p>
            <p className="font-semibold text-gray-800">Phí phát sinh: {note}%</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Payment Breakdown Component for PaymentInfo
const PaymentBreakdown = ({ paymentBreakdown, total, selectedHoliday }) => {
  if (!paymentBreakdown) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-6">
      <h4 className="font-semibold text-gray-700 mb-3">Chi tiết thanh toán</h4>
      <div className="space-y-2 text-sm">
        {paymentBreakdown.subtotal > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tổng tiền gốc:</span>
            <span className="text-gray-700">{paymentBreakdown.subtotal.toLocaleString()}đ</span>
          </div>
        )}
        {paymentBreakdown.totalDiscount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Giảm giá:</span>
            <span className="text-green-600 font-medium">-{paymentBreakdown.totalDiscount.toLocaleString()}đ</span>
          </div>
        )}
        {paymentBreakdown.totalDiscount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Sau giảm giá:</span>
            <span className="text-gray-700 font-medium">{paymentBreakdown.discountedAmount.toLocaleString()}đ</span>
          </div>
        )}
        {paymentBreakdown.extra && paymentBreakdown.extra > 0 && (
          <div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phí phát sinh ({paymentBreakdown.extra * 1}%):</span>
              <span className="text-orange-600 font-medium">+{paymentBreakdown.extraAmount.toLocaleString()}đ</span>
            </div>
            {selectedHoliday && (
              <div className="mt-1 text-sm text-yellow-700">Ngày lễ: {selectedHoliday.holidayName || selectedHoliday.holidayName || selectedHoliday.name || selectedHoliday.Name || selectedHoliday.title || selectedHoliday.Title}</div>
            )}
          </div>
        )}
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-semibold">Tổng cộng:</span>
            <span className="text-gray-800 font-bold">{total.toLocaleString()}đ</span>
          </div>
        </div>
      </div>
      
      {/* Thông tin giải thích về phí phát sinh */}
      {paymentBreakdown.extra && paymentBreakdown.extra > 0 && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-blue-800 text-xs">
            <strong>Lưu ý:</strong> Phí phát sinh {paymentBreakdown.extra * 1}% được áp dụng cho ngày lễ hoặc dịch vụ đặc biệt. 
            Số tiền này sẽ được tính thêm vào hóa đơn khi thanh toán.
          </div>
        </div>
      )}
    </div>
  );
};

// Wallet Info Component for PaymentInfo
const WalletInfo = ({ myWallet, total }) => {
  if (!myWallet) return null;

  const walletAmount = myWallet.amount || myWallet.Amount || 0;
  const isInsufficient = walletAmount < total;

  return (
    <div className="bg-blue-50 rounded-xl p-4 mb-6">
      <h4 className="font-semibold text-gray-700 mb-3">Thông tin ví</h4>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số dư hiện tại:</span>
          <span className={`font-bold ${isInsufficient ? "text-red-500" : "text-green-600"}`}>
            {walletAmount.toLocaleString()}đ
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số tiền cần trừ:</span>
          <span className="font-bold text-pink-600">{total.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số dư sau thanh toán:</span>
          <span className={`font-bold ${isInsufficient ? "text-red-500" : "text-green-600"}`}>
            {(walletAmount - total).toLocaleString()}đ
          </span>
        </div>
      </div>
      {isInsufficient && (
        <div className="mt-3 p-3 bg-red-100 rounded-lg">
          <div className="text-red-700 text-sm font-semibold">
            Số dư ví không đủ để thanh toán!
          </div>
          <div className="text-red-600 text-xs mt-1">
            Vui lòng nạp thêm {(total - walletAmount).toLocaleString()}đ
          </div>
        </div>
      )}
    </div>
  );
};

// Error Display Component for PaymentInfo
const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
      <div className="text-red-700 font-semibold text-center mb-2">{error}</div>
      {error.includes('Hóa đơn đã được tạo') && (
        <div className="text-green-700 text-sm text-center">
          Hóa đơn đã được tạo thành công. Bạn có thể thanh toán sau khi nạp thêm tiền.
        </div>
      )}
    </div>
  );
};

// Payment Button Component for PaymentInfo
const PaymentButton = ({ 
  total, 
  myWallet, 
  loading, 
  isProcessingPayment, 
  canConfirm, 
  handleConfirm, 
  onCancel, 
  isCancelling 
}) => {
  const walletAmount = myWallet?.amount || myWallet?.Amount || 0;
  const isSufficient = walletAmount >= total;
  const canProceed = isSufficient && canConfirm;
  const isDisabled = loading || isProcessingPayment || !canConfirm;

  const handlePrimaryClick = () => {
    if (isDisabled) return;
    if (!isSufficient) {
      if (typeof window !== 'undefined') {
        window.location.href = '/wallet';
      }
      return;
    }
    if (handleConfirm) handleConfirm();
  };

  return (
    <div className="space-y-3">
      <button
        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 ${
          canProceed
            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-105 hover:shadow-xl"
            : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 hover:shadow-xl"
        }`}
        onClick={handlePrimaryClick}
        disabled={isDisabled}
      >
        {loading || isProcessingPayment ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Đang xử lý...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <FaWallet />
            {isSufficient 
              ? "Xác nhận thanh toán bằng ví" 
              : "Tạo hóa đơn và chờ thanh toán"
            }
          </div>
        )}
      </button>

      {/* Cancel Button */}
      <button
        className={`w-full py-3 rounded-xl font-bold text-lg border-2 ${onCancel ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'} transition-all duration-200`}
        onClick={onCancel ? onCancel : () => window.history.back()}
        disabled={isProcessingPayment || isCancelling}
      >
        {isCancelling ? 'Đang hủy...' : 'Hủy'}
      </button>
    </div>
  );
};

// PaymentInfo Component
export function PaymentInfo({ 
  total, 
  myWallet, 
  error, 
  loading, 
  handleConfirm,
  isProcessingPayment,
  paymentBreakdown,
  canConfirm,
  onCancel,
  isCancelling,
  selectedHoliday
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <FaWallet className="text-green-600 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Thông tin thanh toán</h2>
      </div>

      {/* Payment Breakdown */}
  <PaymentBreakdown paymentBreakdown={paymentBreakdown} total={total} selectedHoliday={selectedHoliday} />

      {/* Total Amount */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">Tổng tiền cần thanh toán</div>
          <div className="text-4xl font-bold text-pink-600">{total.toLocaleString()}đ</div>
        </div>
      </div>

      {/* Wallet Information */}
      <WalletInfo myWallet={myWallet} total={total} />

      {/* Error Display */}
      <ErrorDisplay error={error} />

      {/* Payment Button */}
      <PaymentButton
        total={total}
        myWallet={myWallet}
        loading={loading}
        isProcessingPayment={isProcessingPayment}
        canConfirm={canConfirm}
        handleConfirm={handleConfirm}
        onCancel={onCancel}
        isCancelling={isCancelling}
      />

      {/* Security Info */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span>Giao dịch được bảo mật</span>
        </div>
      </div>
    </div>
  );
}

// PaymentSuccessModal Component
export function PaymentSuccessModal({ isOpen, onClose, invoiceId, amount }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>
          
          {/* Success Message */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Thanh toán thành công!
          </h3>
          <p className="text-gray-600 mb-6">
            Hóa đơn #{invoiceId} đã được thanh toán thành công.
            <br />
            Số tiền: {amount?.toLocaleString('vi-VN')}₫
          </p>
          
          {/* Countdown */}
          <p className="text-sm text-gray-500 mb-6">
            Bạn sẽ được chuyển về trang booking sau 3 giây...
          </p>
          
          {/* Action Button */}
          <button
            onClick={() => {
              onClose();
              router.push('/appointments'); // Redirect to appointments page
            }}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Đi đến trang lịch hẹn ngay
          </button>
        </div>
      </div>
    </div>
  );
}

// StaffSelection Component
export function StaffSelection({
  tasks = [],
  serviceTypes = [],
  careProfile,
  nursingSpecialists = [],
  selectedStaffByTask,
  setSelectedStaffByTask,
  getCandidatesForService,
  onAssign,
  accounts = [],
  assignError = "",
  setAssignError = () => {}
}) {
  const [loadingMap, setLoadingMap] = useState({});
  const [candidatesByTask, setCandidatesByTask] = useState({});
  const [openTaskId, setOpenTaskId] = useState(null);

  const taskRows = useMemo(() => {
    return tasks.map((t) => {
      const customizeTaskId = t.customizeTaskID || t.customize_TaskID;
      const serviceId = t.serviceID || t.service_ID || t.Service_ID;
      const st = serviceTypes.find(s => (s.serviceID === serviceId || s.serviceTypeID === serviceId || s.ServiceID === serviceId));
      
      return {
        customizeTaskId: customizeTaskId,
        serviceId: serviceId,
        serviceName: st?.serviceName || st?.ServiceName || `Dịch vụ #${serviceId}`,
      };
    });
  }, [tasks, serviceTypes]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      for (const row of taskRows) {
        const customizeTaskId = row.customizeTaskId;
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
  }, [taskRows, getCandidatesForService]);

  if (!Array.isArray(taskRows) || taskRows.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Chọn chuyên viên cho từng dịch vụ</h3>
      
      {/* Hiển thị thông báo lỗi nếu có */}
      {assignError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <div className="text-red-700 font-semibold">{assignError}</div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Dịch vụ</th>
              <th className="px-4 py-2 text-left">Chọn chuyên viên</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {taskRows.map((row) => {
              const candidates = candidatesByTask[row.customizeTaskId] || [];
              const isLoading = loadingMap[row.customizeTaskId];
              const selectedNurseId = selectedStaffByTask?.[row.customizeTaskId];
              const selectedNurse = candidates.find(n => 
                String(n.NursingID || n.nursingID) === String(selectedNurseId)
              );
                            
              return (
                <tr key={row.customizeTaskId}>
                  <td className="px-4 py-2 font-medium text-gray-800">{row.serviceName}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-purple-600 text-white border-purple-600 border text-white px-4 py-2 rounded transition-colors"
                      onClick={() => setOpenTaskId(row.customizeTaskId)}
                    >
                      {selectedNurse
                        ? `Đã chọn: ${selectedNurse.Full_Name || selectedNurse.fullName || selectedNurse.FullName || selectedNurse.name || 'Điều dưỡng'}`
                        : 'Chọn chuyên viên'}
                    </button>
                    
                    {/* Debug info */}
                    <div className="text-xs text-gray-500 mt-1">
                      {isLoading ? 'Đang tải...' : `${candidates.length} chuyên viên có sẵn`}
                    </div>

                    {/* Popup/modal chọn chuyên viên */}
                    {openTaskId === row.customizeTaskId && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-xl max-h-3xl relative">
                          <h4 className="text-lg font-bold mb-4">Chọn chuyên viên cho dịch vụ:
                            <span className="text-blue-600">{row.serviceName}</span></h4>
                          <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setOpenTaskId(null)}
                          >
                            <FaTimes size={16} />
                          </button>
                          
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
                                  className={`border rounded-lg p-4 flex gap-4 items-center hover:bg-blue-50 transition cursor-pointer ${
                                    isSelected ? 'bg-blue-100 border-blue-300' : ''
                                  }`}
                                  onClick={async () => {
                                    setAssignError("");
                                    try {
                                      const nurseId = nurse.NursingID || nurse.nursingID;                                      
                                      setSelectedStaffByTask?.((prev) => ({ 
                                        ...prev, 
                                        [row.customizeTaskId]: nurseId 
                                      }));
                                      
                                      if (onAssign) {
                                        await onAssign(row.customizeTaskId, nurseId);
                                      }
                                      
                                      setOpenTaskId(null);
                                    } catch (err) {
                                      console.error('Error assigning nurse:', err);
                                      setAssignError(err?.message || "Không thể gán điều dưỡng. Vui lòng thử lại.");
                                    }
                                  }}
                                >
                                  <img
                                    src={account?.avatarUrl || '/images/logo.png'}
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
                                    <FaCheckCircle className="text-green-600" size={20} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          
                          {assignError && (
                            <div className="text-red-500 text-center mt-2 font-semibold">{assignError}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// RelativeSelection Component (currently commented out in original)
export function RelativeSelection({
  customizeTasks = [],
  relatives = [],
  selectedRelativeByTask = {},
  setSelectedRelativeByTask = () => { },
  bookingId,
  serviceTypes = [],
  serviceTasks = []
}) {
  // Note: This component is currently commented out in the original file
  // Returning null to maintain the same behavior
  return null;
}

// Default exports for backward compatibility
export default {
  PaymentHeader,
  AppointmentInfo,
  PaymentInfo,
  PaymentSuccessModal,
  StaffSelection,
  RelativeSelection
};