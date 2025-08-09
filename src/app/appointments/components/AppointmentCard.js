'use client';

import { motion } from 'framer-motion';
import { FaUser, FaCheck, FaEye, FaUserCircle, FaBox, FaStethoscope, FaTimes } from 'react-icons/fa';

const AppointmentCard = ({ 
  appointment, 
  index = 0, 
  serviceTypes = [], 
  onSelect,
  onCancel,
  getStatusColor,
  getStatusText,
  formatDate
}) => {
  // Safety checks
  if (!appointment) return null;
  
  const bookingId = appointment.bookingID || appointment.BookingID;
  const careProfile = appointment.careProfile || {};
  const amount = appointment.amount || appointment.totalAmount || appointment.total_Amount || 0;

  // Tính toán thông tin dịch vụ
  const getServiceInfo = () => {
    const customizeDto = appointment.customizePackageCreateDto;
    const customizeDtos = appointment.customizePackageCreateDtos || [];
    
    if (customizeDto) {
      // Package booking
      const serviceId = customizeDto.serviceID || customizeDto.service_ID;
      const service = Array.isArray(serviceTypes) ? serviceTypes.find(s => 
        s.serviceID === serviceId || 
        s.serviceTypeID === serviceId || 
        s.ServiceID === serviceId
      ) : null;
      return {
        type: 'package',
        services: service ? [service] : [],
        total: amount
      };
    } else if (customizeDtos.length > 0) {
      // Individual services
      const services = customizeDtos.map(dto => {
        const serviceId = dto.serviceID || dto.service_ID;
        return Array.isArray(serviceTypes) ? serviceTypes.find(s => 
          s.serviceID === serviceId || 
          s.serviceTypeID === serviceId || 
          s.ServiceID === serviceId
        ) : null;
      }).filter(Boolean);
      
      return {
        type: 'services',
        services: services,
        total: amount
      };
    }
    
    return { type: 'unknown', services: [], total: amount };
  };

  const serviceInfo = getServiceInfo();

  // Check if cancellation is allowed (3 hours before workdate)
  const isCancelAllowed = () => {
    const workdate = appointment.workdate || appointment.Workdate || appointment.BookingDate;
    if (!workdate) return false;
    
    const workDateTime = new Date(workdate);
    const now = new Date();
    const timeDiff = workDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60); // Convert to hours
    
    // Allow cancellation if more than 3 hours until workdate and status is 'paid'
    const status = appointment.status || appointment.Status;
    return hoursDiff > 3 && (status === 'paid' || status === 'completed');
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    
    if (!isCancelAllowed()) {
      alert('Không thể hủy booking này. Booking chỉ có thể hủy trước 3 tiếng so với giờ hẹn và phải ở trạng thái đã thanh toán.');
      return;
    }

    const confirmCancel = window.confirm(
      `Bạn có chắc chắn muốn hủy lịch hẹn #${bookingId}?\n\nViệc hủy sẽ hoàn tiền vào tài khoản của bạn.`
    );
    
    if (confirmCancel && onCancel) {
      onCancel(appointment);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
           onClick={() => onSelect?.(appointment)}>
        
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Lịch hẹn #{bookingId}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor?.(appointment.status || appointment.Status) || 'bg-gray-100 text-gray-700'}`}>
              {getStatusText?.(appointment.status || appointment.Status) || 'Không xác định'}
            </span>
          </div>

          {/* Care Profile Info */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaUserCircle className="text-purple-500" />
              Người được chăm sóc:
            </h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaUser className="text-purple-500" />
                <span className="font-medium">{careProfile?.profileName || 'Không xác định'}</span>
              </div>
              {careProfile?.phoneNumber && (
                <div className="ml-6 text-gray-500">SĐT: {careProfile.phoneNumber}</div>
              )}
              {careProfile?.address && (
                <div className="ml-6 text-gray-500">Địa chỉ: {careProfile.address}</div>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Ngày hẹn:</span>
              <span>{formatDate?.(appointment.workdate || appointment.Workdate || appointment.BookingDate) || 'Chưa xác định'}</span>
            </div>
            {isCancelAllowed() && (
              <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Có thể hủy
              </div>
            )}
          </div>

          {/* Total Amount */}
          <div className="flex items-center justify-between mb-4 p-3 bg-green-50 rounded-lg">
            <span className="font-semibold text-gray-700">Tổng tiền:</span>
            <span className="font-bold text-green-600 text-lg">
              {serviceInfo.total.toLocaleString('vi-VN')}₫
            </span>
          </div>

          {/* Services Preview */}
          {serviceInfo.services.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                {serviceInfo.type === 'package' ? (
                  <><FaBox className="text-purple-500" />Gói dịch vụ:</>
                ) : (
                  <><FaStethoscope className="text-purple-500" />Dịch vụ:</>
                )}
              </h4>
              <div className="space-y-2">
                {serviceInfo.services.slice(0, 2).map((service, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-500 text-xs" />
                      <span className="text-gray-600">
                        {service.serviceName || service.ServiceName || service.name}
                      </span>
                    </div>
                  </div>
                ))}
                {serviceInfo.services.length > 2 && (
                  <div className="text-xs text-gray-500 italic">
                    +{serviceInfo.services.length - 2} dịch vụ khác...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-600 font-medium text-sm">
              <FaEye className="text-xs" />
              <span>Xem chi tiết</span>
            </div>
            <div className="flex items-center gap-2">
              {isCancelAllowed() && (
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors"
                  onClick={handleCancel}
                  title="Hủy booking"
                >
                  <FaTimes className="text-xs" />
                  Hủy
                </button>
              )}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 text-white font-medium text-sm hover:bg-purple-600 transition-colors group-hover:gap-3"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelect) onSelect(appointment);
                }}
              >
                Chi tiết
                <FaEye className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppointmentCard;
