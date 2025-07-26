'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, faEdit, faTrash, faSearch, faCalendarAlt,
  faMoneyBill, faUser, faClock, faCheckCircle, faTimesCircle, faExclamationTriangle
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
  const account = careProfile ? accounts.find(a => a.AccountID === careProfile.AccountID) : null;
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
                  <span>{booking.CreatedAt ? new Date(booking.CreatedAt).toLocaleString('vi-VN') : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ngày thực hiện:</span>
                  <span>{booking.WorkDate ? new Date(booking.WorkDate).toLocaleString('vi-VN') : '-'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trạng thái và giá tiền */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                Trạng thái & Giá tiền
              </h4>
              <div className="space-y-3">
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
                  <span className="text-xl font-bold text-green-600">{booking.Amount?.toLocaleString('vi-VN') || '-'} VND</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Thời gian tạo:</span>
                  <span className="text-sm text-gray-600">{booking.CreatedAt ? new Date(booking.CreatedAt).toLocaleString('vi-VN') : '-'}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                Danh sách dịch vụ
              </h4>
              <div className="max-h-40 overflow-y-auto">
                {serviceTasksOfBooking.length === 0 ? (
                  <p className="text-gray-400 text-xs">Không có dịch vụ.</p>
                ) : (
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
                )}
              </div>
            </div>
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

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
        <FontAwesomeIcon icon={icon} className="text-white text-xl" />
      </div>
    </div>
    <div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const BookingsTab = ({ bookings }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = (() => {
      const careProfile = careProfiles.find(c => c.CareProfileID === booking.CareProfileID);
      const customerName = careProfile?.ProfileName || '';
      return customerName.toLowerCase().includes(searchTerm.toLowerCase());
    })();
    
    const matchesStatus = statusFilter === 'all' || booking.Status === statusFilter;
    
    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      const bookingDate = new Date(booking.CreatedAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      switch (dateFilter) {
        case 'today':
          return bookingDate.toDateString() === today.toDateString();
        case 'yesterday':
          return bookingDate.toDateString() === yesterday.toDateString();
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return bookingDate >= weekAgo;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = [
    {
      title: 'Tổng booking',
      value: bookings.length,
      icon: faCalendarAlt,
      color: 'from-blue-500 to-cyan-500',
      subtitle: 'Tất cả thời gian'
    },
    {
      title: 'Đã hoàn thành',
      value: bookings.filter(b => b.Status === 'completed').length,
      icon: faCheckCircle,
      color: 'from-green-500 to-emerald-500',
      subtitle: 'Thành công'
    },
    {
      title: 'Đang xử lý',
      value: bookings.filter(b => b.Status === 'pending').length,
      icon: faExclamationTriangle,
      color: 'from-yellow-500 to-orange-500',
      subtitle: 'Chờ xử lý'
    },
    {
      title: 'Đã hủy',
      value: bookings.filter(b => b.Status === 'cancelled').length,
      icon: faTimesCircle,
      color: 'from-red-500 to-pink-500',
      subtitle: 'Đã hủy'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
        </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
        </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tất cả thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="yesterday">Hôm qua</option>
            <option value="week">Tuần này</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
          <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <tr>
                <th className="px-6 py-4 text-left font-semibold">Mã booking</th>
                <th className="px-6 py-4 text-left font-semibold">Khách hàng</th>
                <th className="px-6 py-4 text-left font-semibold">Dịch vụ</th>
                <th className="px-6 py-4 text-left font-semibold">Ngày đặt</th>
                <th className="px-6 py-4 text-left font-semibold">Giá tiền</th>
                <th className="px-6 py-4 text-left font-semibold">Trạng thái</th>
                <th className="px-6 py-4 text-center font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
              {filteredBookings.length > 0 ? filteredBookings.map((booking, index) => {
              const careProfile = careProfiles.find(c => c.CareProfileID === booking.CareProfileID);
              const account = careProfile ? accounts.find(a => a.AccountID === careProfile.AccountID) : null;
                
              return (
                  <tr key={booking.BookingID || index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 font-medium text-purple-600">#{booking.BookingID}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {careProfile?.ProfileName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{careProfile ? careProfile.ProfileName : '-'}</p>
                          <p className="text-sm text-gray-600">{account?.email || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">
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
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.CreatedAt ? new Date(booking.CreatedAt).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-green-600">{booking.Amount?.toLocaleString('vi-VN') || '-'} VND</span>
                    </td>
                  <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.Status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.Status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.Status === 'completed' ? 'Hoàn thành' :
                       booking.Status === 'pending' ? 'Đang xử lý' : 'Đã hủy'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                        <button 
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200" 
                          onClick={() => setSelectedBooking(booking)}
                          title="Xem chi tiết"
                        >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                        <button 
                          className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                          title="Chỉnh sửa"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button 
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Xóa"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl text-gray-300 mb-4" />
                    <p className="text-lg">Không có dữ liệu booking</p>
                    <p className="text-sm">Thử thay đổi bộ lọc để xem kết quả khác</p>
                  </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  );
};

export default BookingsTab;
