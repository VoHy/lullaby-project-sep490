import React, { useState } from 'react';
import bookingsData from '@/mock/Booking';
import accounts from '@/mock/Account';

const nurses = accounts.filter(acc => acc.role_id === 2);
const specialists = accounts.filter(acc => acc.role_id === 5);

const statusOptions = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'accepted', label: 'Đã nhận' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const ManagerBookingTab = () => {
  const [bookings] = useState(bookingsData);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleViewDetail = (booking) => {
    setDetailData(booking);
    setSelectedNurse('');
    setSelectedSpecialist('');
    setSelectedStatus(booking.status);
    setShowDetail(true);
  };
  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailData(null);
  };
  const handleAccept = () => {
    const nurse = nurses.find(n => n.AccountID === Number(selectedNurse));
    const specialist = specialists.find(s => s.AccountID === Number(selectedSpecialist));
    alert(`Đã gán:\nNurse: ${nurse ? nurse.full_name : 'Chưa chọn'}\nSpecialist: ${specialist ? specialist.full_name : 'Chưa chọn'}\nStatus: ${selectedStatus}`);
    setShowDetail(false);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Danh sách Booking</h3>
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
          {bookings.map(booking => (
            <tr key={booking.booking_id} className="hover:bg-gray-50">
              <td className="px-6 py-4">#{booking.booking_id}</td>
              <td className="px-6 py-4">{booking.customer_name}</td>
              <td className="px-6 py-4">{booking.service_name}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {statusOptions.find(opt => opt.value === booking.status)?.label || booking.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button onClick={() => handleViewDetail(booking)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded hover:shadow-lg">Xem chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Popup chi tiết booking */}
      {showDetail && detailData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={handleCloseDetail}>&times;</button>
            <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">Chi tiết Booking #{detailData.booking_id}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-6">
              <div className="font-medium text-gray-600">Khách hàng:</div>
              <div>{detailData.customer_name}</div>
              <div className="font-medium text-gray-600">Dịch vụ:</div>
              <div>{detailData.service_name}</div>
              <div className="font-medium text-gray-600">Ngày đặt:</div>
              <div>{new Date(detailData.booking_date).toLocaleString('vi-VN')}</div>
              <div className="font-medium text-gray-600">Ngày làm việc:</div>
              <div>{new Date(detailData.work_date).toLocaleString('vi-VN')}</div>
              <div className="font-medium text-gray-600">Giá tiền:</div>
              <div>{detailData.total_price?.toLocaleString()} VND</div>
              <div className="font-medium text-gray-600">Trạng thái:</div>
              <div>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="px-2 py-1 rounded border"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-6">
              <div className="font-medium text-gray-600">Chọn Nurse:</div>
              <div>
                <select
                  value={selectedNurse}
                  onChange={e => setSelectedNurse(e.target.value)}
                  className="px-2 py-1 rounded border"
                >
                  <option value="">Chọn nurse</option>
                  {nurses.map(n => (
                    <option key={n.AccountID} value={n.AccountID}>{n.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="font-medium text-gray-600">Chọn Specialist:</div>
              <div>
                <select
                  value={selectedSpecialist}
                  onChange={e => setSelectedSpecialist(e.target.value)}
                  className="px-2 py-1 rounded border"
                >
                  <option value="">Chọn specialist</option>
                  {specialists.map(s => (
                    <option key={s.AccountID} value={s.AccountID}>{s.full_name}</option>
                  ))}
                </select>
              </div>
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
      )}
    </div>
  );
};

export default ManagerBookingTab; 