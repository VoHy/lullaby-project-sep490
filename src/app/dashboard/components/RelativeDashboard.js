'use client';

import { useState } from 'react';
import Link from 'next/link';

const RelativeDashboard = ({ user }) => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      age: 75,
      relationship: 'Cha',
      lastCheckup: '2023-09-28',
      status: 'stable'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      age: 68,
      relationship: 'Mẹ',
      lastCheckup: '2023-10-05',
      status: 'needs-attention'
    }
  ]);

  const [upcomingBookings, setUpcomingBookings] = useState([
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      nurseName: 'Lê Thị X',
      date: '2023-10-15',
      time: '09:00 - 11:00',
      status: 'confirmed'
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      nurseName: 'Phạm Văn Y',
      date: '2023-10-16',
      time: '14:00 - 16:00',
      status: 'pending'
    }
  ]);

  const [recentReports, setRecentReports] = useState([
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      date: '2023-10-01',
      title: 'Báo cáo sức khỏe hàng tuần',
      nurseName: 'Lê Thị X'
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      date: '2023-09-30',
      title: 'Báo cáo kiểm tra huyết áp',
      nurseName: 'Phạm Văn Y'
    }
  ]);

  return (
    <div>
      {/* Thông tin bệnh nhân */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Bệnh nhân của tôi</h3>
          <p className="text-sm text-gray-500">Danh sách bệnh nhân mà bạn quản lý</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tuổi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mối quan hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khám gần nhất
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
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        {patient.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.age}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.relationship}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(patient.lastCheckup).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.status === 'stable' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {patient.status === 'stable' ? 'Ổn định' : 'Cần theo dõi'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    <Link href={`/dashboard/patients/${patient.id}`} className="hover:underline mr-3">
                      Xem hồ sơ
                    </Link>
                    <Link href={`/booking/new?patientId=${patient.id}`} className="hover:underline">
                      Đặt lịch
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t">
          <Link href="/dashboard/patients/add" className="text-blue-600 hover:underline text-sm">
            + Thêm bệnh nhân mới
          </Link>
        </div>
      </div>

      {/* Lịch hẹn sắp tới */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Lịch hẹn sắp tới</h3>
            <p className="text-sm text-gray-500">Các lịch hẹn đã đặt</p>
          </div>
          <div className="p-6 space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{booking.patientName}</h4>
                    <p className="text-sm text-gray-600">Y tá: {booking.nurseName}</p>
                  </div>
                  <div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status === 'confirmed' ? 'Đã xác nhận' : 'Đang chờ'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {new Date(booking.date).toLocaleDateString('vi-VN')} | {booking.time}
                </div>
                <div className="mt-3">
                  <Link href={`/dashboard/bookings/${booking.id}`} className="text-blue-600 hover:underline text-sm">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t">
            <Link href="/booking/new" className="text-blue-600 hover:underline text-sm">
              + Đặt lịch mới
            </Link>
          </div>
        </div>

        {/* Báo cáo y tế gần đây */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Báo cáo y tế gần đây</h3>
            <p className="text-sm text-gray-500">Báo cáo từ y tá</p>
          </div>
          <div className="p-6 space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{report.title}</h4>
                    <p className="text-sm text-gray-600">Bệnh nhân: {report.patientName}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(report.date).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-600">Báo cáo bởi: {report.nurseName}</p>
                <div className="mt-3">
                  <Link href={`/medical-report/${report.id}`} className="text-blue-600 hover:underline text-sm">
                    Xem báo cáo
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t">
            <Link href="/medical-report" className="text-blue-600 hover:underline text-sm">
              Xem tất cả báo cáo →
            </Link>
          </div>
        </div>
      </div>

      {/* Các tính năng chính */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/booking/new" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Đặt lịch y tá</h3>
          <p className="text-gray-600 text-sm">Tìm và đặt lịch với y tá phù hợp</p>
        </Link>
        <Link href="/nurse/search" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Tìm y tá</h3>
          <p className="text-gray-600 text-sm">Tìm kiếm y tá theo kỹ năng và đánh giá</p>
        </Link>
        <Link href="/payments/history" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Lịch sử thanh toán</h3>
          <p className="text-gray-600 text-sm">Xem lịch sử và quản lý thanh toán</p>
        </Link>
      </div>
    </div>
  );
};

export default RelativeDashboard; 