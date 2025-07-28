'use client';

import { motion } from 'framer-motion';
import { FaTimes, FaCalendar, FaUser, FaCheck, FaCreditCard, FaUserCircle, FaBox, FaStethoscope, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const AppointmentDetailModal = ({ 
  appointment, 
  onClose, 
  serviceTypes, 
  nursingSpecialists,
  getServiceNames,
  getNurseNames,
  getStatusColor,
  getStatusText,
  formatDate,
  getCareProfileName,
  getBookingServices,
  getBookingPackages,
  getBookingDetails
}) => {
  const router = useRouter();

  if (!appointment) return null;

  const bookingServices = getBookingServices(appointment.BookingID);
  const bookingPackages = getBookingPackages(appointment.BookingID);
  const bookingDetails = getBookingDetails(appointment.BookingID);

  return (
    <motion.div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Chi tiết lịch hẹn #{appointment.BookingID}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Trạng thái:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.Status)}`}>
                {getStatusText(appointment.Status)}
              </span>
            </div>

            {/* Care Profile */}
            <div>
              <span className="font-semibold text-gray-700">Người được chăm sóc:</span>
              <div className="flex items-center gap-2 mt-1">
                <FaUserCircle className="text-purple-500" />
                <span className="text-gray-900 font-medium">{getCareProfileName(appointment.CareProfileID)}</span>
              </div>
            </div>

            {/* Date and Time */}
            <div>
              <span className="font-semibold text-gray-700">Ngày giờ:</span>
              <div className="flex items-center gap-2 mt-1">
                <FaCalendar className="text-purple-500" />
                <span className="text-gray-900">{formatDate(appointment.WorkDate)}</span>
              </div>
            </div>

            {/* Note */}
            {appointment.Note && (
              <div>
                <span className="font-semibold text-gray-700">Ghi chú:</span>
                <p className="mt-2 text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {appointment.Note}
                </p>
              </div>
            )}

            {/* Payment History */}
            <div>
              <span className="font-semibold text-gray-700">Lịch sử thanh toán:</span>
              <div className="mt-2">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    onClose();
                    router.push('/payment/history');
                  }}
                >
                  <FaCreditCard className="text-sm" />
                  Xem lịch sử thanh toán
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Services and Packages */}
          <div className="space-y-6">
            {/* Packages */}
            {bookingPackages.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaBox className="text-purple-500" />
                  Gói dịch vụ
                </h3>
                <div className="space-y-3">
                  {bookingPackages.map((pkg, index) => (
                    <div key={index} className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-purple-700">{pkg.packageName}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}>
                          {getStatusText(pkg.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Giá:</span>
                        <span className="font-bold text-purple-600">{pkg.price.toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {bookingServices.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaStethoscope className="text-purple-500" />
                  Dịch vụ chi tiết
                </h3>
                <div className="space-y-3">
                  {bookingServices.map((service, index) => (
                    <div key={index} className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-blue-700">{service.serviceName}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                          {getStatusText(service.status)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-blue-500 text-xs" />
                          <span className="text-sm text-gray-600">{service.nurseName}</span>
                        </div>
                        <span className="font-bold text-blue-600">{service.price.toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Amount */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-white" />
                  <span className="font-semibold">Tổng tiền:</span>
                </div>
                <span className="text-xl font-bold">
                  {bookingDetails.totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaInfoCircle className="text-purple-500" />
                Tóm tắt
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>• {bookingPackages.length} gói dịch vụ</div>
                <div>• {bookingServices.length} dịch vụ chi tiết</div>
                <div>• {bookingServices.filter(s => s.nurseName !== 'Chưa phân công').length} nhân viên đã phân công</div>
                <div>• Trạng thái: {getStatusText(appointment.Status)}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AppointmentDetailModal; 