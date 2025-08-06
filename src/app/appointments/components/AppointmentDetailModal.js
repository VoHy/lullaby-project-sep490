'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCalendar, FaUser, FaCheck, FaCreditCard, FaUserCircle, FaBox, FaStethoscope, FaMoneyBillWave, FaInfoCircle, FaTasks, FaUserMd, FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import TaskList from './TaskList';
import NurseSelectionModal from './NurseSelectionModal';

const AppointmentDetailModal = ({
  appointment,
  onClose,
  serviceTypes,
  nursingSpecialists,
  customizeTasks = [],
  getServiceNames,
  getNurseNames,
  getStatusColor,
  getStatusText,
  formatDate,
  getCareProfileName,
  getBookingServices,
  getBookingPackages,
  getBookingDetails,
  getBookingInvoice,
  onAssignNursing,
  onUpdateTaskStatus
}) => {
  const router = useRouter();
  const [showNurseModal, setShowNurseModal] = useState(false);
  const [selectedTaskForNursing, setSelectedTaskForNursing] = useState(null);

  if (!appointment) return null;

  const bookingId = appointment.bookingID || appointment.BookingID;
  const bookingServices = getBookingServices(bookingId);
  const bookingPackages = getBookingPackages(bookingId);
  const bookingDetails = getBookingDetails(bookingId);
  const bookingInvoices = getBookingInvoice(bookingId);

  // Handle task nursing assignment
  const handleAssignNursing = (task) => {
    console.log('🎯 Opening nurse selection for task:', task);
    setSelectedTaskForNursing(task);
    setShowNurseModal(true);
  };

  const handleNurseAssignment = async (taskId, nursingId) => {
    try {
      await onAssignNursing?.(taskId, nursingId);
      setShowNurseModal(false);
      setSelectedTaskForNursing(null);
    } catch (error) {
      console.error('Error in modal nurse assignment:', error);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full relative max-h-[95vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Header với gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-t-3xl p-8 relative">
          <button
            className="absolute top-6 right-6 text-white hover:bg-white hover:bg-opacity-20 p-3 rounded-full transition-colors"
            onClick={onClose}
          >
            <FaTimes className="text-xl" />
          </button>

          <div className="pr-16">
            <h1 className="text-4xl font-bold mb-2">
              Chi tiết lịch hẹn #{bookingId}
            </h1>
            <p className="text-purple-100 text-lg">
              {formatDate(appointment.workdate || appointment.Workdate || appointment.BookingDate)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column - Basic Info */}
            <div className="xl:col-span-1 space-y-6">
              
              {/* Status Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <FaInfoCircle className="text-white text-lg" />
                  </div>
                  Thông tin cơ bản
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-700">Trạng thái:</span>
                    <span className={`px-4 py-2 rounded-full text-base font-semibold ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>

                  <div>
                    <span className="text-lg font-medium text-gray-700 block mb-2">Người được chăm sóc:</span>
                    <div className="flex items-center gap-3 bg-white p-4 rounded-xl border">
                      <FaUserCircle className="text-purple-500 text-2xl" />
                      <span className="text-lg font-semibold text-gray-900">
                        {getCareProfileName(appointment.careProfileID || appointment.CareProfileID)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-lg font-medium text-gray-700 block mb-2">Ngày giờ:</span>
                    <div className="flex items-center gap-3 bg-white p-4 rounded-xl border">
                      <FaCalendar className="text-purple-500 text-xl" />
                      <span className="text-lg text-gray-900">
                        {formatDate(appointment.workdate || appointment.Workdate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Amount Card */}
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <FaMoneyBillWave className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium opacity-90">Tổng chi phí</h3>
                    <span className="text-3xl font-bold">
                      {(appointment.amount || appointment.Amount || bookingDetails.totalAmount || 0).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <FaInfoCircle className="text-purple-500 text-xl" />
                  Tóm tắt
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl border">
                    <div className="text-2xl font-bold text-purple-600">{bookingPackages.length}</div>
                    <div className="text-sm text-gray-600">Gói dịch vụ</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border">
                    <div className="text-2xl font-bold text-orange-600">{customizeTasks.length}</div>
                    <div className="text-sm text-gray-600">Nhiệm vụ</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border">
                    <div className="text-2xl font-bold text-green-600">
                      {customizeTasks.filter(t => t.isAssigned).length}
                    </div>
                    <div className="text-sm text-gray-600">Đã phân công</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border">
                    <div className="text-2xl font-bold text-red-600">
                      {customizeTasks.filter(t => !t.isAssigned).length}
                    </div>
                    <div className="text-sm text-gray-600">Chưa phân công</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Tasks */}
            <div className="xl:col-span-1 space-y-6">
              
              {/* Tasks Section */}
              {customizeTasks && customizeTasks.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <FaTasks className="text-white text-xl" />
                    </div>
                    Nhiệm vụ chăm sóc ({customizeTasks.length})
                  </h3>
                  
                  <div className="space-y-4">
                    {customizeTasks.map((task, index) => (
                      <div 
                        key={task.taskId || index}
                        className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {task.serviceName || 'Nhiệm vụ chăm sóc'}
                            </h4>
                            
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                                task.status === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : task.status === 'in-progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {task.status === 'completed' ? <FaCheck /> : <FaClock />}
                                {task.status === 'completed' ? 'Hoàn thành' :
                                 task.status === 'in-progress' ? 'Đang thực hiện' : 'Chờ xử lý'}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                              <FaUserMd className={task.isAssigned ? 'text-green-500' : 'text-orange-500'} />
                              <span className={`text-base font-medium ${task.isAssigned ? 'text-green-600' : 'text-orange-600'}`}>
                                {task.nursingName}
                              </span>
                              {!task.isAssigned && (
                                <span className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded-full font-medium">
                                  Cần phân công
                                </span>
                              )}
                            </div>

                            {/* Debug info in development */}
                            {process.env.NODE_ENV === 'development' && (
                              <div className="text-xs text-gray-400 font-mono mb-3 p-2 bg-gray-50 rounded">
                                Task ID: {task.taskId} | Order: {task.taskOrder}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons - Làm to và nổi bật hơn */}
                        <div className="flex gap-3">
                          {!task.isAssigned && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignNursing(task);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-base"
                            >
                              <FaUserMd className="text-lg" />
                              Phân công Nurse
                            </button>
                          )}
                          
                          {task.isAssigned && task.status !== 'completed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateTaskStatus?.(task);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-base"
                            >
                              <FaEdit className="text-lg" />
                              Cập nhật trạng thái
                            </button>
                          )}

                          {task.isAssigned && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignNursing(task);
                              }}
                              className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                            >
                              Đổi Nurse
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Services & Packages */}
            <div className="xl:col-span-1 space-y-6">
              
              {/* Packages */}
              {bookingPackages.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <FaBox className="text-white text-xl" />
                    </div>
                    Gói dịch vụ ({bookingPackages.length})
                  </h3>
                  
                  <div className="space-y-4">
                    {bookingPackages.map((pkg, index) => (
                      <div key={index} className="bg-white rounded-xl p-5 border shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-purple-700">{pkg.packageName}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pkg.status)}`}>
                            {getStatusText(pkg.status)}
                          </span>
                        </div>
                        
                        {pkg.description && (
                          <p className="text-base text-gray-600 mb-3">{pkg.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-base text-gray-500">Giá:</span>
                          <span className="text-xl font-bold text-purple-600">
                            {pkg.price?.toLocaleString('vi-VN') || '0'}₫
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Note */}
              {(appointment.note || appointment.Note) && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Ghi chú</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {appointment.note || appointment.Note}
                  </p>
                </div>
              )}

              {/* Payment History */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <FaCreditCard className="text-green-500 text-xl" />
                  Lịch sử thanh toán
                </h3>
                
                {bookingInvoices.length > 0 ? (
                  <div className="space-y-3">
                    {bookingInvoices.slice(0, 3).map((invoice, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 border">
                        <div className="flex items-center justify-between text-base">
                          <span className="text-gray-700">{invoice.content}</span>
                          <span className="font-bold text-green-600">
                            {invoice.totalAmount?.toLocaleString('vi-VN') || '0'}₫
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                          <span>Trạng thái: {invoice.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                          <span>{new Date(invoice.paymentDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    ))}
                    
                    {bookingInvoices.length > 3 && (
                      <button
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500 text-white text-base font-semibold hover:bg-blue-600 transition-colors"
                        onClick={() => {
                          onClose();
                          router.push('/payment/history');
                        }}
                      >
                        <FaCreditCard />
                        Xem tất cả ({bookingInvoices.length})
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-base text-gray-500 italic text-center py-4">
                    Chưa có giao dịch thanh toán
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nurse Selection Modal */}
        <NurseSelectionModal
          isOpen={showNurseModal}
          onClose={() => {
            setShowNurseModal(false);
            setSelectedTaskForNursing(null);
          }}
          onAssign={handleNurseAssignment}
          nursingSpecialists={nursingSpecialists}
          customizeTaskId={selectedTaskForNursing?.taskId}
          taskInfo={selectedTaskForNursing}
        />
      </motion.div>
    </motion.div>
  );
};

export default AppointmentDetailModal;