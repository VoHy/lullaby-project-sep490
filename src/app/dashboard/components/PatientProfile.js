'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import medicalReportService from '@/services/medical/medicalReportService';

const PatientProfile = ({ user }) => {
  const [medicalReports, setMedicalReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedicalReports();
  }, []);

  const loadMedicalReports = async () => {
    try {
      const reports = await medicalReportService.getUserMedicalReports(user.id);
      setMedicalReports(reports.slice(0, 5)); // Chỉ lấy 5 báo cáo gần nhất
    } catch (error) {
      console.error('Error loading medical reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang chờ';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      {/* Thông tin cá nhân */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
          <Link 
            href="/profile" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Chỉnh sửa
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Họ và tên</label>
            <p className="mt-1 text-sm text-gray-900">{user?.name || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user?.email || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
            <p className="mt-1 text-sm text-gray-900">{user?.phone || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Ngày sinh</label>
            <p className="mt-1 text-sm text-gray-900">
              {user?.dateOfBirth ? formatDate(user.dateOfBirth) : 'Chưa cập nhật'}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500">Địa chỉ</label>
            <p className="mt-1 text-sm text-gray-900">{user?.address || 'Chưa cập nhật'}</p>
          </div>
        </div>
      </div>

      {/* Lịch sử khám bệnh */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Lịch sử khám bệnh</h3>
              <p className="text-sm text-gray-500">5 lần khám gần nhất</p>
            </div>
            <Link 
              href="/medical-report" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Xem tất cả
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : medicalReports.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>Chưa có lịch sử khám bệnh</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày khám
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bác sĩ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chẩn đoán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medicalReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(report.examinationDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.doctorName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {report.diagnosis}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Thông tin liên hệ khẩn cấp */}
      {user?.emergencyContact && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ khẩn cấp</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Họ và tên</label>
              <p className="mt-1 text-sm text-gray-900">
                {user.emergencyContact.name || 'Chưa cập nhật'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
              <p className="mt-1 text-sm text-gray-900">
                {user.emergencyContact.phone || 'Chưa cập nhật'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Mối quan hệ</label>
              <p className="mt-1 text-sm text-gray-900">
                {user.emergencyContact.relationship || 'Chưa cập nhật'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Các tính năng nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/booking" 
          className="bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition-colors"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-blue-900">Đặt lịch khám</h4>
              <p className="text-sm text-blue-700">Đặt lịch khám với bác sĩ</p>
            </div>
          </div>
        </Link>

        <Link 
          href="/medical-report" 
          className="bg-green-50 hover:bg-green-100 rounded-lg p-6 transition-colors"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-green-900">Hồ sơ bệnh nhân</h4>
              <p className="text-sm text-green-700">Xem lịch sử khám bệnh</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PatientProfile; 