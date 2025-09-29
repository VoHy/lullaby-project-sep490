'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye, faEdit, faTrash, faSearch, faCalendarAlt,
  faMoneyBill, faUser, faClock, faCheckCircle, faTimesCircle, faExclamationTriangle, faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import careProfileService from '@/services/api/careProfileService';
import accountService from '@/services/api/accountService';
import serviceTypeService from '@/services/api/serviceTypeService';
import notificationService from '@/services/api/notificationService'; // Import notificationService
import bookingService from '@/services/api/bookingService';
import customizePackageService from '@/services/api/customizePackageService';
import customizeTaskService from '@/services/api/customizeTaskService';
import serviceTaskService from '@/services/api/serviceTaskService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import workScheduleService from '@/services/api/workScheduleService';

import invoiceService from '@/services/api/invoiceService';

const BookingsTab = ({ bookings }) => {
  // State cho API data
  const [careProfiles, setCareProfiles] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [customizePackages, setCustomizePackages] = useState([]);
  const [customizeTasks, setCustomizeTasks] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // UI states (must be declared before any conditional returns to keep hook order stable)
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');


  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Số booking mỗi trang

  const statusLabels = {
    completed: 'Hoàn thành',
    pending: 'Đang chờ',
    cancelled: 'Đã hủy',
    waiting: 'Đang chờ',
    isscheduled: 'Đã lên lịch',
    isScheduled: 'Đã lên lịch'
  };
  const statusClasses = {
    completed: 'bg-green-100 text-green-700',
    isscheduled: 'bg-blue-100 text-blue-700',
    isScheduled: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const nurseRoleLabels = {
    nurse: 'Chuyên viên chăm sóc',
    specialist: 'Chuyên viên tư vấn',
    Nurse: 'Chuyên viên chăm sóc',
    Specialist: 'Chuyên viên tư vấn'
  };
  // Load data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          careProfilesData,
          accountsData,
          serviceTypesData,
          customizePackagesData,
          customizeTasksData,
          serviceTasksData,
          nursingSpecialistsData,
          invoicesData
        ] = await Promise.all([
          careProfileService.getCareProfiles(),
          accountService.getAllAccounts(),
          serviceTypeService.getServiceTypes(),
          customizePackageService.getAllCustomizePackages(),
          customizeTaskService.getAllCustomizeTasks(),
          serviceTaskService.getServiceTasks(),
          nursingSpecialistService.getNursingSpecialists(),
          invoiceService.getAllInvoices()
        ]);

        setCareProfiles(careProfilesData);
        setAccounts(accountsData);
        setServiceTypes(serviceTypesData);
        setCustomizePackages(customizePackagesData);
        setCustomizeTasks(customizeTasksData);
        setServiceTasks(serviceTasksData);
        setNursingSpecialists(nursingSpecialistsData);
        setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
      } catch (error) {
        console.error('Error fetching admin bookings data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function getBookingDetail(booking) {
    // Normalize commonly used fields to handle different casing from APIs
    const bookingID = booking?.bookingID ?? booking?.BookingID;
    const careProfileID = booking?.careProfileID ?? booking?.CareProfileID;
    const serviceID = booking?.serviceID ?? booking?.ServiceID;
    const customizePackageID = booking?.customizePackageID ?? booking?.CustomizePackageID;
    const invoiceID = booking?.invoiceID ?? booking?.InvoiceID;

    // Resolve related entities using normalized IDs (support various casings on related data too)
    const careProfile = careProfiles.find(
      (c) => (c?.careProfileID ?? c?.CareProfileID) === careProfileID
    );
    const account = careProfile
      ? accounts.find((a) => (a?.accountID ?? a?.AccountID) === (careProfile?.accountID ?? careProfile?.AccountID))
      : null;

    // All packages of this booking
    const packagesOfBooking = customizePackages.filter(
      (p) => (p?.bookingID ?? p?.BookingID) === bookingID
    );
    let service = null;
    let packageInfo = null;
    if (customizePackageID) {
      packageInfo = packagesOfBooking.find(
        (p) => (p?.customizePackageID ?? p?.CustomizePackageID) === customizePackageID
      );
      const pkgServiceID = packageInfo?.serviceID ?? packageInfo?.ServiceID;
      service = serviceTypes.find((s) => (s?.serviceID ?? s?.ServiceID) === pkgServiceID);
    } else if (serviceID) {
      service = serviceTypes.find((s) => (s?.serviceID ?? s?.ServiceID) === serviceID);
    }

    const customizeTasksOfBooking = customizeTasks.filter(
      (t) => (t?.bookingID ?? t?.BookingID) === bookingID
    );

    const serviceTasksOfBooking = customizeTasksOfBooking.map((task) => {
      const serviceTask = serviceTasks.find(
        (st) => (st?.serviceTaskID ?? st?.ServiceTaskID) === (task?.serviceTaskID ?? task?.ServiceTaskID)
      );
      const nurse = nursingSpecialists.find(
        (n) => (n?.nursingID ?? n?.NursingID) === (task?.nursingID ?? task?.NursingID)
      );
      const taskServiceID = task?.serviceID ?? task?.ServiceID;
      const taskService = serviceTypes.find((s) => (s?.serviceID ?? s?.ServiceID) === taskServiceID);
      return {
        customizeTaskID: task?.customizeTaskID ?? task?.CustomizeTaskID,
        customizePackageID: task?.customizePackageID ?? task?.CustomizePackageID,
        bookingID,
        description: serviceTask?.description ?? serviceTask?.Description ?? (taskService?.serviceName ?? taskService?.ServiceName ?? 'Dịch vụ'),
        price: task?.price ?? task?.Price,
        quantity: task?.quantity ?? task?.Quantity,
        total: task?.total ?? task?.Total,
        status: (task?.status ?? task?.Status ?? '').toLowerCase(),
        nursingID: task?.nursingID ?? task?.NursingID,
        nurseName: nurse?.fullName ?? nurse?.FullName,
        nurseRole: nurse?.major ?? nurse?.Major,
        serviceID: taskServiceID,
        serviceName: taskService?.serviceName ?? taskService?.ServiceName
      };
    });
    return { careProfile, account, service, packageInfo, serviceTasksOfBooking, packagesOfBooking, invoiceID };
  }



  const BookingDetailModal = ({ booking, onClose }) => {
    if (!booking) return null;
    const { careProfile, account, service, packageInfo, serviceTasksOfBooking, packagesOfBooking, invoiceID } = getBookingDetail(booking);
    const bookingStatus = String(booking?.status ?? booking?.Status ?? '').toLowerCase();
    const isCancelled = bookingStatus === 'cancelled' || bookingStatus === 'canceled';

    // Local caches to avoid re-rendering entire tab and repeated fetches
    const [localNursesByTaskId, setLocalNursesByTaskId] = useState({});
    const [localInvoice, setLocalInvoice] = useState(null);
    const [selectedNurseByTask, setSelectedNurseByTask] = useState({});
    const [detailCustomizeTasks, setDetailCustomizeTasks] = useState([]); // Dữ liệu từ API GetAllByBooking

    // Kiểm tra trùng giờ khi chọn nurse
    const handleNurseSelection = (taskId, nurseId) => {
      if (isCancelled) {
        alert('Không thể chọn nhân sự cho lịch đã hủy.');
        return false;
      }
      // Kiểm tra trùng giờ với các task khác trong cùng booking trước khi assign
      const currentTaskDetail = detailCustomizeTasks.find(t => t.customizeTaskID === taskId);
      if (currentTaskDetail && currentTaskDetail.startTime && currentTaskDetail.endTime) {
        const currentStart = new Date(currentTaskDetail.startTime);
        const currentEnd = new Date(currentTaskDetail.endTime);
        
        // Kiểm tra với các task khác
        const conflicts = [];
        serviceTasksOfBooking.forEach(task => {
          if (task.customizeTaskID === taskId) return; // Bỏ qua task hiện tại
          
          let taskNursingId = null;
          // Task đã có nurse
          if (task.nursingID) {
            taskNursingId = task.nursingID;
          }
          // Task đã được chọn nurse trong session này
          else if (selectedNurseByTask[task.customizeTaskID]) {
            taskNursingId = selectedNurseByTask[task.customizeTaskID];
          }
          
          // Nếu cùng nurse và có thời gian
          if (taskNursingId == nurseId) {
            const otherTaskDetail = detailCustomizeTasks.find(t => t.customizeTaskID === task.customizeTaskID);
            if (otherTaskDetail && otherTaskDetail.startTime && otherTaskDetail.endTime) {
              const taskStart = new Date(otherTaskDetail.startTime);
              const taskEnd = new Date(otherTaskDetail.endTime);
              
              // Kiểm tra trùng giờ
              if (currentStart < taskEnd && currentEnd > taskStart) {
                const formatTime = (date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                conflicts.push(
                  `Trùng giờ với: ${task.description}\n` +
                  `  • Giờ hiện tại: ${formatTime(currentStart)} - ${formatTime(currentEnd)}\n` +
                  `  • Giờ đã có: ${formatTime(taskStart)} - ${formatTime(taskEnd)}`
                );
              }
            }
          }
        });
        
        if (conflicts.length > 0) {
          alert(`Không thể chọn nhân sự này do trùng giờ trong cùng lịch hẹn:\n\n${conflicts.join('\n\n')}\n\nVui lòng chọn nhân sự khác!`);
          return false;
        }
      }
      
      // Nếu không có conflict, cập nhật selection
      setSelectedNurseByTask((prev) => ({ ...prev, [taskId]: Number(nurseId) }));
      return true;
    };

    // Assign nurse to a task function
    const handleAssignAllNurses = async () => {
      if (isCancelled) {
        alert('Không thể phân công nhân sự cho lịch đã hủy.');
        return;
      }
      try {
        // Kiểm tra xem tất cả task đã có nhân sự chưa (bao gồm cả nhân sự đã có và mới chọn)
        const unassignedTasks = serviceTasksOfBooking.filter(task => {
          const hasExistingNurse = !!task.nursingID;
          const hasNewAssignment = selectedNurseByTask[task.customizeTaskID];
          return !hasExistingNurse && !hasNewAssignment;
        });

        if (unassignedTasks.length > 0) {
          const unassignedList = unassignedTasks.map(task => {
            const taskDetail = detailCustomizeTasks.find(t => t.customizeTaskID === task.customizeTaskID);
            const timeInfo = taskDetail && taskDetail.startTime && taskDetail.endTime 
              ? ` (${new Date(taskDetail.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(taskDetail.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})`
              : '';
            return `- ${task.description}${timeInfo}`;
          }).join('\n');

          alert(`Vui lòng chọn nhân sự cho TẤT CẢ các nhiệm vụ sau:\n${unassignedList}\n\nKhông thể cập nhật khi còn nhiệm vụ chưa có nhân sự!`);
          return;
        }

        // Kiểm tra trùng giờ trong cùng booking cho tất cả các assignment
        const allAssignments = Object.entries(selectedNurseByTask);
        const timeConflictsInBooking = [];
        const nurseTaskMap = new Map(); // { nursingId: [tasks] }

        // Thu thập tất cả task của từng nurse (bao gồm đã có và mới chọn)
        serviceTasksOfBooking.forEach(task => {
          let nursingId = null;
          
          // Task đã có nurse
          if (task.nursingID) {
            nursingId = task.nursingID;
          }
          // Task mới được chọn nurse
          else if (selectedNurseByTask[task.customizeTaskID]) {
            nursingId = selectedNurseByTask[task.customizeTaskID];
          }

          if (nursingId) {
            const taskDetail = detailCustomizeTasks.find(t => t.customizeTaskID === task.customizeTaskID);
            if (taskDetail && taskDetail.startTime && taskDetail.endTime) {
              if (!nurseTaskMap.has(nursingId)) {
                nurseTaskMap.set(nursingId, []);
              }
              nurseTaskMap.get(nursingId).push({
                taskId: task.customizeTaskID,
                description: task.description,
                startTime: new Date(taskDetail.startTime),
                endTime: new Date(taskDetail.endTime),
                nursingId: nursingId
              });
            }
          }
        });

        // Kiểm tra trùng giờ cho từng nurse
        nurseTaskMap.forEach((tasks, nursingId) => {
          if (tasks.length > 1) {
            // Sắp xếp theo thời gian bắt đầu
            tasks.sort((a, b) => a.startTime - b.startTime);
            
            for (let i = 0; i < tasks.length - 1; i++) {
              const currentTask = tasks[i];
              const nextTask = tasks[i + 1];
              
              // Kiểm tra trùng giờ: task hiện tại kết thúc sau khi task tiếp theo bắt đầu
              if (currentTask.endTime > nextTask.startTime) {
                const formatTime = (date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                
                // Resolve nursing name if available
                const nurseObj = nursingSpecialists.find(n => (n?.nursingID ?? n?.NursingID) === nursingId) || null;
                const nurseName = nurseObj ? (nurseObj.nursingFullName ?? nurseObj.fullName ?? nurseObj.FullName) : String(nursingId);
                timeConflictsInBooking.push(
                  `Nhân sự ${nurseName} bị trùng giờ:\n` +
                  `  • ${currentTask.description}: ${formatTime(currentTask.startTime)} - ${formatTime(currentTask.endTime)}\n` +
                  `  • ${nextTask.description}: ${formatTime(nextTask.startTime)} - ${formatTime(nextTask.endTime)}`
                );
              }
            }
          }
        });

        if (timeConflictsInBooking.length > 0) {
          alert(`Không thể gán nhân sự do trùng giờ trong cùng lịch hẹn:\n\n${timeConflictsInBooking.join('\n\n')}\n\nMột nhân sự chỉ có thể làm nhiều nhiệm vụ nếu thời gian không trùng nhau!`);
          return;
        }

        // Kiểm tra trùng lịch với các booking khác cho các nhân sự mới chọn
        const conflicts = [];
        for (const [taskId, nurseId] of allAssignments) {
          try {
            const schedules = await workScheduleService.getAllByNursing(nurseId);
            const bookingDate = new Date(booking?.workdate).toISOString().split('T')[0];
            
            const conflictingSchedule = Array.isArray(schedules) ? schedules.find(schedule => {
              const scheduleDate = new Date(schedule.workDate || schedule.workdate).toISOString().split('T')[0];
              return scheduleDate === bookingDate;
            }) : null;
            
            if (conflictingSchedule) {
              const startTime = conflictingSchedule.workDate || conflictingSchedule.workdate;
              const endTime = conflictingSchedule.endTime || conflictingSchedule.endtime;
              const formatTime = (date) => new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
              const timeInfo = `${formatTime(startTime)} - ${formatTime(endTime)}`;
              const conflictBookingId = conflictingSchedule.bookingID || conflictingSchedule.booking_ID || conflictingSchedule.BookingID;
              
              // Resolve nursing name if available, fall back to selected map or id
              const nurseObj = nursingSpecialists.find(n => (n?.nursingID ?? n?.NursingID) === (Number(nurseId) || nurseId)) || null;
              const nurseName = nurseObj ? (nurseObj.nursingFullName ?? nurseObj.fullName ?? nurseObj.FullName) : (selectedNurseByTask ? (Object.values(selectedNurseByTask).find(v => String(v) === String(nurseId)) ? String(nurseId) : String(nurseId)) : String(nurseId));
              conflicts.push(`Nhân sự ${nurseName} đã có lịch trùng với lịch hẹn khác:\nLịch hẹn #${conflictBookingId}: ${timeInfo}`);
            }
          } catch (scheduleError) {
            console.warn('Could not check schedule conflicts for nurse', nurseId, ':', scheduleError);
          }
        }

        if (conflicts.length > 0) {
          alert(`Không thể gán nhân sự do trùng lịch với lịch hẹn khác:\n\n${conflicts.join('\n\n')}`);
          return;
        }

        // Thực hiện assign cho tất cả các task đã chọn
        await Promise.all(allAssignments.map(async ([taskId, nurseId]) => {
          await customizeTaskService.updateNursing(taskId, nurseId);
        }));

        // After assignments, send a single booking-level notification to the customer
        try {
          // Resolve account id from common variants
          const resolveAccountId = () => {
            const candidates = [
              careProfile?.accountID,
              careProfile?.accountId,
              careProfile?.account_id,
              careProfile?.AccountID,
              careProfile?.AccountId,
              account?.accountID,
              account?.accountId,
              account?.id,
              account?.ID,
              account?.AccountID,
              booking?.accountID,
              booking?.accountId,
            ];
            for (const c of candidates) {
              if (c !== undefined && c !== null && String(c).trim() !== '' && String(c) !== '0') return c;
            }
            if (careProfile && careProfile.account) {
              const cp = careProfile.account;
              if (cp.accountID || cp.accountId || cp.id) return cp.accountID || cp.accountId || cp.id;
            }
            return null;
          };

          const customerAccountId = resolveAccountId();
          const resolvedBookingId = booking?.BookingID ?? booking?.bookingID ?? booking?.id ?? booking?.ID ?? null;

          if (!customerAccountId) {
            console.warn('Không tìm thấy account id của customer; sẽ không gửi thông báo booking-level', { careProfile, account, booking });
          } else {
            try {
              console.info('Gửi thông báo booking-level tới account:', customerAccountId, 'booking:', resolvedBookingId);
              const res = await notificationService.createNotification({
                accountID: customerAccountId,
                message: `Lịch hẹn #${resolvedBookingId ?? 'N/A'} đã được cập nhật. Nhân sự đã được phân công cho các nhiệm vụ.`
              });
              console.info('Kết quả createNotification:', res);
            } catch (firstErr) {
              // retry with alternative key if backend expects different casing
              try {
                console.warn('createNotification failed with accountID, retrying with accountId...', firstErr);
                const res2 = await notificationService.createNotification({
                  accountId: customerAccountId,
                  message: `Lịch hẹn #${resolvedBookingId ?? 'N/A'} đã được cập nhật. Vui lòng xem lịch sử lịch hẹn để biết thêm chi tiết.`
                });
                console.info('Kết quả createNotification (accountId):', res2);
              } catch (secondErr) {
                console.warn('Không thể gửi thông báo booking-level cho customer after retries:', secondErr);
              }
            }
          }
        } catch (notifyErr) {
          console.warn('Không thể gửi thông báo booking-level cho customer (outer):', notifyErr);
        }

        // Clear all selections
        setSelectedNurseByTask({});
        setLocalNursesByTaskId({});

        // Force re-render of the modal to show updated status
        onClose();
        setTimeout(() => setSelectedBooking(booking), 100);

        // Hiển thị thông báo thành công
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successMessage.textContent = '✓ Đã phân công điều dưỡng cho tất cả nhiệm vụ thành công!';
        document.body.appendChild(successMessage);

        setTimeout(() => {
          if (successMessage.parentNode) {
            successMessage.parentNode.removeChild(successMessage);
          }
        }, 3000);
      } catch (e) {
        console.error('Assign nurses failed:', e);
        // Hiển thị thông báo lỗi
        const errorMessage = document.createElement('div');
        errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        errorMessage.textContent = '✗ Phân công thất bại: ' + (e?.message || 'Lỗi không xác định. Vui lòng thử lại.');
        document.body.appendChild(errorMessage);

        setTimeout(() => {
          if (errorMessage.parentNode) {
            errorMessage.parentNode.removeChild(errorMessage);
          }
        }, 5000);
      }
    };

    // Prefetch free nurses for each task in this booking (only missing ones)
    useEffect(() => {
      const bookingId = booking?.BookingID ?? booking?.bookingID;
      const uniqueTaskIds = Array.from(new Set((serviceTasksOfBooking || []).map(t => t.customizeTaskID).filter(Boolean)));
      const missing = uniqueTaskIds.filter((tid) => !localNursesByTaskId[tid]);

      let isMounted = true;
      const load = async () => {
        try {
          if (missing.length > 0) {
            const entries = await Promise.all(missing.map(async (tid) => {
              try {
                // Sử dụng API mới để lấy nurses rảnh cho từng task
                const data = await nursingSpecialistService.getAllFreeNursingSpecialists(tid);
                return [tid, data];
              } catch (e) {
                console.error('Failed to load free nurses for task', tid, e);
                return [tid, []];
              }
            }));
            if (isMounted) setLocalNursesByTaskId(prev => ({ ...prev, ...Object.fromEntries(entries) }));
          }

          if (!localInvoice && bookingId) {
            try {
              const inv = await invoiceService.getInvoiceByBooking(bookingId);
              if (isMounted) setLocalInvoice(inv);
            } catch (e) {
              // ignore
            }
          }

          // Lấy chi tiết customize tasks với thời gian từ API mới
          if (bookingId && detailCustomizeTasks.length === 0) {
            try {
              const detailTasks = await customizeTaskService.getAllByBooking(bookingId);
              if (isMounted) setDetailCustomizeTasks(detailTasks || []);
            } catch (error) {
              console.error('Error fetching detailed customize tasks:', error);
              if (isMounted) setDetailCustomizeTasks([]);
            }
          }
        } finally {
          // noop
        }
      };
      load();

      return () => { isMounted = false; };
    }, [booking?.BookingID, booking?.bookingID, serviceTasksOfBooking, localNursesByTaskId, localInvoice, detailCustomizeTasks]);

    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl relative max-h-[95vh] overflow-y-auto">
          <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition-colors z-10" onClick={onClose}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg p-6">
            <h3 className="text-2xl font-bold mb-2">Chi tiết lịch hẹn #{booking?.BookingID ?? booking?.bookingID}</h3>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Thông tin khách hàng */}
                              <div className="space-y-4">
                                {isCancelled && (
                                  <div className="mb-4 p-4 rounded bg-red-50 border border-red-200 text-red-700">
                                    Lịch đã hủy — không thể phân công nhân sự hoặc thay đổi phân công.
                                  </div>
                                )}
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                    </div>
                    Thông tin khách hàng
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Tên:</span>
                      <span className="text-gray-900 font-medium">{careProfile ? (careProfile.profileName ?? careProfile.ProfileName) : '-'} {account ? `(${account.full_name ?? account.fullName})` : ''}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Điện thoại:</span>
                      <span className="text-gray-900">{account?.phone_number || account?.phoneNumber || careProfile?.phoneNumber || careProfile?.PhoneNumber || '-'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600">Địa chỉ:</span>
                      <span className="text-right text-gray-900 max-w-xs">{careProfile?.address || careProfile?.Address || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600" />
                    </div>
                    Thông tin booking
                  </h4>
                  <div className="space-y-3 text-sm">
                    {packageInfo && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600">Mô tả:</span>
                        <span className="text-right text-gray-900 max-w-xs">{packageInfo.description ?? packageInfo.Description}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Ngày đặt:</span>
                      <p className="text-blue-500">
                        Ngày đặt: {new Date(booking?.workdate).toLocaleDateString('vi-VN')}
                        {" "} {" "}
                        {new Date(booking?.workdate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600">Trạng thái:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                       ${String(booking.status ?? booking.Status).toLowerCase() === 'paid' ? 'bg-pink-100 text-pink-700' :
                          String(booking.status ?? booking.Status).toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            String(booking.status ?? booking.Status).toLowerCase() === 'isscheduled' ? 'bg-blue-100 text-blue-700' :
                              String(booking.status ?? booking.Status).toLowerCase() === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                String(booking.status ?? booking.Status).toLowerCase() === 'cancelled' || String(booking.status ?? booking.Status).toLowerCase() === 'canceled' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                        }`}>
                        {(() => {
                          const s = String(booking.status ?? booking.Status).toLowerCase();
                          if (s === 'paid') return 'Đã thanh toán';
                          if (s === 'pending' || s === 'unpaid') return 'Chờ thanh toán';
                          if (s === 'completed') return 'Hoàn thành';
                          if (s === 'isscheduled') return 'Đã lên lịch';
                          if (s === 'cancelled' || s === 'canceled') return 'Đã hủy';
                          return 'Không xác định';
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin thanh toán */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <FontAwesomeIcon icon={faMoneyBill} className="text-orange-600" />
                    </div>
                    Hóa đơn
                  </h4>
                  <div className="space-y-3 text-sm">
                    {(() => {
                      const inv = localInvoice;
                      const total = inv?.totalAmount ?? inv?.total_amount ?? booking.totalPrice ?? booking.TotalPrice ?? booking.amount ?? booking.Amount;
                      const status = inv?.status ?? inv?.Status ?? (booking.paymentStatus ?? booking.PaymentStatus ?? booking.Status ?? booking.status);
                      const invoiceId = inv?.invoiceID ?? inv?.invoice_ID ?? (invoiceID || '-');
                      return (
                        <>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="font-medium text-gray-600">Mã hóa đơn:</span>
                            <span className="text-gray-900 font-mono">#{invoiceId}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="font-medium text-gray-600">Tổng tiền:</span>
                            <span className="font-bold text-green-600 text-lg">{(total)?.toLocaleString()} VNĐ</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="font-medium text-gray-600">Trạng thái:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                               ${String(status).toLowerCase() === 'paid'
                                ? 'bg-pink-100 text-pink-700'
                                : 'bg-red-100 text-red-700'
                              }`}>
                              {String(status).toLowerCase() === 'paid' ? 'Đã thanh toán' : 'Hoàn tiền'}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Chi tiết dịch vụ */}
            {serviceTasksOfBooking.length > 0 && (
              <div className="col-span-1 lg:col-span-2 mt-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-lg">
                    <h4 className="font-semibold text-lg flex items-center">
                      <FontAwesomeIcon icon={faClock} className="mr-3" />
                      Chi tiết dịch vụ
                    </h4>
                  </div>

                  <div className="p-6">
                    {/* Packages list */}
                    {packagesOfBooking?.length > 0 && (
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-900 mb-4 flex items-center">
                          <div className="w-4 h-4 bg-purple-600 rounded mr-2"></div>
                          Gói dịch vụ đã đặt
                        </h5>
                        <div className="space-y-3">
                          {packagesOfBooking.map((pkg) => {
                            const pkgService = serviceTypes.find((s) => (s?.serviceID ?? s?.ServiceID) === (pkg?.serviceID ?? pkg?.ServiceID));
                            return (
                              <div key={pkg.customizePackageID ?? pkg.CustomizePackageID} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-900 text-lg">{pkg.name ?? pkg.Name}</div>
                                    <div className="text-gray-600 text-sm mt-1">{pkgService?.serviceName ?? pkgService?.ServiceName}</div>
                                    <div className="flex items-center gap-4 mt-2 text-sm">
                                      <span className="text-gray-600">Số lượng: <span className="font-medium">{pkg.quantity}</span></span>
                                      <span className="text-gray-600">
                                        Trạng thái:{" "}
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-semibold ${pkg.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : pkg.status === 'pending'
                                              ? 'bg-yellow-100 text-yellow-700'
                                              : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                          {statusLabels[pkg.status] || pkg.status}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-bold text-green-600 text-xl">{(pkg.total ?? pkg.Total)?.toLocaleString()} VNĐ</div>
                                    {pkg.price ? <div className="text-sm text-gray-500 mt-1">Đơn giá: {(pkg.price)?.toLocaleString()} VNĐ</div> : null}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Task list with nurse assignment */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-4 flex items-center">
                        <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                        Danh sách công việc ({serviceTasksOfBooking.length} nhiệm vụ)
                      </h5>
                      <div className="space-y-4">
                        {serviceTasksOfBooking.map((task, index) => {
                          const status = task.status;
                          const hasNurse = !!task.nursingID;
                          return (
                            <div key={task.customizeTaskID} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                              {/* Task Header */}
                              <div className="p-4 border-b border-gray-100">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">#{index + 1}</span>
                                      <h6 className="font-semibold text-gray-900 text-lg">{task.description}</h6>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      {(() => {
                                        const taskDetail = detailCustomizeTasks.find(t => t.customizeTaskID === task.customizeTaskID);
                                        if (taskDetail && taskDetail.startTime && taskDetail.endTime) {
                                          const formatTime = (date) => new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                                          return (
                                            <div className="flex items-center gap-1 text-blue-600 font-medium">
                                              <FontAwesomeIcon icon={faClock} className="text-blue-500" />
                                              <span>{formatTime(taskDetail.startTime)} - {formatTime(taskDetail.endTime)}</span>
                                              <span className="text-gray-500 ml-2">
                                                ({new Date(taskDetail.startTime).toLocaleDateString('vi-VN')})
                                              </span>
                                            </div>
                                          );
                                        }
                                        return null;
                                      })()}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 ml-4">
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClasses[status] || 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                      {statusLabels[status] || status}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Nurse Assignment */}
                              <div className="p-4">
                                {hasNurse ? (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                          <FontAwesomeIcon icon={faUser} className="text-green-600" />
                                        </div>
                                        <div>
                                          <div className="font-semibold text-green-800">Đã phân công</div>
                                          <div className="text-green-700">
                                            <span className="font-medium">{task.nurseName}</span>
                                            {task.nurseRole && (
                                              <span className="text-sm ml-2">
                                                ({nurseRoleLabels[task.nurseRole] || task.nurseRole})
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                        ✓ Hoàn tất
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                          <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600" />
                                        </div>
                                        <div>
                                          <div className="font-semibold text-yellow-800">Chưa phân công điều dưỡng</div>
                                          <div className="text-yellow-700 text-sm">
                                            Vui lòng chọn điều dưỡng phù hợp
                                            {(() => {
                                              const taskId = task.customizeTaskID;
                                              const pool = localNursesByTaskId[taskId] || [];
                                              const zoneId = careProfile?.zoneDetailID ?? careProfile?.zoneDetail_ID;
                                              const filtered = Array.isArray(pool) ? pool.filter(n => !zoneId || (n.zoneID ?? n.ZoneID) === zoneId) : [];
                                              return (
                                                <span className="block mt-1 text-xs text-blue-600">
                                                  {localNursesByTaskId[taskId]
                                                    ? (filtered.length > 0 ? `${filtered.length} điều dưỡng có sẵn` : 'Không có điều dưỡng phù hợp')
                                                    : (
                                                      <span className="flex items-center gap-1">
                                                        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                        Đang tải danh sách điều dưỡng...
                                                      </span>
                                                    )
                                                  }
                                                </span>
                                              );
                                            })()}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <select
                                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-48"
                                          value={selectedNurseByTask[task.customizeTaskID] ?? ''}
                                          onChange={(e) => {
                                            const nurseId = e.target.value;
                                            if (nurseId) {
                                              handleNurseSelection(task.customizeTaskID, nurseId);
                                            } else {
                                              setSelectedNurseByTask((prev) => ({ ...prev, [task.customizeTaskID]: '' }));
                                            }
                                          }}
                                          disabled={!localNursesByTaskId[task.customizeTaskID]}
                                        >
                                          <option value="">
                                            {localNursesByTaskId[task.customizeTaskID]
                                              ? "Chọn điều dưỡng..."
                                              : "Đang tải..."
                                            }
                                          </option>
                                          {(() => {
                                            const taskId = task.customizeTaskID;
                                            // Lấy nurses rảnh cho task cụ thể này
                                            const zoneId = careProfile?.zoneDetailID ?? careProfile?.zoneDetail_ID;
                                            const pool = localNursesByTaskId[taskId] || [];
                                            // Lọc theo zone nếu có
                                            const filtered = Array.isArray(pool) ? pool.filter(n => !zoneId || (n.zoneID ?? n.ZoneID) === zoneId) : [];
                                            return filtered.map((n) => {
                                              const name = (n.nursingFullName ?? n.fullName ?? n.FullName) || '';
                                              const majorRaw = (n.major ?? n.Major ?? '') + '';
                                              const majorKey = majorRaw.trim().toLowerCase();
                                              const majorLabel = nurseRoleLabels[majorKey] ?? majorRaw.trim();
                                              return (
                                                <option key={n.nursingID ?? n.NursingID} value={n.nursingID ?? n.NursingID}>
                                                  {name}{majorLabel ? ` — ${majorLabel}` : ''}
                                                </option>
                                              );
                                            });
                                          })()}
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Nút cập nhật tất cả */}
                      {serviceTasksOfBooking.some(task => !task.nursingID) && (
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={handleAssignAllNurses}
                            className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={(() => {
                              // Kiểm tra xem có task nào chưa có nhân sự (cả đã có và mới chọn) không
                              const unassigned = serviceTasksOfBooking.filter(task => {
                                const hasExistingNurse = !!task.nursingID;
                                const hasNewAssignment = selectedNurseByTask[task.customizeTaskID];
                                return !hasExistingNurse && !hasNewAssignment;
                              });
                              return unassigned.length > 0;
                            })()}
                            title={(() => {
                              const unassigned = serviceTasksOfBooking.filter(task => {
                                const hasExistingNurse = !!task.nursingID;
                                const hasNewAssignment = selectedNurseByTask[task.customizeTaskID];
                                return !hasExistingNurse && !hasNewAssignment;
                              });
                              if (unassigned.length > 0) {
                                return `Còn ${unassigned.length} task chưa chọn nhân sự`;
                              }
                              return 'Cập nhật phân công cho tất cả task';
                            })()}
                          >
                            Cập nhật tất cả
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải dữ liệu booking...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
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
    );
  }

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-gradient-to-r ${color} p-6 rounded-xl shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-white/70 text-xs">{subtitle}</p>}
        </div>
        <div className="text-white/80 text-3xl">
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
    </div>
  );

  // moved to top to preserve hook order

  // Tính toán thống kê
  const totalBookings = Array.isArray(bookings) ? bookings.length : 0;
  const completedBookings = Array.isArray(bookings)
    ? bookings.filter((b) => {
      const s = (b.Status ?? b.status ?? '').toLowerCase();
      return s === 'paid';
    }).length
    : 0;
  const pendingBookings = Array.isArray(bookings)
    ? bookings.filter((b) => (b.Status ?? b.status) === 'pending' || (b.Status ?? b.status) === 'confirmed').length
    : 0;
  const totalRevenue = Array.isArray(invoices)
    ? invoices
      .filter(inv => String(inv.status ?? inv.Status).toLowerCase() === 'paid')
      .reduce((sum, inv) => sum + Number(inv.totalAmount ?? inv.TotalAmount ?? 0), 0)
    : 0;

  // Sắp xếp trạng thái theo thứ tự yêu cầu
  // Thứ tự ưu tiên custom
  const customOrder = [
    'paid-false',    // isSchedule: false, paid
    'paid-true',     // isSchedule: true, paid
    'pending',       // pending (cả isSchedule true/false)
    'completed-true',// isSchedule: true, completed
    'cancelled-true',// isSchedule: true, cancelled/canceled
    'cancelled-false'// isSchedule: false, cancelled/canceled
  ];
  // Phân trang

  // Lọc và sắp xếp bookings
  const filteredBookings = Array.isArray(bookings)
    ? bookings.filter((booking) => {
      const id = booking?.BookingID ?? booking?.bookingID;
      const status = (booking?.Status ?? booking?.status)?.toLowerCase();
      const detail = getBookingDetail(booking);
      const profileName = detail.careProfile?.ProfileName ?? detail.careProfile?.profileName;
      const matchesSearch =
        !searchTerm ||
        id?.toString().includes(searchTerm) ||
        profileName?.toLowerCase().includes(searchTerm.toLowerCase());
      let matchesStatus = statusFilter === 'all';
      const isSchedule = booking.isSchedule === true || booking.isSchedule === 'true' || booking.IsSchedule === true || booking.IsSchedule === 'true';
      if (!matchesStatus) {
        if (statusFilter === 'paid') {
          matchesStatus = status === 'paid' && !isSchedule;
        } else if (statusFilter === 'isScheduled') {
          matchesStatus = status === 'paid' && isSchedule;
        } else if (statusFilter === 'pending') {
          matchesStatus = status === 'pending' || status === 'unpaid';
        } else if (statusFilter === 'completed') {
          matchesStatus = status === 'completed' && isSchedule;
        } else if (statusFilter === 'cancelled') {
          matchesStatus = (status === 'cancelled' || status === 'canceled');
        } else {
          matchesStatus = status === statusFilter;
        }
      }
      return matchesSearch && matchesStatus;
    })
      .slice() // copy array
      .sort((a, b) => {
        // Custom sort theo yêu cầu
        const getKey = (booking) => {
          const status = (booking?.Status ?? booking?.status)?.toLowerCase();
          const isSchedule = booking.isSchedule === true || booking.isSchedule === 'true' || booking.IsSchedule === true || booking.IsSchedule === 'true';
          if (status === 'paid' && !isSchedule) return 'paid-false';
          if (status === 'paid' && isSchedule) return 'paid-true';
          if (status === 'pending' || status === 'unpaid') return 'pending';
          if (status === 'completed' && isSchedule) return 'completed-true';
          if ((status === 'cancelled' || status === 'canceled') && isSchedule) return 'cancelled-true';
          if ((status === 'cancelled' || status === 'canceled') && !isSchedule) return 'cancelled-false';
          return 'other';
        };
        const aKey = getKey(a);
        const bKey = getKey(b);
        const aIdx = customOrder.indexOf(aKey);
        const bIdx = customOrder.indexOf(bKey);
        return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
      })
    : [];

  const totalPages = Math.ceil(filteredBookings.length / pageSize);
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* No data message */}
      {!Array.isArray(bookings) || bookings.length === 0 ? (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faClipboardList} className="text-gray-400 text-6xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Không có dữ liệu booking</h3>
          <p className="text-gray-600">Chưa có booking nào được tạo trong hệ thống.</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Tổng Booking"
              value={totalBookings}
              icon={faCalendarAlt}
              color="from-blue-500 to-cyan-500"
            />
            <StatCard
              title="Đã thanh toán"
              value={completedBookings}
              icon={faCheckCircle}
              color="from-green-500 to-emerald-500"
            />
            <StatCard
              title="Đang xử lý"
              value={pendingBookings}
              icon={faClock}
              color="from-yellow-500 to-orange-500"
            />
            <StatCard
              title="Doanh thu"
              value={`${totalRevenue.toLocaleString()} VNĐ`}
              icon={faMoneyBill}
              color="from-purple-500 to-pink-500"
            />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm booking..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="isScheduled">Đã lên lịch</option>
                  <option value="pending">Chờ thanh toán</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {filteredBookings.length} booking được tìm thấy
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedBookings.map((booking) => {
                    const { careProfile, account, service, packageInfo } = getBookingDetail(booking);
                    const id = booking?.BookingID ?? booking?.bookingID;
                    const workDate = booking?.BookingDate ?? booking?.bookingDate ?? booking?.workdate ?? booking?.Workdate;
                    const price = booking?.TotalPrice ?? booking?.totalPrice ?? booking?.Amount ?? booking?.amount;
                    const status = booking?.Status ?? booking?.status;
                    return (
                      <tr key={id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{careProfile?.ProfileName ?? careProfile?.profileName ?? 'N/A'}</div>
                          <div className="text-sm text-gray-500">{account?.phone_number || account?.phoneNumber || careProfile?.PhoneNumber || careProfile?.phoneNumber || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {workDate
                            ? `${new Date(workDate).toLocaleDateString('vi-VN')} ${new Date(workDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          {price?.toLocaleString()} VNĐ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                          ${(() => {
                              const s = String(status).toLowerCase();
                              const isSchedule = booking.isSchedule === true || booking.isSchedule === 'true' || booking.IsSchedule === true || booking.IsSchedule === 'true';
                              if (s === 'paid' && !isSchedule) return 'bg-pink-100 text-pink-700';
                              if (s === 'paid' && isSchedule) return 'bg-blue-100 text-blue-700';
                              if (s === 'pending' || s === 'unpaid') return 'bg-yellow-100 text-yellow-700';
                              if (s === 'completed' && isSchedule) return 'bg-emerald-100 text-emerald-700';
                              if ((s === 'cancelled' || s === 'canceled') && isSchedule) return 'bg-red-100 text-red-700';
                              if ((s === 'cancelled' || s === 'canceled') && !isSchedule) return 'bg-red-100 text-red-700';
                              return 'bg-gray-100 text-gray-700';
                            })()}`}
                          >
                            {(() => {
                              const s = String(status).toLowerCase();
                              const isSchedule = booking.isSchedule === true || booking.isSchedule === 'true' || booking.IsSchedule === true || booking.IsSchedule === 'true';
                              if (s === 'paid' && !isSchedule) return 'Đã thanh toán';
                              if (s === 'paid' && isSchedule) return 'Đã lên lịch';
                              if (s === 'pending' || s === 'unpaid') return 'Chờ thanh toán';
                              if (s === 'completed' && isSchedule) return 'Hoàn thành';
                              if ((s === 'cancelled' || s === 'canceled') && isSchedule) return 'Đã hủy';
                              if ((s === 'cancelled' || s === 'canceled') && !isSchedule) return 'Đã hủy';
                              return status || 'Không rõ';
                            })()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="text-pink-600 hover:text-pink-900 mr-3"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Trang trước
                  </button>
                  <span className="mx-2 text-gray-600">Trang {currentPage} / {totalPages}</span>
                  <button
                    className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Detail Modal */}
          {selectedBooking && (
            <BookingDetailModal
              booking={selectedBooking}
              onClose={() => setSelectedBooking(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BookingsTab;
