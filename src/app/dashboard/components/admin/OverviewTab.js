'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faCalendar, faMoneyBill, faUserCheck, faArrowUp, faArrowDown,
  faChartLine, faClock, faStar, faExclamationTriangle, faStethoscope
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import careProfiles from '@/mock/CareProfile';
import accounts from '@/mock/Account';
import serviceTypes from '@/mock/ServiceType';
import customerPackages from '@/mock/CustomerPackage';
import customerTasks from '@/mock/CustomerTask';
import serviceTasks from '@/mock/ServiceTask';
import nursingSpecialists from '@/mock/NursingSpecialist';

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
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
              <h4 className="font-semibold text-orange-800 mb-2">Danh sách dịch vụ</h4>
              <div className="max-h-40 overflow-y-auto">
                {serviceTasksOfBooking.length === 0 ? (
                  <p className="text-gray-400 text-xs">Không có dịch vụ.</p>
                ) : (
                  <ul className="space-y-2">
                    {serviceTasksOfBooking.map((task, idx) => (
                      <li key={idx} className="text-sm bg-white p-2 rounded border">
                        <div className="font-medium">{task?.Description}</div>
                        <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                          <span>{task?.price?.toLocaleString()}đ</span>
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
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-right">
          <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend, trendValue, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
        <FontAwesomeIcon icon={icon} className="text-white text-xl" />
      </div>
      <div className="text-right">
        {trend && (
          <div className={`flex items-center text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            <FontAwesomeIcon icon={trend === 'up' ? faArrowUp : faArrowDown} className="mr-1" />
            {trendValue}
          </div>
        )}
      </div>
    </div>
    <div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const OverviewTab = ({ accounts, bookings, revenue }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const statsCards = [
    {
      title: 'Tổng số người dùng',
      value: accounts.length,
      icon: faUsers,
      color: 'from-blue-500 to-cyan-500',
      trend: 'up',
      trendValue: '+12%',
      subtitle: 'So với tháng trước'
    },
    {
      title: 'Booking trong tháng',
      value: bookings.length,
      icon: faCalendar,
      color: 'from-green-500 to-emerald-500',
      trend: 'up',
      trendValue: '+8%',
      subtitle: 'Tăng so với tháng trước'
    },
    {
      title: 'Doanh thu tháng',
      value: `${revenue.monthly.toLocaleString()} VND`,
      icon: faMoneyBill,
      color: 'from-purple-500 to-pink-500',
      trend: 'up',
      trendValue: '+15%',
      subtitle: 'Tăng so với tháng trước'
    },
    {
      title: 'Người dùng hoạt động',
      value: accounts.filter(acc => acc.status === 'active').length,
      icon: faUserCheck,
      color: 'from-orange-500 to-red-500',
      trend: 'up',
      trendValue: '+5%',
      subtitle: 'Tỷ lệ hoạt động cao'
    }
  ];

  const recentBookings = bookings.slice(0, 5);
  const recentUsers = accounts.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
            <FontAwesomeIcon icon={faUsers} className="text-2xl text-blue-500 mb-2" />
            <div className="text-sm font-medium">Thêm User</div>
          </button>
          <button className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
            <FontAwesomeIcon icon={faCalendar} className="text-2xl text-green-500 mb-2" />
            <div className="text-sm font-medium">Tạo Booking</div>
          </button>
          <button className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
            <FontAwesomeIcon icon={faStethoscope} className="text-2xl text-purple-500 mb-2" />
            <div className="text-sm font-medium">Quản lý Dịch vụ</div>
          </button>
          <button className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
            <FontAwesomeIcon icon={faChartLine} className="text-2xl text-orange-500 mb-2" />
            <div className="text-sm font-medium">Xem Báo cáo</div>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Booking gần đây</h3>
            <span className="text-sm text-gray-500">{currentTime.toLocaleTimeString('vi-VN')}</span>
          </div>
          <div className="space-y-3">
            {recentBookings.length > 0 ? recentBookings.map((booking, index) => (
              <button 
                key={booking.BookingID || index} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl w-full text-left hover:from-blue-100 hover:to-cyan-100 transition-all duration-300" 
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faCalendar} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {(() => {
                        const careProfile = careProfiles.find(c => c.CareProfileID === booking.CareProfileID);
                        return careProfile?.ProfileName || '-';
                      })()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {(() => {
                        if (booking.CustomizePackageID) {
                          const pkg = customerPackages.find(p => p.CustomizePackageID === booking.CustomizePackageID);
                          return pkg ? pkg.Name : '-';
                        } else if (booking.CareProfileID) {
                          const service = serviceTypes.find(s => s.ServiceID === booking.CareProfileID);
                          return service ? service.ServiceName : '-';
                        }
                        return '-';
                      })()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-green-600 font-semibold">{booking.Amount?.toLocaleString('vi-VN') || '-'} VND</span>
                  <div className="text-xs text-gray-500 mt-1">
                    {booking.CreatedAt ? new Date(booking.CreatedAt).toLocaleDateString('vi-VN') : '-'}
                  </div>
                </div>
              </button>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <FontAwesomeIcon icon={faCalendar} className="text-4xl text-gray-300 mb-2" />
                <p>Chưa có booking nào</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Người dùng mới</h3>
            <span className="text-sm text-gray-500">{currentTime.toLocaleTimeString('vi-VN')}</span>
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? recentUsers.map((account, index) => (
              <div key={account.AccountID || index} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {account.avatar_url ? (
                      <img
                        src={account.avatar_url}
                        alt={account.full_name}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    ) : (
                      account.full_name?.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{account.full_name}</p>
                    <p className="text-sm text-gray-600">{account.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {account.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                </span>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <FontAwesomeIcon icon={faUsers} className="text-4xl text-gray-300 mb-2" />
                <p>Chưa có người dùng nào</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Trạng thái hệ thống</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <FontAwesomeIcon icon={faChartLine} className="text-2xl text-green-500 mb-2" />
            <div className="text-sm font-medium text-green-800">Hệ thống</div>
            <div className="text-xs text-green-600">Hoạt động bình thường</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <FontAwesomeIcon icon={faClock} className="text-2xl text-blue-500 mb-2" />
            <div className="text-sm font-medium text-blue-800">Uptime</div>
            <div className="text-xs text-blue-600">99.9%</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <FontAwesomeIcon icon={faStar} className="text-2xl text-yellow-500 mb-2" />
            <div className="text-sm font-medium text-yellow-800">Đánh giá</div>
            <div className="text-xs text-yellow-600">4.8/5.0</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-purple-500 mb-2" />
            <div className="text-sm font-medium text-purple-800">Cảnh báo</div>
            <div className="text-xs text-purple-600">0</div>
          </div>
        </div>
      </div>

      <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  );
};

export default OverviewTab;