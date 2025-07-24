'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import careProfiles from '@/mock/CareProfile';
import accounts from '@/mock/Account';
import serviceTypes from '@/mock/ServiceType';
import customerPackages from '@/mock/CustomerPackage';

function getBookingDetail(booking) {
  const careProfile = careProfiles.find(c => c.CareID === booking.CareProfileID);
  const account = accounts.find(a => a.AccountID === careProfile?.AccountID);
  let service = null;
  let packageInfo = null;
  if (booking.CustomizePackageID) {
    packageInfo = customerPackages.find(p => p.CustomizePackageID === booking.CustomizePackageID);
    service = serviceTypes.find(s => s.ServiceID === packageInfo?.ServiceID);
  } else if (booking.CareProfileID) {
    service = serviceTypes.find(s => s.ServiceID === booking.CareProfileID);
  }
  return { careProfile, account, service, packageInfo };
}

const BookingDetailModal = ({ booking, onClose }) => {
  if (!booking) return null;
  const { careProfile, account, service, packageInfo } = getBookingDetail(booking);
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-pink-500 text-xl" onClick={onClose}>&times;</button>
        <h3 className="text-xl font-bold mb-4">Chi tiết Booking #{booking.BookingID}</h3>
        <div className="mb-2"><b>Khách hàng:</b> {careProfile?.Care_Name} ({account?.full_name})</div>
        <div className="mb-2"><b>Điện thoại:</b> {careProfile?.PhoneNumber}</div>
        <div className="mb-2"><b>Địa chỉ:</b> {careProfile?.Address}</div>
        <div className="mb-2"><b>Dịch vụ:</b> {packageInfo ? packageInfo.Name : (service?.ServiceName || '-')}</div>
        {packageInfo && <div className="mb-2"><b>Chi tiết gói:</b> {packageInfo.Description}</div>}
        <div className="mb-2"><b>Ngày đặt:</b> {booking.booking_date ? new Date(booking.booking_date).toLocaleString('vi-VN') : '-'}</div>
        <div className="mb-2"><b>Ngày thực hiện:</b> {booking.work_date ? new Date(booking.work_date).toLocaleString('vi-VN') : '-'}</div>
        <div className="mb-2"><b>Giá tiền:</b> {booking.total_price?.toLocaleString('vi-VN') || '-'} VND</div>
        <div className="mb-2"><b>Trạng thái:</b> <span className={`px-2 py-1 rounded text-xs font-bold ${booking.status === 'completed' ? 'bg-green-100 text-green-700' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{booking.status === 'completed' ? 'Hoàn thành' : booking.status === 'pending' ? 'Đang xử lý' : 'Đã hủy'}</span></div>
        <div className="mt-4 text-right">
          <button className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow" onClick={onClose}>Đóng</button>
        </div>
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
          <p className="text-3xl font-bold">{bookings.filter(b => b.status === 'completed').length}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Đang xử lý</h3>
          <p className="text-3xl font-bold">{bookings.filter(b => b.status === 'pending').length}</p>
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
            {bookings && bookings.length > 0 ? bookings.map((booking, index) => (
              <tr key={booking.BookingID || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">#{booking.BookingID}</td>
                <td className="px-6 py-4">{
                  (() => {
                    const careProfile = careProfiles.find(c => c.CareProfileID === booking.CareProfileID);
                    return careProfile?.Care_Name || '-';
                  })()
                }</td>
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
                <td className="px-6 py-4">{booking.booking_date ? new Date(booking.booking_date).toLocaleDateString('vi-VN') : '-'}</td>
                <td className="px-6 py-4 font-semibold text-green-600">{booking.total_price?.toLocaleString('vi-VN') || '-'} VND</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {booking.status === 'completed' ? 'Hoàn thành' :
                     booking.status === 'pending' ? 'Đang xử lý' : 'Đã hủy'}
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
            )) : (
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
