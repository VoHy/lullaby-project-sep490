'use client';

import { useState } from 'react';
import Link from 'next/link';

const SpecialistDashboard = ({ user }) => {
  const [cases, setCases] = useState([
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      age: 75,
      condition: 'Cao huyết áp, Tiểu đường',
      nurseName: 'Lê Thị X',
      priority: 'high',
      date: '2023-10-08'
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      age: 68,
      condition: 'Viêm khớp',
      nurseName: 'Phạm Văn Y',
      priority: 'medium',
      date: '2023-10-07'
    },
    {
      id: 3,
      patientName: 'Lê Văn C',
      age: 82,
      condition: 'Parkinson',
      nurseName: 'Vũ Thị Z',
      priority: 'high',
      date: '2023-10-06'
    }
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      type: 'Tư vấn từ xa',
      date: '2023-10-15',
      time: '10:00 - 10:30',
      status: 'scheduled'
    },
    {
      id: 2,
      patientName: 'Lê Văn C',
      type: 'Tư vấn từ xa',
      date: '2023-10-16',
      time: '14:00 - 14:30',
      status: 'scheduled'
    }
  ]);

  const priorityLabels = {
    high: { class: 'bg-red-100 text-red-800', text: 'Cao' },
    medium: { class: 'bg-yellow-100 text-yellow-800', text: 'Trung bình' },
    low: { class: 'bg-green-100 text-green-800', text: 'Thấp' }
  };

  const stats = {
    totalCases: 15,
    activeCases: 8,
    completedConsultations: 43,
    pendingReports: 3
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Thống kê */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Ca bệnh</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Tổng số</p>
            <p className="text-2xl font-bold">{stats.totalCases}</p>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="text-gray-600">Đang xử lý</p>
            <p className="text-xl font-semibold">{stats.activeCases}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Tư vấn</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Đã hoàn thành</p>
            <p className="text-2xl font-bold">{stats.completedConsultations}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Báo cáo</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Đang chờ</p>
            <p className="text-2xl font-bold">{stats.pendingReports}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Lịch tư vấn hôm nay</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Số lịch hẹn</p>
            <p className="text-2xl font-bold">
              {appointments.filter(a => 
                new Date(a.date).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </div>
        </div>
      </div>

      {/* Ca bệnh cần chú ý */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Ca bệnh cần chú ý</h3>
          <p className="text-sm text-gray-500">Các ca bệnh được chuyển đến cần tư vấn chuyên môn</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bệnh nhân
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tình trạng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Y tá phụ trách
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tiếp nhận
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mức ưu tiên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cases.map((caseItem) => (
                <tr key={caseItem.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {caseItem.patientName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {caseItem.age} tuổi
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{caseItem.condition}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{caseItem.nurseName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(caseItem.date).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityLabels[caseItem.priority].class}`}>
                      {priorityLabels[caseItem.priority].text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link href={`/dashboard/cases/${caseItem.id}`} className="text-blue-600 hover:underline mr-3">
                      Xem chi tiết
                    </Link>
                    <Link href={`/dashboard/cases/${caseItem.id}/report`} className="text-blue-600 hover:underline">
                      Tư vấn
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t">
          <Link href="/dashboard/cases" className="text-blue-600 hover:underline text-sm">
            Xem tất cả ca bệnh →
          </Link>
        </div>
      </div>

      {/* Lịch tư vấn */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Lịch tư vấn</h3>
          <p className="text-sm text-gray-500">Các buổi tư vấn đã lên lịch</p>
        </div>
        <div className="p-6 space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{appointment.patientName}</h4>
                  <p className="text-sm text-gray-600">{appointment.type}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(appointment.date).toLocaleDateString('vi-VN')}
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {appointment.time}
              </div>
              <div className="mt-3">
                <Link href={`/dashboard/appointments/${appointment.id}`} className="text-blue-600 hover:underline text-sm mr-3">
                  Chi tiết
                </Link>
                {new Date(appointment.date).getTime() <= new Date().getTime() + 24 * 60 * 60 * 1000 && (
                  <Link href={`/dashboard/appointments/${appointment.id}/join`} className="text-green-600 hover:underline text-sm">
                    Tham gia ngay
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 border-t">
          <Link href="/dashboard/appointments" className="text-blue-600 hover:underline text-sm">
            Xem tất cả lịch tư vấn →
          </Link>
        </div>
      </div>

      {/* Các tính năng */}
    </div>
  );
};

export default SpecialistDashboard; 