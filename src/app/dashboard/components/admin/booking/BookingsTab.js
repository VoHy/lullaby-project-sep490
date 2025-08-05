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
// import customizeTaskService from '@/services/api/customizeTaskService';
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
          // customizeTasksData,
          serviceTasksData,
          nursingSpecialistsData
        ] = await Promise.all([
          careProfileService.getCareProfiles(),
          accountService.getAllAccounts(),
          serviceTypeService.getServiceTypes(),
          customizePackageService.getCustomizePackages(),
          // customizeTaskService.getCustomizeTasks(),
          serviceTaskService.getServiceTasks(),
          nursingSpecialistService.getNursingSpecialists()
        ]);

        setCareProfiles(careProfilesData);
        setAccounts(accountsData);
        setServiceTypes(serviceTypesData);
        setCustomizePackages(customizePackagesData);
        // setCustomizeTasks(customizeTasksData);
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
    const careProfile = careProfiles.find(c => c.CareProfileID === booking.CareProfileID);
    const account = careProfile ? accounts.find(a => a.AccountID === careProfile.AccountID) : null;
    let service = null;
    let packageInfo = null;
    if (booking.CustomizePackageID) {
      packageInfo = customizePackages.find(p => p.CustomizePackageID === booking.CustomizePackageID);
      service = serviceTypes.find(s => s.ServiceID === packageInfo?.ServiceID);
    } else if (booking.CareProfileID) {
      service = serviceTypes.find(s => s.ServiceID === booking.CareProfileID);
    }
    // const customizeTasksOfBooking = customizeTasks.filter(t => t.BookingID === booking.BookingID);
    // const serviceTasksOfBooking = customizeTasksOfBooking.map(task => {
    //   const serviceTask = serviceTasks.find(st => st.ServiceTaskID === task.ServiceTaskID);
    //   const nurse = nursingSpecialists.find(n => n.NursingID === task.NursingID);
    //   return {
    //     ...serviceTask,
    //     price: task.Price,
    //     quantity: task.Quantity,
    //     total: task.Total,
    //     status: task.Status,
    //     nurseName: nurse?.FullName,
    //     nurseRole: nurse?.Major
    //   };
    // });
    return { careProfile, account, service, packageInfo, serviceTasksOfBooking };
  }

  const BookingDetailModal = ({ booking, onClose }) => {
    if (!booking) return null;
    const { careProfile, account, service, packageInfo, serviceTasksOfBooking } = getBookingDetail(booking);
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
          <button className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 text-2xl font-bold" onClick={onClose}>&times;</button>
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Chi tiết Booking #{booking.BookingID}</h3>
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
                    <span>{careProfile ? careProfile.ProfileName : '-'} {account ? `(${account.full_name})` : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Điện thoại:</span>
                    <span>{account?.phone_number || careProfile?.PhoneNumber || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Địa chỉ:</span>
                    <span className="text-right">{careProfile?.Address || '-'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Thông tin dịch vụ
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Dịch vụ:</span>
                    <span>{packageInfo ? packageInfo.Name : (service?.ServiceName || '-')}</span>
                  </div>
                  {packageInfo && (
                    <div className="flex justify-between">
                      <span className="font-medium">Mô tả:</span>
                      <span className="text-right">{packageInfo.Description}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày đặt:</span>
                    <span>{new Date(booking.BookingDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Trạng thái:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.Status === 'completed' ? 'bg-green-100 text-green-700' :
                      booking.Status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.Status === 'completed' ? 'Hoàn thành' :
                       booking.Status === 'pending' ? 'Đang xử lý' : 'Đã hủy'}
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
                    <span className="font-bold text-green-600">{booking.TotalPrice?.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Phương thức:</span>
                    <span>{booking.PaymentMethod || 'Chưa thanh toán'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Trạng thái thanh toán:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.PaymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                      booking.PaymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.PaymentStatus === 'paid' ? 'Đã thanh toán' :
                       booking.PaymentStatus === 'pending' ? 'Chờ thanh toán' : 'Chưa thanh toán'}
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
                  <div className="space-y-2">
                    {serviceTasksOfBooking.map((task, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-gray-800">{task.Description}</div>
                            <div className="text-sm text-gray-600">
                              {task.nurseName} ({task.nurseRole})
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">{task.total?.toLocaleString()} VNĐ</div>
                            <div className="text-xs text-gray-500">
                              {task.quantity} x {task.price?.toLocaleString()} VNĐ
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            task.status === 'completed' ? 'bg-green-100 text-green-700' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.status === 'completed' ? 'Hoàn thành' :
                             task.status === 'in_progress' ? 'Đang thực hiện' : 'Chờ thực hiện'}
                          </span>
                        </div>
                      </div>
                    ))}
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

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Tính toán thống kê
  const totalBookings = bookings?.length || 0;
  const completedBookings = bookings?.filter(b => b.Status === 'completed').length || 0;
  const pendingBookings = bookings?.filter(b => b.Status === 'pending').length || 0;
  const totalRevenue = bookings?.reduce((sum, b) => sum + (b.TotalPrice || 0), 0) || 0;

  // Lọc bookings
  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = !searchTerm || 
      booking.BookingID.toString().includes(searchTerm) ||
      getBookingDetail(booking).careProfile?.ProfileName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.Status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6">
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
                return (
                  <tr key={booking.BookingID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{booking.BookingID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{careProfile?.ProfileName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{account?.phone_number || careProfile?.PhoneNumber || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {packageInfo ? packageInfo.Name : (service?.ServiceName || 'N/A')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.BookingDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {booking.TotalPrice?.toLocaleString()} VNĐ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.Status === 'completed' ? 'bg-green-100 text-green-700' :
                        booking.Status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.Status === 'completed' ? 'Hoàn thành' :
                         booking.Status === 'pending' ? 'Đang xử lý' : 'Đã hủy'}
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
    </div>
  );
};

export default BookingsTab;
