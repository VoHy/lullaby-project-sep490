'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye, faEdit, faTrash, faSearch, faCalendarAlt,
  faMoneyBill, faUser, faClock, faCheckCircle, faTimesCircle, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
// Thay thế import mock data bằng services
import careProfileService from '@/services/api/careProfileService';
import accountService from '@/services/api/accountService';
import serviceTypeService from '@/services/api/serviceTypeService';
import bookingService from '@/services/api/bookingService';
import customizePackageService from '@/services/api/customizePackageService';
import customizeTaskService from '@/services/api/customizeTaskService';
import serviceTaskService from '@/services/api/serviceTaskService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';

const BookingsTab = ({ bookings }) => {
  // State cho API data
  const [careProfiles, setCareProfiles] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [customizePackages, setCustomizePackages] = useState([]);
  const [customizeTasks, setCustomizeTasks] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // UI states (must be declared before any conditional returns to keep hook order stable)
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedNurseByTask, setSelectedNurseByTask] = useState({});

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
          nursingSpecialistsData
        ] = await Promise.all([
          careProfileService.getCareProfiles(),
          accountService.getAllAccounts(),
          serviceTypeService.getServiceTypes(),
          customizePackageService.getAllCustomizePackages(),
          customizeTaskService.getAllCustomizeTasks(),
          serviceTaskService.getServiceTasks(),
          nursingSpecialistService.getNursingSpecialists()
        ]);

        setCareProfiles(careProfilesData);
        setAccounts(accountsData);
        setServiceTypes(serviceTypesData);
        setCustomizePackages(customizePackagesData);
        setCustomizeTasks(customizeTasksData);
        setServiceTasks(serviceTasksData);
        setNursingSpecialists(nursingSpecialistsData);
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
        nurseRole: nurse?.major ?? nurse?.Major
      };
    });
    return { careProfile, account, service, packageInfo, serviceTasksOfBooking, packagesOfBooking, invoiceID };
  }

  // Assign nurse to a task
  const handleAssignNurse = async (booking, task) => {
    try {
      const nurseId = selectedNurseByTask[task.customizeTaskID];
      if (!nurseId) return;
      await customizeTaskService.updateNursing(
        task.customizeTaskID,
        nurseId
      );
      // Update local customizeTasks cache
      setCustomizeTasks((prev) => prev.map((t) => {
        const id = t?.customizeTaskID ?? t?.CustomizeTaskID;
        if (id === task.customizeTaskID) return { ...t, nursingID: nurseId };
        return t;
      }));
    } catch (e) {
      console.error('Assign nurse failed:', e);
      alert('Phân công thất bại: ' + (e?.message || 'Unknown error'));
    }
  };

  const BookingDetailModal = ({ booking, onClose }) => {
    if (!booking) return null;
    const { careProfile, account, service, packageInfo, serviceTasksOfBooking, packagesOfBooking, invoiceID } = getBookingDetail(booking);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
          <button className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 text-2xl font-bold" onClick={onClose}>&times;</button>

          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Chi tiết Booking #{booking?.BookingID ?? booking?.bookingID}</h3>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thông tin khách hàng */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Thông tin khách hàng
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Tên:</span>
                    <span>{careProfile ? (careProfile.profileName ?? careProfile.ProfileName) : '-'} {account ? `(${account.full_name ?? account.fullName})` : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Điện thoại:</span>
                    <span>{account?.phone_number || account?.phoneNumber || careProfile?.phoneNumber || careProfile?.PhoneNumber || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Địa chỉ:</span>
                    <span className="text-right">{careProfile?.address || careProfile?.Address || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Thông tin dịch vụ
                </h4>
                <div className="space-y-2 text-sm">
                  {packageInfo && (
                    <div className="flex justify-between">
                      <span className="font-medium">Mô tả:</span>
                      <span className="text-right">{packageInfo.description ?? packageInfo.Description}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày đặt:</span>
                    <span>{new Date(booking?.workdate ?? booking?.Workdate ?? booking?.bookingDate ?? booking?.BookingDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Trạng thái:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(booking.status ?? booking.Status) === 'paid' ? 'bg-green-100 text-green-700' :
                        (booking.status ?? booking.Status) === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                      {(booking.status ?? booking.Status) === 'paid' ? 'Hoàn thành' :
                        (booking.status ?? booking.Status) === 'pending' ? 'Đang xử lý' : 'Đã hủy'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin thanh toán */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                  <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                  Thông tin thanh toán
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Tổng tiền:</span>
                    <span className="font-bold text-green-600">{(booking.totalPrice ?? booking.TotalPrice ?? booking.amount ?? booking.Amount)?.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Phương thức:</span>
                    <span>{booking.paymentMethod ?? booking.PaymentMethod ?? 'Chưa thanh toán'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Trạng thái thanh toán:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(booking.paymentStatus ?? booking.PaymentStatus) === 'paid' ? 'bg-green-100 text-green-700' :
                        (booking.status ?? booking.Status) === 'paid' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                      {(booking.status ?? booking.Status) === 'paid' ? 'Đã thanh toán' :
                        (booking.status ?? booking.Status) === 'pending' ? 'Chờ thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </div>
                </div>
              </div>

              {serviceTasksOfBooking.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                    Chi tiết dịch vụ
                  </h4>
                  {/* Packages list */}
                  {packagesOfBooking?.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {packagesOfBooking.map((pkg) => {
                        const pkgService = serviceTypes.find((s) => (s?.serviceID ?? s?.ServiceID) === (pkg?.serviceID ?? pkg?.ServiceID));
                        return (
                          <div key={pkg.customizePackageID ?? pkg.CustomizePackageID} className="bg-white rounded-lg p-3 border border-gray-200 flex justify-between">
                            <div>
                              <div className="font-semibold text-gray-800">{pkg.name ?? pkg.Name} — {pkgService?.serviceName ?? pkgService?.ServiceName}</div>
                              <div className="text-xs text-gray-600">Số lượng: {pkg.quantity} • Trạng thái: {pkg.status}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">{(pkg.total ?? pkg.Total)?.toLocaleString()} VNĐ</div>
                              {pkg.price ? <div className="text-xs text-gray-500">Đơn giá: {(pkg.price)?.toLocaleString()} VNĐ</div> : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Task list with nurse assignment */}
                  <div className="space-y-2">
                    {serviceTasksOfBooking.map((task) => {
                      const status = task.status;
                      const hasNurse = !!task.nursingID;
                      return (
                        <div key={task.customizeTaskID} className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                              <div className="font-semibold text-gray-800">{task.description}</div>
                              <div className="text-xs text-gray-600">{task.quantity} x {task.price?.toLocaleString()} VNĐ</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status === 'completed' ? 'bg-green-100 text-green-700' :
                                  status === 'isscheduled' ? 'bg-blue-100 text-blue-700' :
                                    status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {status === 'completed' ? 'Hoàn thành' : status === 'isscheduled' ? 'Đã lên lịch' : status === 'pending' ? 'Chờ thực hiện' : status}
                              </span>
                              <div className="text-sm">
                                {hasNurse ? (
                                  <span className="text-green-700">{task.nurseName} {task.nurseRole ? `(${task.nurseRole})` : ''}</span>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <select
                                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                                      value={selectedNurseByTask[task.customizeTaskID] ?? ''}
                                      onChange={(e) => setSelectedNurseByTask((prev) => ({ ...prev, [task.customizeTaskID]: Number(e.target.value) }))}
                                    >
                                      <option value="">Chọn y tá</option>
                                      {nursingSpecialists.map((n) => (
                                        <option key={n.nursingID ?? n.NursingID} value={n.nursingID ?? n.NursingID}>
                                          {(n.fullName ?? n.FullName) + (n.major ? ` — ${n.major}` : '')}
                                        </option>
                                      ))}
                                    </select>
                                    <button
                                      onClick={() => handleAssignNurse(booking, task)}
                                      className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1 rounded"
                                      disabled={!selectedNurseByTask[task.customizeTaskID]}
                                    >
                                      Phân công
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="text-right font-semibold text-green-600">{task.total?.toLocaleString()} VNĐ</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
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
  const totalRevenue = Array.isArray(bookings)
    ? bookings.reduce((sum, b) => sum + (b.TotalPrice ?? b.totalPrice ?? b.Amount ?? b.amount ?? 0), 0)
    : 0;

  // Lọc bookings
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
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    : [];

  return (
    <div className="space-y-6">
      {/* No data message */}
      {!Array.isArray(bookings) || bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
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
              title="Hoàn thành"
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
                  <option value="pending">Đang xử lý</option>
                  <option value="paid">Hoàn thành</option>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => {
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {packageInfo
                              ? (packageInfo.Name ?? packageInfo.name)
                              : ((service?.ServiceName ?? service?.serviceName) || 'N/A')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {workDate ? new Date(workDate).toLocaleDateString('vi-VN') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          {price?.toLocaleString()} VNĐ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status === 'paid' ? 'bg-green-100 text-green-700' :
                              status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {status === 'completed' || status === 'paid' ? 'Đã thanh toán' : status === 'pending' ? 'Chờ thanh toán' : (status || 'Không rõ')}
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
