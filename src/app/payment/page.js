"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useEffect, useState, useContext, Suspense } from "react";
import customizePackageService from '@/services/api/customizePackageService';
import serviceTypeService from '@/services/api/serviceTypeService';
import accountService from '@/services/api/accountService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import nursingSpecialistServiceTypeService from '@/services/api/nursingSpecialistServiceTypeService';
import bookingService from '@/services/api/bookingService';
import walletService from '@/services/api/walletService';
import transactionHistoryService from '@/services/api/transactionHistoryService';
import invoiceService from '@/services/api/invoiceService';
import { AuthContext } from "@/context/AuthContext";
import { useWalletContext } from "@/context/WalletContext";

// Thay thế import mock data bằng services
import serviceTaskService from '@/services/api/serviceTaskService';
import customizeTaskService from '@/services/api/customizeTaskService';
import careProfileService from '@/services/api/careProfileService';
import { calculateCompletePayment, formatCurrency } from '../booking/utils/paymentCalculation';
import {
  PaymentHeader,
  AppointmentInfo,
  PaymentInfo,
  PaymentSuccessModal,
  StaffSelection,
} from './components';
import workScheduleService from '@/services/api/workScheduleService';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState(null);
  const [accounts, setAccounts] = useState([]); // Thêm accounts state
  const [packages, setPackages] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [customizeTasks, setCustomizeTasks] = useState([]); // tasks of this booking
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);

  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useContext(AuthContext);
  const { wallet: contextWallet, refreshWalletData } = useWalletContext();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectionMode, setSelectionMode] = useState(null); // 'user' | 'auto'
  const [selectedStaffByTask, setSelectedStaffByTask] = useState({}); // { [customizeTaskId]: nursingId }
  const [canConfirm, setCanConfirm] = useState(true);
  const [assignError, setAssignError] = useState("");
  const [customizePackages, setCustomizePackages] = useState([]);

  // Load data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");


        let walletsData = [];
        try {
          walletsData = await walletService.getAllWallets();
        } catch (walletError) {
          console.error('Lỗi khi lấy ví:', walletError);
        }

        const [
          serviceTypesData,
          serviceTasksData,
          nursingSpecialistsData,
          accountsData
        ] = await Promise.all([
          serviceTypeService.getServiceTypes(),
          serviceTaskService.getServiceTasks(),
          nursingSpecialistService.getNursingSpecialists(),
          accountService.getAllAccounts()
        ]);

        setPackages([]); // Không cần packages trong payment page
        setServiceTypes(serviceTypesData);
        setServiceTasks(serviceTasksData);
        setNursingSpecialists(nursingSpecialistsData);
        setAccounts(Array.isArray(accountsData) ? accountsData : []);
        setCareProfiles([]); // Không cần care profiles từ API nữa
        setWallets(walletsData);

        console.log('Payment data loaded:', {
          serviceTypes: serviceTypesData.length,
          serviceTasks: serviceTasksData.length,
          nursingSpecialists: nursingSpecialistsData.length,
          wallets: walletsData.length
        });

        // Nếu có bookingId, fetch booking data với careProfile
        if (bookingId) {

          try {
            const bookingData = await bookingService.getBookingByIdWithCareProfile(parseInt(bookingId));

            // Nếu booking không có careProfile data, fetch riêng
            if (bookingData && !bookingData.careProfile && bookingData.careProfileID) {
              try {

                const careProfileData = await careProfileService.getCareProfileById(bookingData.careProfileID);
                // Gắn care profile vào booking data
                bookingData.careProfile = careProfileData;
              } catch (careProfileError) {
                console.warn('Could not fetch care profile:', careProfileError);
                // Không fail nếu không fetch được care profile
              }
            }

            setBooking(bookingData);
            // Load customize tasks for this booking for manual assignment flow
            try {
              const tasks = await customizeTaskService.getAllByBooking(parseInt(bookingId));
              // Normalize and keep minimal needed fields
              const mapped = Array.isArray(tasks) ? tasks.map(t => ({
                customizeTaskID: t.customizeTaskID || t.CustomizeTaskID || t.id,
                serviceID: t.serviceID || t.ServiceID || t.serviceTypeID,
                nursingID: t.nursingID || t.NursingID || null,
              })).filter(x => x.customizeTaskID && x.serviceID) : [];
              setCustomizeTasks(mapped);
              // Pre-fill selection state if server already assigned
              if (mapped.some(m => m.nursingID)) {
                setSelectedStaffByTask(prev => ({
                  ...prev,
                  ...mapped.reduce((acc, m) => {
                    if (m.nursingID) acc[m.customizeTaskID] = String(m.nursingID);
                    return acc;
                  }, {})
                }));
              }
            } catch (taskErr) {
              console.warn('Could not load customize tasks for booking', taskErr);
            }

            // Fetch danh sách dịch vụ đã đặt cho booking này
            try {
              const packagesData = await customizePackageService.getAllByBooking(bookingId);
              if (Array.isArray(packagesData)) {
                setCustomizePackages(packagesData);
              }
            } catch (packageErr) {
              console.error('Lỗi khi lấy danh sách dịch vụ đã đặt:', packageErr);
            }
          } catch (error) {
            console.error(' Error fetching booking:', {
              bookingId,
              error,
              errorMessage: error.message
            });
            setError(`Không thể tải thông tin đặt lịch (ID: ${bookingId}). ${error.message || 'Vui lòng thử lại sau.'}`);
          }
        } else {
          console.warn('No bookingId provided in URL parameters');
          setError('Không tìm thấy thông tin booking ID trong URL.');
        }
      } catch (error) {
        console.error('Error loading payment data:', {
          error,
          errorMessage: error.message,
          bookingId
        });
        setError(`Không thể tải dữ liệu trang thanh toán: ${error.message || 'Vui lòng thử lại sau.'}`);
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

    // Lấy thông tin từ customizePackageCreateDto (cho service booking)
    const customizePackageCreateDtos = booking.customizePackageCreateDtos || booking.customize_package_create_dtos || [];

    // Lấy thông tin từ customizePackageCreateDto (cho package booking)
    const customizePackageCreateDto = booking.customizePackageCreateDto || booking.customize_package_create_dto;

    // Populate servicesForCalculation for display purposes only
    // booking.amount already includes discounts, so we only need to apply extra fees
    let servicesForCalculation = [];

    if (customizePackageCreateDto) {
      // Package booking
      const serviceID = customizePackageCreateDto.serviceID || customizePackageCreateDto.service_ID;
      const quantity = customizePackageCreateDto.quantity || 1;

      selectedPackage = serviceTypes && serviceTypes.length > 0 ? serviceTypes.find(s =>
        s.serviceID === serviceID ||
        s.serviceTypeID === serviceID ||
        s.ServiceID === serviceID
      ) : null;

      if (selectedPackage) {
        servicesForCalculation = [selectedPackage];

        // Lấy dịch vụ con của package
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

      servicesForCalculation = selectedServices;
    }

    // Calculate payment: booking.amount already includes discounts, only apply extra fees
    const paymentCalculation = calculateCompletePayment(servicesForCalculation, amount, extra);
    total = paymentCalculation.finalTotal;

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
      bookingID,
      paymentCalculation
    };
  }, [booking, serviceTypes, serviceTasks, careProfiles]);

  // Build list of customizeTasks for this booking for user selection flow
  const bookingCustomizeTasks = useMemo(() => {
    if (Array.isArray(customizeTasks) && customizeTasks.length > 0) return customizeTasks;
    // Fallback: try from booking payload createDtos
    const dtos = booking?.customizePackageCreateDtos || [];
    return dtos
      .map(dto => ({
        customizeTaskID: dto.customizeTaskID || dto.customize_TaskID,
        serviceID: dto.serviceID || dto.service_ID,
      }))
      .filter(x => x.customizeTaskID && x.serviceID);
  }, [booking, customizeTasks]);

  // Compute canConfirm when user selection required
  useEffect(() => {
    if (selectionMode !== 'user') {
      setCanConfirm(true);
      return;
    }
    // derive task ids from loaded customize tasks
    const tasks = (bookingCustomizeTasks || [])
      .map(t => t.customizeTaskID)
      .filter(Boolean);
    // If not present, try from booking.customizeTasks if any
    const unique = Array.from(new Set(tasks));
    if (unique.length === 0) {
      setCanConfirm(false);
      return;
    }
    const allSelected = unique.every(tid => !!selectedStaffByTask[tid]);
    setCanConfirm(allSelected);
  }, [selectionMode, booking, selectedStaffByTask]);

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

  // Get candidate nurses per service using mapping + zone
  const getCandidatesForService = async (serviceId) => {
    try {
      // Prefer mapping API to fetch nurses that can do this service
      const mappings = await nursingSpecialistServiceTypeService.getByService(serviceId);
      const eligibleIds = Array.isArray(mappings) ? mappings.map(m => m.nursingID || m.NursingID).filter(Boolean) : [];
      const candidates = Array.isArray(nursingSpecialists) ? nursingSpecialists.filter(n => eligibleIds.includes(n.nursingID || n.NursingID)) : [];
      return candidates;
    } catch (e) {
      console.warn('Fallback to all specialists due to mapping error', e);
      return Array.isArray(nursingSpecialists) ? nursingSpecialists : [];
    }
  };

  // Persist user assignments immediately when changed
  const handleAssignNursing = async (customizeTaskID, nursingID) => {
    try {
      await customizeTaskService.updateNursing(customizeTaskID, nursingID);
    } catch (err) {
      console.warn('Không thể lưu gán điều dưỡng, sẽ thử lại khi thanh toán.', err);
    }
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

      // If user mode, ensure selected for all tasks
      if (selectionMode === 'user' && !canConfirm) {
        setError('Vui lòng chọn đủ điều dưỡng cho tất cả dịch vụ trước khi thanh toán.');
        return;
      }

      // 1.a Nếu người dùng chọn phân công, lưu gán điều dưỡng cho từng task trước khi tạo hóa đơn
      if (selectionMode === 'user') {
        const tasks = bookingCustomizeTasks || [];
        for (const t of tasks) {
          const tid = t.customizeTaskID;
          const nid = selectedStaffByTask[tid];
          if (!nid) continue; // canConfirm ensures all selected
          try { await customizeTaskService.updateNursing(tid, nid); } catch { }
        }
      }

      // 1.b Kiểm tra ví từ context trước
      let userWallet = contextWallet;

      // Nếu chưa có ví từ context, fallback sang wallets array
      if (!userWallet) {
        userWallet = wallets.find(w =>
          (w.accountID || w.AccountID) === (user.accountID || user.AccountID)
        );
      }

      if (!userWallet) {
        setError('Không tìm thấy ví của bạn. Vui lòng kiểm tra lại tài khoản.');
        return;
      }

      const walletAmount = userWallet.amount || userWallet.Amount || 0;

      // 2. Kiểm tra số dư
      if (walletAmount < bookingData.total) {
        setError(`Số dư ví không đủ để thanh toán. Cần: ${bookingData.total?.toLocaleString('vi-VN')}₫, Hiện có: ${walletAmount?.toLocaleString('vi-VN')}₫`);
        return;
      }

      // 3. Tạo invoice (nếu đã tồn tại và đã thanh toán, BE có thể trả lỗi "already paid")
      const bookingID = parseInt(booking.bookingID || booking.booking_ID);

      // Đảm bảo tính nhất quán: sử dụng số tiền cơ bản từ booking.amount, không phải số tiền đã bao gồm phí phát sinh
      const baseAmount = booking.amount || booking.totalAmount || booking.total_Amount || 0;
      const extraFee = booking.extra || 0;
      const finalTotal = bookingData.total; // Số tiền cuối cùng đã bao gồm phí phát sinh



      const invoiceData = {
        bookingID: bookingID,
        content: `Thanh toán booking #${bookingID}`,
        totalAmount: baseAmount, // Lưu số tiền cơ bản (không bao gồm phí phát sinh)
        amount: baseAmount, // Alternative field name if backend expects 'amount'
        total_amount: baseAmount, // Another common field name
        price: baseAmount, // Some systems use 'price'
        value: baseAmount, // Some systems use 'value'
        extra: extraFee, // Lưu phí phát sinh riêng biệt
        finalTotal: finalTotal // Lưu tổng số tiền cuối cùng
      };



      let invoiceResponse;
      try {
        invoiceResponse = await invoiceService.createInvoice(invoiceData);
        console.log('Invoice created successfully:', invoiceResponse);
      } catch (createErr) {
        const msg = createErr?.message || '';
        if (/already paid/i.test(msg)) {
          try {
            const existingInvoice = await invoiceService.getInvoiceByBooking(bookingID);
            if (existingInvoice?.invoiceID) {
              await handlePaymentSuccess(existingInvoice.invoiceID);
              return;
            }
          } catch (getErr) {
            // fallthrough to show error below
          }
        }
        throw createErr;
      }

      // 4. Lấy invoiceId từ response
      let invoiceId;

      if (invoiceResponse && typeof invoiceResponse === 'object') {
        if (invoiceResponse.message === 'Invoice paid successfully.') {
          // Invoice đã được thanh toán - lấy existing invoice
          try {
            const existingInvoice = await invoiceService.getInvoiceByBooking(bookingID);
            if (existingInvoice && existingInvoice.invoiceID) {
              console.log('Invoice already paid, using existing invoiceID:', existingInvoice.invoiceID);
              await handlePaymentSuccess(existingInvoice.invoiceID);
              return; // Exit early vì đã thành công
            }
          } catch (getError) {
            console.error(' Error getting invoice:', getError);
          }

          // Fallback: coi như thành công với bookingID
          await handlePaymentSuccess(bookingID);
          return;
        } else {
          // Invoice mới được tạo - lấy invoiceID
          invoiceId = invoiceResponse.invoiceID || invoiceResponse.InvoiceID;
          if (!invoiceId) {
            console.error(' No invoiceID in response:', invoiceResponse);
            throw new Error('Không thể tạo invoice - không có ID trả về');
          }


        }
      } else {
        console.error(' Invalid invoice response:', invoiceResponse);
        throw new Error('Phản hồi từ server không hợp lệ khi tạo invoice');
      }



      // 5. Gọi API InvoicePayment với invoiceId hợp lệ (service trực tiếp)
      try {
        await transactionHistoryService.invoicePayment(invoiceId);
        // 6. Success handling
        await handlePaymentSuccess(invoiceId);
      } catch (payErr) {
        // Nếu BE trả lỗi “đã thanh toán” -> coi như thành công
        const msg = payErr?.message || '';
        if (/already paid/i.test(msg)) {
          await handlePaymentSuccess(invoiceId);
        } else {
          throw payErr;
        }
      }

    } catch (error) {
      console.error(' Payment error:', error);

      let errorMessage = 'Có lỗi xảy ra khi thanh toán';
      if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Helper function xử lý thành công
  const handlePaymentSuccess = async (invoiceId) => {
    console.log('Payment successful for invoice:', invoiceId);

    // Refresh wallet data thông qua WalletContext - điều này sẽ update tất cả components
    try {
      await refreshWalletData();
      console.log('Wallet data refreshed via context');
    } catch (refreshError) {
      console.warn('Could not refresh wallet via context:', refreshError);
    }

    // Show success modal
    setLastInvoiceId(invoiceId);
    setShowSuccessModal(true);

    // Auto redirect
    setTimeout(() => {
      router.push('/appointments');
    }, 3000);
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
            <div className="text-red-500 text-6xl mb-4"></div>
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
            {/* Tổng tiền */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-xl font-bold">₫</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Thông tin dịch vụ</h2>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-700">Tổng tiền:</span>
                <span className="text-2xl font-bold text-pink-600">{bookingData?.total?.toLocaleString()}đ</span>
              </div>
              {customizePackages.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Dịch vụ đã đặt</h3>
                  <ul className="divide-y divide-gray-200">
                    {customizePackages.map((pkg, idx) => {
                      const serviceType = serviceTypes.find(s => s.serviceID === pkg.serviceID);

                      // Tìm các task con
                      const childTasks = serviceTasks.filter(t =>
                        t.package_ServiceID === serviceType?.serviceID ||
                        t.packageServiceID === serviceType?.serviceID ||
                        t.Package_ServiceID === serviceType?.serviceID
                      );

                      // Tìm dịch vụ con
                      const childServices = childTasks
                        .map(t => {
                          const childServiceId = t.child_ServiceID || t.childServiceID || t.Child_ServiceID;
                          return serviceTypes.find(s =>
                            s.serviceID === childServiceId ||
                            s.serviceTypeID === childServiceId ||
                            s.ServiceID === childServiceId
                          );
                        })
                        .filter(Boolean);

                      const isPackage = childServices.length > 0;

                      return (
                        <li
                          key={pkg.packageID || pkg.id || idx}
                          className="py-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3"
                        >
                          <div className="flex-1">
                            {/* Tên dịch vụ cha */}
                            <span className="font-semibold text-blue-700">
                              {serviceType?.serviceName || pkg.name}
                            </span>

                            {/* Chỉ hiện danh sách dịch vụ con nếu là gói */}
                            {isPackage && (
                              <div className="mt-2 ml-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                                  Các dịch vụ trong gói:
                                </h4>
                                <ul className="list-disc ml-5 space-y-1">
                                  {childServices.map((child, cidx) => (
                                    <li key={child.serviceID || child.serviceTypeID || cidx}>
                                      <span className="text-blue-600 font-medium">{child?.serviceName}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Thông tin lịch hẹn và người được chăm sóc */}
            <AppointmentInfo
              datetime={bookingData?.datetime}
              note={bookingData?.note}
              selectedCareProfile={bookingData?.selectedCareProfile}
              selectedStaff={bookingData?.selectedStaff}
              getStaffInfo={getStaffInfo}
            />
            {selectionMode === 'user' && (
              <StaffSelection
                accounts={accounts}
                tasks={bookingCustomizeTasks}
                serviceTypes={serviceTypes}
                careProfile={booking?.careProfile}
                nursingSpecialists={nursingSpecialists}
                selectedStaffByTask={selectedStaffByTask}
                setSelectedStaffByTask={async (updater) => {
                  setAssignError("");
                  setSelectedStaffByTask(async prev => {
                    const next = typeof updater === 'function' ? await updater(prev) : updater;
                    // Detect last changed key
                    const changedKey = Object.keys(next).find(k => prev[k] !== next[k]);
                    if (changedKey) {
                      const nid = next[changedKey];
                      if (nid) {
                        // Kiểm tra trùng lịch
                        try {
                          const nurseSchedules = await workScheduleService.getAllByNursing(nid);
                          // Giả sử bookingData.datetime là thời gian cần kiểm tra
                          const conflict = nurseSchedules.some(sch => sch.workDate === bookingData?.datetime);
                          if (conflict) {
                            setAssignError("Nhân viên này đã có lịch vào thời điểm này!");
                            return prev; // Không cập nhật nếu trùng lịch
                          }
                        } catch (err) {
                          setAssignError("Không kiểm tra được lịch của nhân viên!");
                          return prev;
                        }
                      }
                    }
                    return next;
                  });
                }}
                getCandidatesForService={getCandidatesForService}
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
              myWallet={(() => {
                // Ưu tiên contextWallet từ WalletContext
                if (contextWallet && (contextWallet.status === "active" || contextWallet.Status === "active")) {
                  return contextWallet;
                }

                // Fallback sang wallets array nếu contextWallet không có
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
              paymentBreakdown={bookingData?.paymentCalculation}
              selectionMode={selectionMode}
              setSelectionMode={setSelectionMode}
              canConfirm={canConfirm}
            />

          </div>
        </div>

        <PaymentSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            router.push('/bookings');
          }}
          invoiceId={lastInvoiceId}
          amount={bookingData?.total}
          onGoToBookings={() => {
            setShowSuccessModal(false);
            router.push('/bookings');
          }}
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