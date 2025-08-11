import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faEye,
  faClock,
  faDollarSign,
  faUserMd,
  faGift,
} from '@fortawesome/free-solid-svg-icons';

const ServiceCard = ({ item, type, onEdit, onDelete, onViewDetail }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'inactive':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMajorColor = (major) => {
    switch (major) {
      case 'nurse':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'specialist':
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <div className={`mr-3 p-2 rounded-lg ${item.isPackage ? 'bg-purple-100' : 'bg-blue-100'}`}>
                <FontAwesomeIcon icon={item.isPackage ? faGift : faUserMd} className={`${item.isPackage ? 'text-purple-600' : 'text-blue-600'}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{item.serviceName}</h3>
            </div>
            {item.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Chỉnh sửa"
            >
              <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa"
            >
              <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {item.status && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
              {item.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
            </span>
          )}
          {item.major && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMajorColor(item.major)}`}>
              {item.major === 'Nurse' ? 'Y tá' :
                item.major === 'Specialist' ? 'Chuyên gia' : item.major}
            </span>
          )}
          {item.isPackage && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              Gói dịch vụ
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-xl font-semibold text-green-700">{item.price?.toLocaleString()}</div>
              <div className="text-[11px] text-gray-500">VNĐ</div>
            </div>
          </div>
          <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
            <FontAwesomeIcon icon={faClock} className="text-blue-600 mr-2" />
            <div className="text-center">
              <div className="text-xl font-semibold text-blue-700">{item.duration}</div>
              <div className="text-[11px] text-gray-500">Phút</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onViewDetail}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2.5 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium shadow-sm"
          >
            <FontAwesomeIcon icon={faEye} className="mr-2" />
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard; 