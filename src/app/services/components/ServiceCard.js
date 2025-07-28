'use client';

import { motion } from 'framer-motion';
import { FaStar, FaClock, FaEye, FaShoppingCart, FaCheck, FaTimes, FaTag } from 'react-icons/fa';

const ServiceCard = ({ 
  service, 
  index, 
  isSelected, 
  onSelect, 
  onDetail, 
  onBook, 
  isDisabled = false,
  type = 'service', // 'service' or 'package'
  expandedPackage,
  onToggleExpand,
  getServicesOfPackage
}) => {
  const getRating = (serviceId) => {
    // This should be passed from parent or calculated here
    return { rating: 5.0, count: 0 };
  };

  const rating = getRating(service.ServiceID);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden ${
        isDisabled ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute top-4 right-4 z-10">
          <div className={`text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
            type === 'package' ? 'bg-green-500' : 'bg-blue-500'
          }`}>
            <FaCheck className="text-xs" />
            Đã chọn
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">{service.ServiceName}</h3>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-sm font-semibold text-gray-700">{rating.rating}</span>
            <span className="text-xs text-gray-400">({rating.count})</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.Description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaClock className={type === 'package' ? 'text-purple-500' : 'text-blue-500'} />
            {service.Duration}
          </div>
          <div className={`text-2xl font-bold ${
            type === 'package' ? 'text-purple-600' : 'text-blue-600'
          }`}>
            {service.Price.toLocaleString('vi-VN')}đ
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            className={`w-full py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
              isSelected
                ? 'bg-red-500 text-white hover:bg-red-600'
                : type === 'package'
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            onClick={() => onSelect(service.ServiceID)}
            disabled={isDisabled}
          >
            {isSelected ? (
              <span className="flex items-center justify-center gap-2">
                <FaTimes className="text-sm" />
                Bỏ chọn
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FaCheck className="text-sm" />
                {type === 'package' ? 'Chọn gói này' : 'Chọn dịch vụ này'}
              </span>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              className="py-2 px-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
              onClick={() => onDetail(service)}
            >
              <FaEye className="text-sm" />
              Chi tiết
            </button>
            <button
              className={`py-2 px-3 rounded-xl text-white transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 ${
                type === 'package' 
                  ? 'bg-pink-500 hover:bg-pink-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={() => onBook(service.ServiceID, type)}
              disabled={isDisabled}
            >
              <FaShoppingCart className="text-sm" />
              Đặt ngay
            </button>
          </div>
        </div>

        {/* Expandable Services List for Packages */}
        {type === 'package' && expandedPackage === service.ServiceID && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            <h4 className="font-semibold text-purple-600 mb-3 flex items-center gap-2">
              <FaTag className="text-sm" />
              Dịch vụ trong gói:
            </h4>
            <div className="space-y-2">
              {getServicesOfPackage(service.ServiceID).map(child => (
                <div key={child.ServiceID} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-blue-700">{child.ServiceName}</span>
                    <p className="text-xs text-gray-500">{child.Description}</p>
                  </div>
                  <span className="text-sm font-bold text-pink-600">
                    {child.Price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Expand/Collapse Button for Packages */}
        {type === 'package' && (
          <button
            className="w-full mt-3 py-2 text-sm text-purple-600 hover:text-purple-700 transition-colors"
            onClick={() => onToggleExpand(service.ServiceID)}
          >
            {expandedPackage === service.ServiceID ? 'Thu gọn' : 'Xem chi tiết gói'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ServiceCard; 