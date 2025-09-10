'use client';
import { useState } from 'react';
import { FaTimes, FaUser, FaUserMd, FaCheckCircle, FaTimesCircle, FaGraduationCap, FaClipboardList } from 'react-icons/fa';

const SpecialistDetailModal = ({ specialist, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">Chi tiết Chuyên gia tư vấn</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Header với avatar */}
          <div className="flex items-center space-x-6 border-b border-gray-100 pb-8">
            <div className="h-20 w-20 rounded-full overflow-hidden shadow-xl border-4 border-pink-100">
              <img
                src={(specialist.avatarUrl && specialist.avatarUrl !== 'string')
                  ? specialist.avatarUrl
                  : ((specialist.account?.avatarUrl && specialist.account?.avatarUrl !== 'string')
                    ? specialist.account.avatarUrl
                    : '/images/logo-eldora.png')}
                alt={specialist.fullName || 'Avatar'}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{specialist.fullName}</h2>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {specialist.major === 'Specialist' ? (<><FaUserMd /> Chuyên gia tư vấn</>) : (<><FaUser /> Chuyên viên chăm sóc</>)}
                </span>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  specialist.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {specialist.status === 'active' ? <FaCheckCircle /> : <FaTimesCircle />}
                  {specialist.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>
          </div>
          {/* Sections in two-column neutral layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin tài khoản */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="text-base font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaUser />
                Thông tin tài khoản
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                  <p className="text-base font-medium text-gray-900">{specialist.fullName || 'N/A'}</p>
                </div>
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <p className="text-base font-medium text-gray-900">{specialist.account?.phoneNumber || specialist.phoneNumber || 'N/A'}</p>
                </div>
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-base font-medium text-gray-900">{specialist.account?.email || specialist.email || 'N/A'}</p>
                </div>
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full border ${
                    specialist.status === 'active' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {specialist.status === 'active' ? <FaCheckCircle /> : <FaTimesCircle />}
                    {specialist.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
            </section>

            {/* Thông tin chuyên môn */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="text-base font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaGraduationCap />
                Thông tin chuyên môn
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kinh nghiệm</label>
                  <p className="text-base font-medium text-gray-900">{specialist.experience || 'N/A'}</p>
                </div>
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slogan</label>
                  <p className="text-base font-medium text-gray-900 italic">{specialist.slogan || 'N/A'}</p>
                </div>
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên môn</label>
                  <p className="text-base font-medium text-gray-900 inline-flex items-center gap-2">
                    {specialist.major === 'Specialist' ? (<><FaUserMd /> Chuyên gia tư vấn</>) : (<><FaUser /> Chuyên viên chăm sóc</>)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực</label>
                  <p className="text-base font-medium text-gray-900">{specialist.zoneID || 'N/A'}</p>
                </div>
              </div>
            </section>

            {/* Thông tin cá nhân */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="text-base font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaUser />
                Thông tin cá nhân
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                  <p className="text-base font-medium text-gray-900">{specialist.gender || 'N/A'}</p>
                </div>
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                  <p className="text-base font-medium text-gray-900">
                    {specialist.dateOfBirth ? new Date(specialist.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-0 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                  <p className="text-base font-medium text-gray-900">{specialist.address || 'N/A'}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-black/80 transition-all duration-200 font-semibold shadow-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistDetailModal; 