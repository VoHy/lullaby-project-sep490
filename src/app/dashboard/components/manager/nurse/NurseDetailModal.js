'use client';
import { useState } from 'react';

const NurseDetailModal = ({ nurse, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">Chi tiết Y tá</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Header với avatar */}
          <div className="flex items-center space-x-6 border-b border-gray-100 pb-8">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-3xl">
                {nurse.fullName?.charAt(0) || 'N'}
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{nurse.fullName}</h2>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {nurse.major === 'nurse' ? '👩‍⚕️ Y tá' : '👨‍⚕️ Chuyên gia'}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  nurse.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {nurse.status === 'active' ? '🟢 Đang hoạt động' : '🔴 Không hoạt động'}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin tài khoản */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h4 className="text-lg font-bold mb-4 text-blue-700 flex items-center">
              <span className="mr-2">👤</span>
              Thông tin tài khoản
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                <p className="text-lg font-medium text-gray-900">{nurse.fullName || 'N/A'}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                <p className="text-lg font-medium text-gray-900">{nurse.phoneNumber || 'N/A'}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <p className="text-lg font-medium text-gray-900">{nurse.email || 'N/A'}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  nurse.status === 'active' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {nurse.status === 'active' ? '🟢 Đang hoạt động' : '🔴 Không hoạt động'}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin cá nhân */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
            <h4 className="text-lg font-bold mb-4 text-green-700 flex items-center">
              <span className="mr-2">👤</span>
              Thông tin cá nhân
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Giới tính</label>
                <p className="text-lg font-medium text-gray-900">{nurse.gender || 'N/A'}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày sinh</label>
                <p className="text-lg font-medium text-gray-900">
                  {nurse.dateOfBirth ? new Date(nurse.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}
                </p>
              </div>
              <div className="md:col-span-2 bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
                <p className="text-lg font-medium text-gray-900">{nurse.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Thông tin chuyên môn */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6">
            <h4 className="text-lg font-bold mb-4 text-purple-700 flex items-center">
              <span className="mr-2">🎓</span>
              Thông tin chuyên môn
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kinh nghiệm</label>
                <p className="text-lg font-medium text-gray-900">{nurse.experience || 'N/A'}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Slogan</label>
                <p className="text-lg font-medium text-gray-900 italic">{nurse.slogan || 'N/A'}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chuyên môn</label>
                <p className="text-lg font-medium text-gray-900">{nurse.major === 'nurse' ? '👩‍⚕️ Y tá' : '👨‍⚕️ Chuyên gia'}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Khu vực</label>
                <p className="text-lg font-medium text-gray-900">{nurse.zoneID || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Thông tin bổ sung */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
            <h4 className="text-lg font-bold mb-4 text-orange-700 flex items-center">
              <span className="mr-2">📋</span>
              Thông tin bổ sung
            </h4>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Avatar URL</label>
              <p className="text-lg font-medium text-gray-900 break-all">{nurse.avatarUrl || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseDetailModal; 