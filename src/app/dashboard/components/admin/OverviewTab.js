'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendar, faMoneyBill, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
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
  // Lấy các dịch vụ con/lẻ thực tế từ CustomerTask
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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-pink-500 text-xl" onClick={onClose}>&times;</button>
        <h3 className="text-xl font-bold mb-4">Chi tiết Booking #{booking.BookingID}</h3>
        <div className="mb-2"><b>Khách hàng:</b> {careProfile?.ProfileName} ({account?.full_name})</div>
        <div className="mb-2"><b>Điện thoại:</b> {careProfile?.PhoneNumber}</div>
        <div className="mb-2"><b>Địa chỉ:</b> {careProfile?.Address}</div>
        <div className="mb-2"><b>Dịch vụ:</b> {packageInfo ? packageInfo.Name : (service?.ServiceName || '-')}</div>
        {packageInfo && <div className="mb-2"><b>Mô tả gói:</b> {packageInfo.Description}</div>}
        <div className="mb-2"><b>Ngày đặt:</b> {booking.CreatedAt ? new Date(booking.CreatedAt).toLocaleString('vi-VN') : '-'}</div>
        <div className="mb-2"><b>Ngày thực hiện:</b> {booking.WorkDate ? new Date(booking.WorkDate).toLocaleString('vi-VN') : '-'}</div>
        <div className="mb-2"><b>Trạng thái:</b> <span className={`px-2 py-1 rounded text-xs font-bold ${booking.Status === 'completed' ? 'bg-green-100 text-green-700' : booking.Status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{booking.Status === 'completed' ? 'Hoàn thành' : booking.Status === 'pending' ? 'Đang xử lý' : 'Đã hủy'}</span></div>
        <div className="mb-2"><b>Danh sách dịch vụ:</b></div>
        <ul className="list-disc ml-6 mt-1">
          {serviceTasksOfBooking.length === 0 && <li className="text-gray-400 text-xs">Không có dịch vụ.</li>}
          {serviceTasksOfBooking.map((task, idx) => (
            <li key={idx} className="text-sm">
              {task?.Description} <span className="text-xs text-gray-500">({task?.price?.toLocaleString()}đ)</span>
              {task.nurseName && (
                <span className="ml-2 text-xs text-blue-700">- {task.nurseName} ({task.nurseRole})</span>
              )}
              {task.status && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${task.status === 'active' ? 'bg-blue-100 text-blue-700' : task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{task.status}</span>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right">
          <button className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

const OverviewTab = ({ accounts, bookings, revenue }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const statsCards = [
    {
      title: 'Tổng số người dùng',
      value: accounts.length,
      icon: faUsers,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'Booking trong tháng',
      value: bookings.length,
      icon: faCalendar,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600'
    },
    {
      title: 'Doanh thu tháng',
      value: `${revenue.monthly.toLocaleString()} VND`,
      icon: faMoneyBill,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600'
    },
    {
      title: 'Người dùng hoạt động',
      value: accounts.filter(acc => acc.status === 'active').length,
      icon: faUserCheck,
      color: 'from-pink-500 to-pink-600',
      textColor: 'text-pink-600'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tổng quan hệ thống</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <FontAwesomeIcon icon={stat.icon} className="text-white text-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Booking gần đây</h3>
          <div className="space-y-3">
            {bookings && bookings.length > 0 ? bookings.slice(0, 5).map((booking, index) => (
              <button key={booking.BookingID || index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm w-full text-left hover:bg-blue-100 transition" onClick={() => setSelectedBooking(booking)}>
                <div>
                  <p className="font-medium text-gray-800">{
                    (() => {
                      const careProfile = careProfiles.find(c => c.CareProfileID === booking.CareProfileID);
                      return careProfile?.ProfileName || '-';
                    })()
                  }</p>
                  <p className="text-sm text-gray-600">{
                    (() => {
                      if (booking.CustomizePackageID) {
                        const pkg = customerPackages.find(p => p.CustomizePackageID === booking.CustomizePackageID);
                        return pkg ? pkg.Name : '-';
                      } else if (booking.CareProfileID) {
                        const service = serviceTypes.find(s => s.ServiceID === booking.CareProfileID);
                        return service ? service.ServiceName : '-';
                      }
                      return '-';
                    })()
                  }</p>
                </div>
                <span className="text-blue-600 font-semibold">{booking.Amount?.toLocaleString('vi-VN') || '-'} VND</span>
              </button>
            )) : (
              <p className="text-gray-500 text-center">Chưa có booking nào</p>
            )}
            <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-purple-800">Người dùng mới</h3>
          <div className="space-y-3">
            {accounts && accounts.length > 0 ? accounts.slice(0, 5).map((account, index) => (
              <div key={account.AccountID || index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {account.full_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{account.full_name}</p>
                    <p className="text-sm text-gray-600">{account.Email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {account.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-center">Chưa có người dùng nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;