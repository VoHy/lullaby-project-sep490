'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faDollarSign, faList, faTimes, faUserMd } from '@fortawesome/free-solid-svg-icons';

const ServiceDetailModal = ({ isOpen, onClose, service }) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[92vh] overflow-y-auto border border-gray-100">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="mr-3 p-3 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100">
                <FontAwesomeIcon icon={faUserMd} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Chi tiết dịch vụ</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 w-9 h-9 rounded-full flex items-center justify-center"
              aria-label="Đóng"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Service Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin dịch vụ</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tên dịch vụ</label>
                <p className="text-lg font-semibold text-gray-800">{service.serviceName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Trạng thái</label>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  service.status === 'active' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                    : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                }`}>
                  {service.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Chuyên môn</label>
                <p className="text-gray-800">
                  {service.major === 'Nurse' ? 'Chuyên viên chăm sóc' : 
                   service.major === 'Specialist' ? 'Chuyên gia tư vấn' : service.major}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Giá</label>
                <p className="text-lg font-semibold text-green-600">{service.price?.toLocaleString()} VNĐ</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Thời gian</label>
                <p className="text-gray-800">{service.duration} phút</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Loại dịch vụ</label>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  Dịch vụ lẻ
                </span>
              </div>
            </div>
            {service.description && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Mô tả</label>
                <p className="text-gray-800">{service.description}</p>
              </div>
            )}
          </div>

          {/* Service Statistics */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800">Thống kê dịch vụ</h4>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <FontAwesomeIcon icon={faClock} className="text-white text-xl" />
                  </div>
                  <h5 className="text-lg font-semibold text-gray-800">{service.duration}</h5>
                  <p className="text-sm text-gray-600">Phút</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <FontAwesomeIcon icon={faDollarSign} className="text-white text-xl" />
                  </div>
                  <h5 className="text-lg font-semibold text-gray-800">{service.price?.toLocaleString()}</h5>
                  <p className="text-sm text-gray-600">VNĐ</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <FontAwesomeIcon icon={faList} className="text-white text-xl" />
                  </div>
                  <h5 className="text-lg font-semibold text-gray-800">
                    {service.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </h5>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal; 