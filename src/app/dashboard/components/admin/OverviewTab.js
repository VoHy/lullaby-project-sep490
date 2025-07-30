'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faCalendar, faMoneyBill, faUserCheck, faArrowUp, faArrowDown,
  faChartLine, faClock, faStar, faExclamationTriangle, faStethoscope, faEye
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
// Thay thế import mock data bằng services
import careProfileService from '@/services/api/careProfileService';
import accountService from '@/services/api/accountService';
import serviceTypeService from '@/services/api/serviceTypeService';
import customerPackageService from '@/services/api/customerPackageService';
import customerTaskService from '@/services/api/customerTaskService';
import serviceTaskService from '@/services/api/serviceTaskService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';

const OverviewTab = ({ accounts, bookings, revenue }) => {
  // State cho API data
  const [careProfiles, setCareProfiles] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [customerPackages, setCustomerPackages] = useState([]);
  const [customerTasks, setCustomerTasks] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Load data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const [
          careProfilesData,
          serviceTypesData,
          customerPackagesData,
          customerTasksData,
          serviceTasksData,
          nursingSpecialistsData
        ] = await Promise.all([
          careProfileService.getCareProfiles(),
          serviceTypeService.getServiceTypes(),
          customerPackageService.getCustomerPackages(),
          customerTaskService.getCustomerTasks(),
          serviceTaskService.getServiceTasks(),
          nursingSpecialistService.getNursingSpecialists()
        ]);

        setCareProfiles(careProfilesData);
        setServiceTypes(serviceTypesData);
        setCustomerPackages(customerPackagesData);
        setCustomerTasks(customerTasksData);
        setServiceTasks(serviceTasksData);
        setNursingSpecialists(nursingSpecialistsData);
      } catch (error) {
        console.error('Error fetching admin overview data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function getBookingDetail(booking) {
    const careProfile = careProfiles.find(c => c.CareProfileID === booking.CareProfileID);
    const account = accounts.find(a => a.AccountID === careProfile?.AccountID);
    let service = null;
    let packageInfo = null;
    if (booking.CustomizePackageID) {
      packageInfo = customerPackages.find(p => p.CustomizePackageID === booking.CustomizePackageID);
      service = serviceTypes.find(s => s.ServiceID === packageInfo?.ServiceID);
    } else if (booking.CareProfileID) {
      service = serviceTypes.find(s => s.ServiceID === booking.CareProfileID);
    }
    const customerTasksOfBooking = customerTasks.filter(t => t.BookingID === booking.BookingID);
    const serviceTasksOfBooking = customerTasksOfBooking.map(task => {
      const serviceTask = serviceTasks.find(st => st.ServiceTaskID === task.ServiceTaskID);
      const nurse = nursingSpecialists.find(n => n.NursingID === task.NursingID);
      return {
        ...serviceTask,
        price: task.Price,
        quantity: task.Quantity,
        total: task.Total,
        status: task.Status,
        nurseName: nurse?.FullName,
        nurseRole: nurse?.Major
      };
    });
    return { careProfile, account, service, packageInfo, serviceTasksOfBooking };
  }

  const BookingDetailModal = ({ booking, onClose }) => {
    if (!booking) return null;
    const { careProfile, account, service, packageInfo, serviceTasksOfBooking } = getBookingDetail(booking);
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
          <button className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 text-2xl font-bold" onClick={onClose}>&times;</button>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Chi tiết Booking #{booking.BookingID}</h3>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-2">Thông tin khách hàng</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Tên:</span> {careProfile?.ProfileName} ({account?.full_name})</div>
                  <div><span className="font-medium">Điện thoại:</span> {careProfile?.PhoneNumber}</div>
                  <div><span className="font-medium">Địa chỉ:</span> {careProfile?.Address}</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-2">Thông tin dịch vụ</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Dịch vụ:</span> {packageInfo ? packageInfo.Name : (service?.ServiceName || '-')}</div>
                  {packageInfo && <div><span className="font-medium">Mô tả:</span> {packageInfo.Description}</div>}
                  <div><span className="font-medium">Ngày đặt:</span> {booking.CreatedAt ? new Date(booking.CreatedAt).toLocaleString('vi-VN') : '-'}</div>
                  <div><span className="font-medium">Ngày thực hiện:</span> {booking.WorkDate ? new Date(booking.WorkDate).toLocaleString('vi-VN') : '-'}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                <h4 className="font-semibold text-purple-800 mb-2">Trạng thái & Giá tiền</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Trạng thái:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.Status === 'completed' ? 'bg-green-100 text-green-700' : 
                      booking.Status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.Status === 'completed' ? 'Hoàn thành' : 
                       booking.Status === 'pending' ? 'Đang xử lý' : 'Đã hủy'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Tổng tiền:</span>
                    <span className="text-lg font-bold text-green-600">{booking.Amount?.toLocaleString('vi-VN') || '-'} VND</span>
                  </div>
                </div>
              </div>
              
              {serviceTasksOfBooking.length > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-orange-800 mb-2">Danh sách dịch vụ</h4>
                  <div className="max-h-40 overflow-y-auto">
                    <ul className="space-y-2">
                      {serviceTasksOfBooking.map((task, idx) => (
                        <li key={idx} className="bg-white p-3 rounded-lg border">
                          <div className="font-medium text-sm">{task?.Description}</div>
                          <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                            <span className="font-medium">{task?.price?.toLocaleString()}đ</span>
                            {task.nurseName && (
                              <span className="text-blue-700">- {task.nurseName} ({task.nurseRole})</span>
                            )}
                            {task.status && (
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                task.status === 'active' ? 'bg-blue-100 text-blue-700' : 
                                task.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                'bg-gray-100 text-gray-700'
                              }`}>{task.status}</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button className="px-6 py-2 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all duration-300" onClick={onClose}>
              Đóng
            </button>
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Cập nhật trạng thái
            </button>
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
        <p className="text-gray-600">Đang tải dữ liệu tổng quan...</p>
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

  const StatCard = ({ title, value, icon, color, trend, trendValue, subtitle }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
          <FontAwesomeIcon icon={icon} className="text-white text-xl" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            <FontAwesomeIcon icon={trend === 'up' ? faArrowUp : faArrowDown} className="mr-1" />
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-600 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  // Tính toán thống kê
  const totalUsers = accounts?.length || 0;
  const totalBookings = bookings?.length || 0;
  const totalRevenue = revenue?.total || 0;
  const activeNurses = nursingSpecialists?.filter(n => n.Status === 'active').length || 0;

  // Lấy 5 booking gần nhất
  const recentBookings = bookings?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng người dùng"
          value={totalUsers}
          icon={faUsers}
          color="from-blue-500 to-cyan-500"
          trend="up"
          trendValue="+12%"
          subtitle="So với tháng trước"
        />
        <StatCard
          title="Tổng booking"
          value={totalBookings}
          icon={faCalendar}
          color="from-green-500 to-emerald-500"
          trend="up"
          trendValue="+8%"
          subtitle="So với tháng trước"
        />
        <StatCard
          title="Doanh thu"
          value={`${totalRevenue.toLocaleString()} VNĐ`}
          icon={faMoneyBill}
          color="from-purple-500 to-pink-500"
          trend="up"
          trendValue="+15%"
          subtitle="So với tháng trước"
        />
        <StatCard
          title="Nhân viên active"
          value={activeNurses}
          icon={faUserCheck}
          color="from-orange-500 to-red-500"
          trend="up"
          trendValue="+5%"
          subtitle="So với tháng trước"
        />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Booking gần đây</h3>
          <button className="text-pink-600 hover:text-pink-700 font-semibold">
            Xem tất cả →
          </button>
        </div>
        
        <div className="space-y-4">
          {recentBookings.length > 0 ? recentBookings.map((booking) => {
            const { careProfile, account, service, packageInfo } = getBookingDetail(booking);
            return (
              <div key={booking.BookingID} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {careProfile?.ProfileName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{careProfile?.ProfileName || 'N/A'}</p>
                    <p className="text-sm text-gray-600">
                      {packageInfo ? packageInfo.Name : (service?.ServiceName || 'N/A')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{booking.Amount?.toLocaleString()} VNĐ</p>
                  <p className="text-sm text-gray-500">
                    {booking.CreatedAt ? new Date(booking.CreatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    booking.Status === 'completed' ? 'bg-green-100 text-green-700' :
                    booking.Status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {booking.Status === 'completed' ? 'Hoàn thành' :
                     booking.Status === 'pending' ? 'Đang xử lý' : 'Đã hủy'}
                  </span>
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="text-pink-600 hover:text-pink-700"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faCalendar} className="text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500">Chưa có booking nào</p>
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
    </div>
  );
};

export default OverviewTab;