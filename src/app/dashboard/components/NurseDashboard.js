'use client';

import { useState } from 'react';
import Link from 'next/link';

const NurseDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalPatients: 12,
    activeBookings: 4,
    completedBookings: 36,
    totalEarnings: '8.650.000 đ',
    upcomingBookings: [
      {
        id: 1,
        patientName: 'Trần Văn A',
        date: '2023-10-15',
        time: '09:00 - 11:00',
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        status: 'confirmed'
      },
      {
        id: 2,
        patientName: 'Lê Thị B',
        date: '2023-10-16',
        time: '14:00 - 16:00',
        address: '456 Lê Lợi, Quận 1, TP.HCM',
        status: 'confirmed'
      },
      {
        id: 3,
        patientName: 'Phạm Văn C',
        date: '2023-10-17',
        time: '08:00 - 10:00',
        address: '789 Nguyễn Du, Quận 3, TP.HCM',
        status: 'pending'
      }
    ],
    recentReviews: [
      {
        id: 1,
        patientName: 'Trần Văn X',
        date: '2023-10-01',
        rating: 5,
        comment: 'Y tá rất tận tâm và chuyên nghiệp!'
      },
      {
        id: 2,
        patientName: 'Lê Thị Y',
        date: '2023-09-28',
        rating: 4,
        comment: 'Dịch vụ tốt, đúng giờ.'
      }
    ]
  });

  // Render stars for rating
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <span key={index} className={`text-${index < rating ? 'yellow' : 'gray'}-500`}>★</span>
    ));
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Thống kê */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Bệnh nhân</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Tổng số</p>
            <p className="text-2xl font-bold">{stats.totalPatients}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Đặt lịch hiện tại</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Đang hoạt động</p>
            <p className="text-2xl font-bold">{stats.activeBookings}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Lịch đã hoàn thành</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Tổng số</p>
            <p className="text-2xl font-bold">{stats.completedBookings}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Thu nhập</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Tổng thu</p>
            <p className="text-2xl font-bold">{stats.totalEarnings}</p>
          </div>
        </div>
      </div>

      {/* Lịch sắp tới */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Lịch sắp tới</h3>
          <p className="text-sm text-gray-500">Các lịch hẹn sắp tới của bạn</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bệnh nhân
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày & Giờ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.upcomingBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.patientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(booking.date).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-sm text-gray-500">{booking.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status === 'confirmed' ? 'Đã xác nhận' : 'Đang chờ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    <Link href={`/dashboard/bookings/${booking.id}`} className="hover:underline">
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t">
          <Link href="/dashboard/bookings" className="text-blue-600 hover:underline text-sm">
            Xem tất cả lịch hẹn →
          </Link>
        </div>
      </div>

      {/* Đánh giá gần đây */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Đánh giá gần đây</h3>
          <p className="text-sm text-gray-500">Đánh giá từ bệnh nhân</p>
        </div>
        <div className="p-6 space-y-6">
          {stats.recentReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{review.patientName}</h4>
                  <div className="text-yellow-400 mt-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString('vi-VN')}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 border-t">
          <Link href="/dashboard/reviews" className="text-blue-600 hover:underline text-sm">
            Xem tất cả đánh giá →
          </Link>
        </div>
      </div>

      {/* Các tính năng */}
    </div>
  );
};

export default NurseDashboard; 