'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit } from '@fortawesome/free-solid-svg-icons';

const BookingsTab = ({ bookings }) => {
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
              <tr key={booking.booking_id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">#{booking.booking_id}</td>
                <td className="px-6 py-4">{booking.customer_name}</td>
                <td className="px-6 py-4">{booking.service_name}</td>
                <td className="px-6 py-4">{new Date(booking.booking_date).toLocaleDateString('vi-VN')}</td>
                <td className="px-6 py-4 font-semibold text-green-600">{booking.total_price?.toLocaleString()} VND</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status === 'completed' ? 'Hoàn thành' :
                     booking.status === 'pending' ? 'Đang xử lý' : 'Đã hủy'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg">
                      <FontAwesomeIcon icon={faEdit} />
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
      </div>
    </div>
  );
};

export default BookingsTab;
