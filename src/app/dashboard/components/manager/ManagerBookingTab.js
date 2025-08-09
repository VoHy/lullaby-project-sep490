import React, { useState, useEffect, useContext } from 'react';
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

const statusOptions = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const ManagerBookingTab = () => {
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
    }
  }, [allBookings, currentManagerId]);

  // Lọc nurse/specialist theo khu vực của khách hàng booking
  function getFilteredNursesSpecialists(careProfile) {
    if (!careProfile) return { nurses: [], specialists: [] };
    const zoneDetail = zoneDetails.find(z => (z.zoneDetailID) === (careProfile.zoneDetailID));
    if (!zoneDetail) return { nurses: [], specialists: [] };
    const zoneId = zoneDetail.zoneID;

    const nurses = nursingSpecialists.filter(n =>
      (n.zoneID === zoneId) && (n.major === 'nurse')
    );
    const specialists = nursingSpecialists.filter(s =>
      (s.zoneID === zoneId) && (s.major === 'specialist')
    );
    return { nurses, specialists };
  }

  const handleViewDetail = (booking) => {
    setDetailData(booking);
    setSelectedStatus(booking.Status);
    setTaskAssignments({});
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailData(null);
  };

  const handleTaskAssign = (taskId, type, value) => {
    setTaskAssignments(prev => {
      // Nếu chọn nurse thì clear specialist, chọn specialist thì clear nurse
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
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await bookingService.updateStatus(bookingId, newStatus);

      // Cập nhật local state
      setBookings(prev => prev.map(booking =>
        booking.bookingID === bookingId
          ? { ...booking, Status: newStatus }
          : booking
      ));

      if (detailData && detailData.bookingID === bookingId) {
        setDetailData(prev => ({ ...prev, Status: newStatus }));
      }

      alert(`Đã cập nhật trạng thái booking thành: ${statusOptions.find(opt => opt.value === newStatus)?.label}`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái booking');
    }
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
        alert(`Vui lòng chọn nhân sự cho các dịch vụ sau:\n${unassignedTasks.map(task => `- ${task.Description}`).join('\n')}`);
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

        // Cập nhật status booking thành confirmed
        await handleUpdateStatus(detailData.bookingID, 'confirmed');

        // Gửi thông báo cho customer
        const notificationData = {
          accountID: account.accountID,
          Title: 'Booking đã được xác nhận',
          Content: `Booking #${detailData.bookingID} của ${careProfile.ProfileName} đã được manager xác nhận và sẵn sàng thực hiện.`,
          Type: 'booking_confirmed',
          IsRead: false,
          CreatedAt: new Date().toISOString(),
          UpdatedAt: new Date().toISOString()
        };

        await notificationService.createNotification(notificationData);

        setShowDetail(false);
        alert('Đã gán nhân sự (nếu có) và xác nhận booking!');
      } catch (error) {
        console.error('Error accepting booking:', error);
        alert('Có lỗi xảy ra khi xác nhận booking');
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
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
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
      <h3 className="text-xl font-semibold mb-4">Danh sách Booking</h3>
      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">📋</div>
          <p className="text-gray-600 text-lg font-medium">Không có booking nào</p>
          <p className="text-gray-400 text-sm mt-1">Hiện tại chưa có booking nào thuộc khu vực quản lý của bạn</p>
        </div>
      ) : (
        <table className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
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
            {bookings.map(booking => {
              const { careProfile, account, service, packageInfo, serviceTasksOfBooking } = getBookingDetail(booking);
              return (
                <tr key={booking.bookingID} className="hover:bg-gray-50">
                  <td className="px-6 py-4">#{booking.bookingID}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{careProfile?.ProfileName || '-'}</div>
                    <div className="text-xs text-gray-500">SĐT: {careProfile?.PhoneNumber || '-'}</div>
                    <div className="text-xs text-gray-500">Địa chỉ: {careProfile?.Address || '-'}</div>
                    <div className="text-xs text-gray-500">Email: {account?.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {serviceTasksOfBooking && serviceTasksOfBooking.length > 1
                      ? (
                        <ul className="space-y-1">
                          {serviceTasksOfBooking.map((task, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-800">
                              <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
                              {task.description}
                            </li>
                          ))}
                        </ul>
                      )
                      : (serviceTasksOfBooking[0]?.description || service?.ServiceName || '-')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={` inline-block min-w-[80px] px-2 py-0.5 rounded-full text-xs font-semibold text-center shadow-sm 
                  ${booking.Status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.Status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.Status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                      }`}>
                      {statusOptions.find(opt => opt.value === booking.Status)?.label || booking.Status}
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
      )}
      {/* Popup chi tiết booking */}
      {showDetail && detailData && (() => {
        const { careProfile, account, service, packageInfo, serviceTasksOfBooking } = getBookingDetail(detailData);
        const isPackage = !!detailData.Package_ServiceID;
        // Lọc nurse/specialist cùng khu vực
        const { nurses, specialists } = getFilteredNursesSpecialists(careProfile);
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
                        <div className="text-gray-800 font-medium">{careProfile?.ProfileName || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Số điện thoại</div>
                        <div className="text-gray-800">{careProfile?.PhoneNumber || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</div>
                        <div className="text-gray-800">{account?.email || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Địa chỉ</div>
                        <div className="text-gray-800 text-sm leading-relaxed">{careProfile?.Address || '-'}</div>
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
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dịch vụ</div>
                        {/* <div className="text-gray-800 font-medium">{packageInfo ? packageInfo.Name : (service?.ServiceName || '-')}</div> */}
                        <div className="text-gray-800 font-medium">{service?.ServiceName || '-'}</div>
                      </div>
                      {/* {packageInfo && (
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mô tả</div>
                          <div className="text-gray-800 text-sm leading-relaxed">{packageInfo.Description}</div>
                        </div>
                      )} */}
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ngày đặt</div>
                        <div className="text-gray-800">{detailData.CreatedAt ? new Date(detailData.CreatedAt).toLocaleString('vi-VN') : '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ngày làm việc</div>
                        <div className="text-gray-800">{detailData.AppointmentDate ? new Date(detailData.AppointmentDate).toLocaleString('vi-VN') : '-'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin thanh toán */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Thông tin thanh toán
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Giá tiền</div>
                        <div className="text-2xl font-bold text-purple-600">{detailData.Amount?.toLocaleString('vi-VN') || '-'} ₫</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trạng thái</div>
                        <select
                          value={selectedStatus || detailData.Status}
                          onChange={e => setSelectedStatus(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white"
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => handleUpdateStatus(detailData.bookingID, selectedStatus)}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Cập nhật trạng thái
                      </button>
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
                        <span className="ml-2 text-xs text-blue-700">- {task.assignedNurseName} ({task.assignedNurseRole})</span>
                      )}
                      {!task.assignedNurseName && (
                        <span className="ml-2 text-xs text-red-600">- Chưa có nhân sự</span>
                      )}
                      {task.status && (
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${task.status === 'active' ? 'bg-blue-100 text-blue-700' : task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{task.status}</span>
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
                            <span className="text-green-600 font-medium">{task.assignedNurseName} ({task.assignedNurseRole})</span>
                          ) : (
                            <span className="text-red-500 text-sm">Chưa có nhân sự</span>
                          )}
                        </td>
                        <td className="p-2">
                          {!task.assignedNurseName ? (
                            <div className="space-y-1">
                              <select
                                value={taskAssignments[task.customizeTaskId]?.nurse || ''}
                                onChange={e => handleTaskAssign(task.customizeTaskId, 'nurse', e.target.value)}
                                className="w-full px-2 py-1 rounded border text-xs"
                              >
                                <option value="">Chọn Y tá</option>
                                {nurses.map(n => (
                                  <option key={n.NursingID || n.nursingID} value={n.NursingID || n.nursingID}>{n.Full_Name || n.fullName}</option>
                                ))}
                              </select>
                              <select
                                value={taskAssignments[task.customizeTaskId]?.specialist || ''}
                                onChange={e => handleTaskAssign(task.customizeTaskId, 'specialist', e.target.value)}
                                className="w-full px-2 py-1 rounded border text-xs"
                              >
                                <option value="">Chọn Chuyên gia</option>
                                {specialists.map(s => (
                                  <option key={s.NursingID || s.nursingID} value={s.NursingID || s.nursingID}>{s.Full_Name || s.fullName}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">Đã có nhân sự</span>
                          )}
                        </td>
                        <td className="p-2">{task.status}</td>
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
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ManagerBookingTab; 