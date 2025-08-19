import React, { useState, useEffect, useContext } from 'react';
import { FaExclamationTriangle, FaClipboardList, FaSearch, FaFilter } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import bookingService from '@/services/api/bookingService';
import accountService from '@/services/api/accountService';
import careProfileService from '@/services/api/careProfileService';
import serviceTypeService from '@/services/api/serviceTypeService';
import customizePackageService from '@/services/api/customizePackageService';
import customizeTaskService from '@/services/api/customizeTaskService';
import serviceTaskService from '@/services/api/serviceTaskService';
import zoneDetailService from '@/services/api/zoneDetailService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import zoneService from '@/services/api/zoneService';
import notificationService from '@/services/api/notificationService';
import invoiceService from '@/services/api/invoiceService';

const statusOptions = [
  { value: 'pending', label: 'Chưa thanh toán' },
  { value: 'paid', label: 'Đã thanh toán' },
  { value: 'isScheduled', label: 'Đã lên lịch' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];
const statusLabels = {
  completed: 'Hoàn thành',
  pending: 'Đang chờ',
  cancelled: 'Đã hủy',
  isScheduled: 'Đã lên lịch',
};

const nurseRoleLabels = {
  nurse: 'Y tá',
  specialist: 'Chuyên gia',
  Nurse: 'Y tá',
  Specialist: 'Chuyên gia'

};

const ManagerBookingTab = () => {
  // Filter, sort, and pagination state
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { user } = useContext(AuthContext);
  const currentManagerId = user?.accountID || user?.accountID;

  // State cho API data
  const [allBookings, setAllBookings] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [customizeTasks, setCustomizeTasks] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [zoneDetails, setZoneDetails] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [zones, setZones] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State cho popup chi tiết
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [taskAssignments, setTaskAssignments] = useState({});
  const [eligibleByTask, setEligibleByTask] = useState({}); // { [customizeTaskId]: { nurses: [], specialists: [] } }
  const [loadingEligible, setLoadingEligible] = useState(false);
  const [localInvoice, setLocalInvoice] = useState(null);
  // State cho popup chọn nhân sự
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [modalTaskId, setModalTaskId] = useState(null);
  

  // Load data từ API
  useEffect(() => {
    const fetchData = async () => {
      if (!currentManagerId) {
        setBookings([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Gọi API cần thiết cho trang booking
        const [
          rawBookings,
          accountsData,
          careProfilesData,
          serviceTypesData,
          serviceTasksData,
          zoneDetailsData,
          nursingSpecialistsData,
          zonesData
        ] = await Promise.all([
          bookingService.getAllBookings(),
          accountService.getAllAccounts(),
          careProfileService.getCareProfiles(),
          serviceTypeService.getServiceTypes(),
          serviceTaskService.getServiceTasks(),
          zoneDetailService.getZoneDetails(),
          nursingSpecialistService.getNursingSpecialists(),
          zoneService.getZones()
        ]);

        // Join careProfile vào từng booking để dùng thống nhất trong component
        const cpMap = new Map((careProfilesData || []).map(cp => [
          cp.careProfileID || cp.CareProfileID,
          cp
        ]));
        const bookingsData = (rawBookings || []).map(b => ({
          ...b,
          careProfile: b.careProfile || cpMap.get(b.careProfileID || b.CareProfileID) || null,
        }));

        // Lấy customize tasks để biết chi tiết dịch vụ và nhân sự đã gán
        const customizeTasksData = await customizeTaskService.getAllCustomizeTasks();

        setAllBookings(bookingsData);
        setAccounts(accountsData);
        setServiceTypes(serviceTypesData);
        setCustomizeTasks(customizeTasksData);
        setServiceTasks(serviceTasksData);
        setZoneDetails(zoneDetailsData);
        setNursingSpecialists(nursingSpecialistsData);
        setZones(zonesData);

      } catch (error) {
        console.error('Error fetching manager booking data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentManagerId]);

  // Không dựa vào role của account nữa; lọc trực tiếp theo bảng nursingSpecialists và khu vực

  function getBookingDetail(booking) {
    // Sử dụng thông tin careProfile từ booking data thay vì tìm kiếm riêng
    const careProfile = booking.careProfile;
    const account = accounts.find(a => a.accountID === careProfile?.accountID);
    let service = null;
    let packageInfo = null;

    // Lấy các dịch vụ con/lẻ thực tế từ CustomizeTask
    const customizeTasksOfBooking = (customizeTasks || []).filter(t =>
      (t.bookingID) === (booking.bookingID)
    );

    const serviceTasksOfBooking = customizeTasksOfBooking.map(task => {
      const serviceId = task.serviceID;
      const serviceType = serviceTypes.find(s => (s.serviceID) === serviceId) || {};

      const nurseId = task.nursingID;
      const assignedNurse = nurseId ? nursingSpecialists.find(n => (n.nursingID) === nurseId) : null;
      const assignedAccount = assignedNurse ? accounts.find(acc => (acc.accountID) === (assignedNurse.accountID)) : null;

      return {
        customizeTaskId: task.customizeTaskID,
        description: serviceType.description || serviceType.serviceName || 'Dịch vụ',
        serviceId: serviceId,
        status: task.status,
        assignedNurseId: nurseId || null,
        assignedNurseName: assignedAccount?.fullName || assignedNurse?.fullName || null,
        assignedNurseRole: assignedNurse?.major || null,
        hasAssignedNurse: !!nurseId
      };
    });

    return { careProfile, account, service, packageInfo, serviceTasksOfBooking };
  }

  // Lọc booking theo khu vực quản lý của manager
  function getFilteredBookings(bookings, currentManagerId) {
    // Lấy khu vực mà manager hiện tại quản lý
    const managedZone = zones.find(zone => (zone.accountID || zone.AccountID || zone.managerID) === currentManagerId);
    if (!managedZone) return [];

    // Lọc booking có care profile thuộc khu vực quản lý
    const filteredBookings = bookings.filter(booking => {
      const careProfile = booking.careProfile;
      if (!careProfile) return false;

      const zoneDetail = zoneDetails.find(z => z.zoneDetailID === careProfile.zoneDetailID);
      if (!zoneDetail) return false;

      // Chỉ hiển thị booking thuộc khu vực quản lý của manager
      return zoneDetail.zoneID === managedZone.zoneID;
    });

    return filteredBookings;
  }

  // Lọc booking theo khu vực quản lý khi component mount hoặc user thay đổi
  useEffect(() => {
    if (currentManagerId && allBookings.length > 0) {
      const filteredBookings = getFilteredBookings(allBookings, currentManagerId);
      setBookings(filteredBookings);
      setCurrentPage(1); // reset page when bookings change
    }
  }, [allBookings, currentManagerId]);

  // Lấy danh sách nhân sự phù hợp theo API mới cho 1 customizeTask
  async function fetchEligibleForTask(customizeTaskId) {
    if (!customizeTaskId) return;
    setLoadingEligible(true);
    try {
      const list = await nursingSpecialistService.getAllFreeNursingSpecialists(customizeTaskId);
      const nurses = (list || []).filter(p => String(p.major).toLowerCase() === 'nurse');
      const specialists = (list || []).filter(p => String(p.major).toLowerCase() === 'specialist');
      setEligibleByTask(prev => ({ ...prev, [customizeTaskId]: { nurses, specialists } }));
    } catch (e) {
      // keep empty on error
      setEligibleByTask(prev => ({ ...prev, [customizeTaskId]: { nurses: [], specialists: [] } }));
    } finally {
      setLoadingEligible(false);
    }
  }

  const handleViewDetail = (booking) => {
    setDetailData(booking);
    setSelectedStatus(booking.Status);
    setTaskAssignments({});
    setShowDetail(true);

    // Prefetch invoice and eligible staff per service
    (async () => {
      try {
        const bookingId = booking?.bookingID || booking?.BookingID;
        if (bookingId) {
          try {
            const inv = await invoiceService.getInvoiceByBooking(bookingId);
            setLocalInvoice(inv);
          } catch (_) {
            setLocalInvoice(null);
          }
        }
        // Reset eligible cache when opening detail
        setEligibleByTask({});
      } catch (_) {
        // ignore
      }
    })();
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailData(null);
  };

  const handleTaskAssign = (taskId, type, value) => {
    setTaskAssignments(prev => {
      // Chỉ lưu lại nhân sự đã chọn
      if (type === 'nurse') {
        return {
          ...prev,
          [taskId]: { nurse: value, specialist: '' }
        };
      } else if (type === 'specialist') {
        return {
          ...prev,
          [taskId]: { nurse: '', specialist: value }
        };
      }
      return prev;
    });
    setShowStaffModal(false);
  };

  const handleAccept = async () => {
    if (detailData) {
      const { serviceTasksOfBooking, careProfile, account } = getBookingDetail(detailData);
      // Kiểm tra xem tất cả dịch vụ đã có nhân sự chưa
      const unassignedTasks = serviceTasksOfBooking.filter(task => {
        const hasExistingNurse = task.hasAssignedNurse;
        const hasNewAssignment = (taskAssignments[task.customizeTaskId]?.nurse || taskAssignments[task.customizeTaskId]?.specialist);
        return !hasExistingNurse && !hasNewAssignment;
      });

      if (unassignedTasks.length > 0) {
        alert(`Vui lòng chọn nhân sự cho các dịch vụ sau:\n${unassignedTasks.map(task => `- ${task.description}`).join('\n')}`);
        return;
      }

      try {
        // Thực hiện assign đối với các task đã chọn
        const assignments = Object.entries(taskAssignments);
        if (assignments.length > 0) {
          await Promise.all(assignments.map(async ([taskId, sel]) => {
            const nursingId = sel.nurse || sel.specialist;
            if (!nursingId) return;
            await customizeTaskService.updateNursing(taskId, nursingId);
          }));
        }

        setShowDetail(false);
        alert('Đã gán nhân sự cho các dịch vụ!');
      } catch (error) {
        console.error('Error accepting booking:', error);
        alert('Có lỗi xảy ra khi gán nhân sự');
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <FaExclamationTriangle className="text-red-500 text-6xl mb-4 inline-block" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Filter, sort, and paginate bookings */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
          Danh sách đơn hàng
        </h3>
        {/* Filter/Search UI */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã booking, dịch vụ..."
              className="border rounded-lg w-full px-10 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              value={searchText}
              onChange={e => { setSearchText(e.target.value); setCurrentPage(1); }}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <FaSearch />
            </span>
          </div>

          <div className="relative w-48">
            <select
              className="border rounded-lg w-full px-3 py-2 appearance-none focus:ring-2 focus:ring-purple-400 focus:outline-none"
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            >
              <option value="">Tất cả trạng thái</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">
              <FaFilter />
            </span>
          </div>
        </div>

        {/* Filter, sort, paginate */}
        {(() => {
          let filtered = bookings;
          if (searchText) {
            const lower = searchText.toLowerCase();
            filtered = filtered.filter(b => {
              const { careProfile, serviceTasksOfBooking } = getBookingDetail(b);
              return (
                String(b.bookingID).includes(lower) ||
                careProfile?.profileName?.toLowerCase().includes(lower) ||
                serviceTasksOfBooking?.some(t => t.description?.toLowerCase().includes(lower))
              );
            });
          }

          if (filterStatus) {
            const isSchedule = b => b.isSchedule === true || b.IsSchedule === true;
            if (filterStatus === 'paid') filtered = filtered.filter(b => String(b.status ?? b.Status).toLowerCase() === 'paid' && !isSchedule(b));
            else if (filterStatus === 'isScheduled') filtered = filtered.filter(b => String(b.status ?? b.Status).toLowerCase() === 'paid' && isSchedule(b));
            else if (filterStatus === 'pending') filtered = filtered.filter(b => ['pending', 'unpaid'].includes(String(b.status ?? b.Status).toLowerCase()));
            else if (filterStatus === 'completed') filtered = filtered.filter(b => String(b.status ?? b.Status).toLowerCase() === 'completed' && isSchedule(b));
            else if (filterStatus === 'cancelled') filtered = filtered.filter(b => ['cancelled', 'canceled'].includes(String(b.status ?? b.Status).toLowerCase()));
            else filtered = filtered.filter(b => String(b.status ?? b.Status).toLowerCase() === filterStatus);
          }

          // Custom sort
          const customOrder = ['paid-false', 'paid-true', 'pending', 'completed-true', 'cancelled-true', 'cancelled-false'];
          filtered = filtered.slice().sort((a, b) => {
            const getKey = booking => {
              const s = String(booking.status ?? booking.Status).toLowerCase();
              const isSchedule = booking.isSchedule === true || booking.IsSchedule === true;
              if (s === 'paid' && !isSchedule) return 'paid-false';
              if (s === 'paid' && isSchedule) return 'paid-true';
              if (['pending', 'unpaid'].includes(s)) return 'pending';
              if (s === 'completed' && isSchedule) return 'completed-true';
              if ((s === 'cancelled' || s === 'canceled') && isSchedule) return 'cancelled-true';
              if ((s === 'cancelled' || s === 'canceled') && !isSchedule) return 'cancelled-false';
              return 'other';
            }
            return (customOrder.indexOf(getKey(a)) - customOrder.indexOf(getKey(b)));
          });

          const totalItems = filtered.length;
          const totalPages = Math.ceil(totalItems / itemsPerPage);
          const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

          return (
            <>
              {totalItems === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FaClipboardList className="text-3xl mb-2 mx-auto" />
                  <p className="text-lg font-medium">Không có booking nào</p>
                  <p className="text-sm mt-1">Hiện tại chưa có booking nào thuộc khu vực quản lý của bạn</p>
                </div>
              ) : (
                <>
                  <table className="w-full bg-white rounded-lg overflow-hidden shadow-md">
                    <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left">Mã Booking</th>
                        <th className="px-6 py-3 text-left">Khách hàng</th>
                        <th className="px-6 py-3 text-left">Dịch vụ</th>
                        <th className="px-6 py-3 text-left">Trạng thái</th>
                        <th className="px-6 py-3 text-left">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paged.map(booking => {
                        const { careProfile, account, serviceTasksOfBooking } = getBookingDetail(booking);
                        const s = String(booking.status ?? booking.Status).toLowerCase();
                        const isScheduled = booking.isSchedule || booking.IsSchedule;
                        const statusClass = s === 'cancelled' || s === 'canceled' ? 'bg-red-100 text-red-800'
                          : isScheduled ? 'bg-blue-100 text-blue-800'
                            : s === 'paid' ? 'bg-pink-100 text-pink-800'
                              : s === 'pending' || s === 'unpaid' ? 'bg-yellow-100 text-yellow-800'
                                : s === 'completed' ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-700';
                        const statusText = s === 'cancelled' || s === 'canceled' ? 'Đã hủy'
                          : isScheduled ? 'Đã lên lịch'
                            : s === 'paid' ? 'Đã thanh toán'
                              : s === 'pending' || s === 'unpaid' ? 'Chờ thanh toán'
                                : s === 'completed' ? 'Hoàn thành'
                                  : 'Không xác định';

                        return (
                          <tr key={booking.bookingID} className="hover:bg-gray-50">
                            <td className="px-6 py-4">#{booking.bookingID}</td>
                            <td className="px-6 py-4">
                              <div className="font-semibold">{careProfile?.profileName || '-'}</div>
                              <div className="text-xs text-gray-500">SĐT: {careProfile?.phoneNumber || '-'}</div>
                              <div className="text-xs text-gray-500">Email: {account?.email || '-'}</div>
                            </td>
                            <td className="px-6 py-4">
                              {serviceTasksOfBooking.length > 1
                                ? <ul className="space-y-1">{serviceTasksOfBooking.map((t, i) => <li key={i} className="flex items-center text-sm text-gray-800"><span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-2"></span>{t.description}</li>)}</ul>
                                : (serviceTasksOfBooking[0]?.description || '-')}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-block min-w-[80px] px-2 py-0.5 rounded-full text-xs font-semibold text-center shadow-sm ${statusClass}`}>
                                {statusText}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button onClick={() => handleViewDetail(booking)} className="min-w-[80px] px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:shadow-sm">Xem chi tiết</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button className="px-3 py-1 rounded border bg-white hover:bg-gray-100" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Trước</button>
                    <span className="px-2">Trang {currentPage} / {totalPages}</span>
                    <button className="px-3 py-1 rounded border bg-white hover:bg-gray-100" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Sau</button>
                  </div>
                </>
              )}
            </>
          );
        })()}
      </div>

      {/* Popup chi tiết booking */}
      {showDetail && detailData && (() => {
        const { careProfile, account, service, packageInfo, serviceTasksOfBooking } = getBookingDetail(detailData);
        const isPackage = !!detailData.Package_ServiceID;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-8 relative max-h-[90vh] overflow-y-auto">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={handleCloseDetail}>&times;</button>
              <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">Chi tiết Booking #{detailData.bookingID}</h3>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Thông tin khách hàng */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Thông tin khách hàng
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tên khách hàng</div>
                        <div className="text-gray-800 font-medium">{careProfile?.profileName || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Số điện thoại</div>
                        <div className="text-gray-800">{careProfile?.phoneNumber || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</div>
                        <div className="text-gray-800">{account?.email || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Địa chỉ</div>
                        <div className="text-gray-800 text-sm leading-relaxed">{careProfile?.address || '-'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin booking */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Thông tin booking
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ngày đặt</div>
                        <div className="text-gray-800">{detailData.workdate ? new Date(detailData.workdate).toLocaleString('vi-VN') : '-'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin thanh toán - dùng invoice */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Thông tin thanh toán
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Giá tiền</div>
                        <div className="text-2xl font-bold text-purple-600">{(localInvoice?.totalAmount ?? detailData.amount)?.toLocaleString('vi-VN') || '-'} ₫</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trạng thái</div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${localInvoice?.status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {localInvoice ? (localInvoice.status ? 'Đã thanh toán' : 'Chưa thanh toán') : 'Chưa có hóa đơn'}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Dịch vụ chi tiết:</span>
                <ul className="list-disc ml-6 mt-1">
                  {serviceTasksOfBooking.length === 0 && <li className="text-gray-400 text-xs">Không có dịch vụ chi tiết.</li>}
                  {serviceTasksOfBooking.map((task, idx) => (
                    <li key={idx} className="text-sm">
                      {task?.description}
                      {task.assignedNurseName && (
                        <span className="ml-2 text-xs text-blue-700">- {task.assignedNurseName} ({nurseRoleLabels[task.assignedNurseRole] || task.assignedNurseRole})</span>
                      )}
                      {!task.assignedNurseName && (
                        <span className="ml-2 text-xs text-red-600">- Chưa có nhân sự</span>
                      )}
                      {task.status && (
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${task.status === 'active'
                            ? 'bg-blue-100 text-blue-700'
                            : task.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {statusLabels[task.status] || task.status}
                        </span>
                      )}

                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Danh sách dịch vụ:</h4>
                <table className="w-full text-sm border rounded">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                      <th className="p-2 text-left">Dịch vụ</th>
                      <th className="p-2 text-left">Giá</th>
                      <th className="p-2 text-left">Nhân sự đã chọn</th>
                      <th className="p-2 text-left">Chọn nhân sự</th>
                      <th className="p-2 text-left">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceTasksOfBooking.map((task) => (
                      <tr key={task.customizeTaskId}>
                        <td className="p-2">{task?.description}</td>
                        <td className="p-2">{/* giá nếu có */}</td>
                        <td className="p-2">
                          {task.assignedNurseName ? (
                            <span className="text-green-600 font-medium">{task.assignedNurseName} ({nurseRoleLabels[task.assignedNurseRole] || task.assignedNurseRole}) </span>
                          ) : taskAssignments[task.customizeTaskId]?.nurse || taskAssignments[task.customizeTaskId]?.specialist ? (
                            <span className="text-blue-600 font-medium">
                              {(() => {
                                const nurseId = taskAssignments[task.customizeTaskId]?.nurse;
                                const specialistId = taskAssignments[task.customizeTaskId]?.specialist;
                                const nurse = eligibleByTask[task.customizeTaskId]?.nurses?.find(n => (n.NursingID || n.nursingID) === nurseId);
                                const specialist = eligibleByTask[task.customizeTaskId]?.specialists?.find(s => (s.NursingID || s.nursingID) === specialistId);
                                if (nurse) return `${nurse.Full_Name || nurse.fullName} (Y tá)`;
                                if (specialist) return `${specialist.Full_Name || specialist.fullName} (Chuyên gia)`;
                                return 'Đã chọn nhân sự';
                              })()}
                            </span>
                          ) : (
                            <span className="text-red-500 text-sm">Chưa có nhân sự</span>
                          )}
                        </td>
                        <td className="p-2">
                          {!task.assignedNurseName ? (
                            <button
                              className="px-3 py-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs"
                              onClick={() => { setShowStaffModal(true); setModalTaskId(task.customizeTaskId); fetchEligibleForTask(task.customizeTaskId); }}
                            >Chọn nhân sự</button>
                          ) : (
                            <span className="text-gray-400 text-xs">Đã có nhân sự</span>
                          )}
                        </td>
                        <td className="p-2">{statusLabels[task.status] || task.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAccept}
                  className="px-8 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg"
                >
                  Accept
                </button>
              </div>
              {/* Popup chọn nhân sự */}
              {showStaffModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowStaffModal(false)}>&times;</button>
                    <h4 className="text-lg font-bold mb-4 text-purple-700">Chọn nhân sự cho dịch vụ</h4>
                    <div className="mb-3">
                      <div className="font-semibold mb-2">Y tá</div>
                      <ul className="space-y-2">
                        {(loadingEligible ? [] : (eligibleByTask[modalTaskId]?.nurses || [])).length === 0 && <li className="text-gray-400 text-xs">Không có Y tá phù hợp</li>}
                        {(loadingEligible ? [] : (eligibleByTask[modalTaskId]?.nurses || [])).map(n => (
                          <li key={n.NursingID || n.nursingID}>
                            <button
                              className="w-full text-left px-3 py-2 rounded border hover:bg-purple-100"
                              onClick={() => handleTaskAssign(modalTaskId, 'nurse', n.NursingID || n.nursingID)}
                            >{n.Full_Name || n.fullName}</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-3">
                      <div className="font-semibold mb-2">Chuyên gia</div>
                      <ul className="space-y-2">
                        {(loadingEligible ? [] : (eligibleByTask[modalTaskId]?.specialists || [])).length === 0 && <li className="text-gray-400 text-xs">Không có Chuyên gia phù hợp</li>}
                        {(loadingEligible ? [] : (eligibleByTask[modalTaskId]?.specialists || [])).map(s => (
                          <li key={s.NursingID || s.nursingID}>
                            <button
                              className="w-full text-left px-3 py-2 rounded border hover:bg-pink-100"
                              onClick={() => handleTaskAssign(modalTaskId, 'specialist', s.NursingID || s.nursingID)}
                            >{s.Full_Name || s.fullName}</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ManagerBookingTab; 