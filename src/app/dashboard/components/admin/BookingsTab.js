'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
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
  const account = careProfile ? accounts.find(a => a.AccountID === careProfile.AccountID) : null;
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
        <div className="mb-2"><b>Khách hàng:</b> {careProfile ? careProfile.ProfileName : '-'} {account ? `(${account.full_name})` : ''}</div>
        <div className="mb-2"><b>Điện thoại:</b> {account?.phone_number || careProfile?.PhoneNumber || '-'}</div>
        <div className="mb-2"><b>Địa chỉ:</b> {careProfile?.Address || '-'}</div>
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
      </div>
    </div>
  );
};

const BookingsTab = ({ bookings }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Booking</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Tổng booking</h3>
          <p className="text-3xl font-bold">{bookings.length}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Đã hoàn thành</h3>
          <p className="text-3xl font-bold">{bookings.filter(b => b.Status === 'completed').length}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Đang xử lý</h3>
          <p className="text-3xl font-bold">{bookings.filter(b => b.Status === 'pending').length}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Mã booking</th>
              <th className="px-6 py-3 text-left">Khách hàng</th>
              <th className="px-6 py-3 text-left">Dịch vụ</th>
              <th className="px-6 py-3 text-left">Ngày đặt</th>
              <th className="px-6 py-3 text-left">Giá tiền</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings && bookings.length > 0 ? bookings.map((booking, index) => {
              const careProfile = careProfiles.find(c => c.CareProfileID === booking.CareProfileID);
              const account = careProfile ? accounts.find(a => a.AccountID === careProfile.AccountID) : null;
              return (
                <tr key={booking.BookingID || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">#{booking.BookingID}</td>
                  <td className="px-6 py-4">{careProfile ? careProfile.ProfileName : '-'}</td>
                  <td className="px-6 py-4">{
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
                  }</td>
                  <td className="px-6 py-4">{booking.CreatedAt ? new Date(booking.CreatedAt).toLocaleDateString('vi-VN') : '-'}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">{booking.Amount?.toLocaleString('vi-VN') || '-'} VND</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                      <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg" onClick={() => setSelectedBooking(booking)}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">Không có dữ liệu booking</td>
              </tr>
            )}
          </tbody>
        </table>
        <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      </div>
    </div>
  );
};

export default BookingsTab;
