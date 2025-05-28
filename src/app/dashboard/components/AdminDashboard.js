'use client';

import { useState } from 'react';
import Link from 'next/link';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalUsers: 120,
    totalNurses: 45,
    activeCases: 36,
    pendingApprovals: 8,
    totalBookings: 78,
    totalPayments: 65
  });

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Thống kê */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Người dùng</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Tổng số</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="text-gray-600">Y tá</p>
            <p className="text-xl font-semibold">{stats.totalNurses}</p>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/users" className="text-blue-600 hover:underline text-sm">
              Quản lý người dùng →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Đặt lịch</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Đang hoạt động</p>
            <p className="text-2xl font-bold">{stats.activeCases}</p>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="text-gray-600">Tổng số</p>
            <p className="text-xl font-semibold">{stats.totalBookings}</p>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/bookings" className="text-blue-600 hover:underline text-sm">
              Xem đặt lịch →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Thanh toán</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Tổng giao dịch</p>
            <p className="text-2xl font-bold">{stats.totalPayments}</p>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="text-gray-600">Doanh thu tuần này</p>
            <p className="text-xl font-semibold">12.450.000 đ</p>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/payments" className="text-blue-600 hover:underline text-sm">
              Xem báo cáo →
            </Link>
          </div>
        </div>
      </div>

      {/* Phê duyệt đang chờ xử lý */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Phê duyệt đang chờ xử lý</h3>
          <p className="text-sm text-gray-500">Danh sách y tá đang chờ phê duyệt</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3].map((item) => (
                <tr key={item}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {`N${item}`}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Nguyễn Văn {String.fromCharCode(64 + item)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">nurse{item}@example.com</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date().toLocaleDateString('vi-VN')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-green-600 hover:text-green-900 mr-3">Phê duyệt</button>
                    <button className="text-red-600 hover:text-red-900">Từ chối</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {stats.pendingApprovals > 3 && (
          <div className="px-6 py-3 border-t">
            <Link href="/dashboard/approvals" className="text-blue-600 hover:underline text-sm">
              Xem tất cả {stats.pendingApprovals} yêu cầu →
            </Link>
          </div>
        )}
      </div>

      {/* Các tính năng quản trị */}
    </div>
  );
};

export default AdminDashboard; 