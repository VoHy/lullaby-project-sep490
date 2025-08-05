'use client';

import { motion } from 'framer-motion';
import { FaUser, FaCheck, FaEye, FaUserCircle, FaBox, FaStethoscope } from 'react-icons/fa';

const AppointmentCard = ({ 
  appointment, 
  index, 
  serviceTypes, 
  nursingSpecialists, 
  onSelect,
  getServiceNames,
  getNurseNames,
  getStatusColor,
  getStatusText,
  formatDate,
  getCareProfileName,
  getBookingServices,
  getBookingPackages,
  getBookingDetails,
  getBookingPaymentHistory
}) => {
  const bookingId = appointment.bookingID || appointment.BookingID;
  const bookingServices = getBookingServices(bookingId);
  const bookingPackages = getBookingPackages(bookingId);
  const bookingDetails = getBookingDetails(bookingId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
           onClick={() => onSelect(appointment)}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Lịch hẹn #{appointment.bookingID || appointment.BookingID}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
              {getStatusText(appointment.status)}
            </span>
          </div>

          {/* Care Profile */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaUserCircle className="text-purple-500" />
              Người được chăm sóc:
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaUser className="text-purple-500" />
              <span className="font-medium">{getCareProfileName(appointment.careProfileID)}</span>
            </div>
          </div>

          {/* Packages */}
          {bookingPackages.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaBox className="text-purple-500" />
                Gói dịch vụ:
              </h4>
              <div className="space-y-2">
                {bookingPackages.map((pkg, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-500 text-xs" />
                      <span className="text-gray-600">{pkg.packageName}</span>
                    </div>
                    <span className="font-medium text-purple-600">
                      {pkg.price?.toLocaleString('vi-VN') || '0'}đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {bookingServices.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaStethoscope className="text-purple-500" />
                Dịch vụ chi tiết:
              </h4>
              <div className="space-y-2">
                {bookingServices.slice(0, 3).map((service, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-500 text-xs" />
                      <span className="text-gray-600">{service.serviceName}</span>
                      <span className="text-xs text-gray-400">({service.nurseName})</span>
                    </div>
                    <span className="font-medium text-blue-600">
                      {service.price?.toLocaleString('vi-VN') || '0'}đ
                    </span>
                  </div>
                ))}
                {bookingServices.length > 3 && (
                  <div className="text-xs text-gray-500 italic">
                    +{bookingServices.length - 3} dịch vụ khác...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Total Amount */}
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Tổng tiền:</span>
                             <span className="text-lg font-bold text-purple-600">
                 {appointment.amount?.toLocaleString('vi-VN') || '0'}đ
               </span>
            </div>
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <FaUser className="text-purple-500" />
            <span>{formatDate(appointment.workdate)}</span>
          </div>

          {/* Note */}
          {appointment.note && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Ghi chú:</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {appointment.note}
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-600 font-medium text-sm">
              <FaEye className="text-xs" />
              <span>Xem chi tiết</span>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 text-white font-medium text-sm hover:bg-purple-600 transition-colors group-hover:gap-3"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(appointment);
              }}
            >
              Chi tiết
              <FaEye className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppointmentCard; 