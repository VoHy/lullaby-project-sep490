'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserMd, FaTimes, FaCheck, FaPhone, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const NurseSelectionModal = ({
  isOpen,
  onClose,
  onAssign,
  service,
  availableNurses = []
}) => {
  const [selectedNurseId, setSelectedNurseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAssign = async () => {
    console.log('🚀 Handle assign called:', { selectedNurseId, availableNurses, selectedType: typeof selectedNurseId });
    
    if (!selectedNurseId) {
      console.error('❌ No nurse selected!');
      setError('Vui lòng chọn một nurse trước khi phân công');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Nếu selectedNurseId là fallback index, tìm nurse thực tế
      let actualNurseId = selectedNurseId;
      if (typeof selectedNurseId === 'string' && selectedNurseId.startsWith('nurse-')) {
        const index = parseInt(selectedNurseId.replace('nurse-', ''));
        const nurse = availableNurses[index];
        actualNurseId = nurse?.nurseId || nurse?.nursingSpecialistID || nurse?.nursing_SpecialistID || nurse?.id || nurse?.accountID || selectedNurseId;
      }
      
      console.log('🎯 Assigning nurse:', { originalId: selectedNurseId, actualId: actualNurseId });
      await onAssign(actualNurseId);
      onClose();
    } catch (error) {
      console.error('Error assigning nurse:', error);
      setError(error.message || 'Có lỗi xảy ra khi phân công nurse');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        onClick={(e) => {
          // Chỉ đóng modal khi click vào backdrop, không phải modal content
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <FaUserMd className="text-4xl" />
                  Chọn Nurse/Specialist
                </h2>
                {service && (
                  <p className="text-purple-100 mt-2">
                    Cho dịch vụ: {service.serviceName || service.ServiceName}
                    {service.customizeTaskId && ` (CustomizeTask ID: ${service.customizeTaskId})`}
                    {service.packageInstance && ` (Gói #${service.packageInstance})`}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 p-3 rounded-full transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {availableNurses.length === 0 ? (
              <div className="text-center py-12">
                <FaUserMd className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Không có nurse nào khả dụng
                </h3>
                <p className="text-gray-500">
                  Hiện tại không có nurse nào trong khu vực này.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Nurses khả dụng trong khu vực ({availableNurses.length})
                  </h3>
                  <p className="text-sm text-gray-600">
                    Chọn một nurse để phân công cho dịch vụ này
                  </p>
                </div>

                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {availableNurses.map((nurse, index) => {
                    const nurseId = nurse.nurseId || nurse.nursingSpecialistID || nurse.nursing_SpecialistID || nurse.id || nurse.accountID || nurse.Account_ID;
                    const isSelected = selectedNurseId === nurseId;
                    
                    console.log('👥 Nurse data:', { 
                      nurse, 
                      nurseId, 
                      isSelected,
                      selectedNurseId,
                      allKeys: Object.keys(nurse)
                    });
                    
                    return (
                      <div
                        key={`nurse-${nurseId || index}`}
                        className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none
                          ${isSelected 
                            ? 'border-purple-500 bg-purple-50 shadow-lg transform scale-[1.02]' 
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                          }
                        `}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🎯 Clicking nurse:', { nurse, nurseId, selectedNurseId });
                          if (nurseId) {
                            setSelectedNurseId(nurseId);
                          } else {
                            console.error('❌ Nurse ID is undefined!', nurse);
                            // Fallback - use index nếu không có ID
                            setSelectedNurseId(`nurse-${index}`);
                          }
                        }}
                        style={{ pointerEvents: 'auto' }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`
                              w-12 h-12 rounded-full flex items-center justify-center
                              ${isSelected ? 'bg-purple-500' : 'bg-gray-200'}
                            `}>
                              <FaUserMd className={`text-xl ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {nurse.fullName || nurse.full_name || nurse.name || 'Không có tên'}
                              </h4>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                {nurse.phoneNumber && (
                                  <div className="flex items-center gap-1">
                                    <FaPhone className="text-xs" />
                                    <span>{nurse.phoneNumber}</span>
                                  </div>
                                )}
                                
                                {nurse.rating && (
                                  <div className="flex items-center gap-1">
                                    <FaStar className="text-yellow-400 text-xs" />
                                    <span>{nurse.rating}</span>
                                  </div>
                                )}
                              </div>
                              
                              {nurse.address && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                  <FaMapMarkerAlt />
                                  <span>{nurse.address}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                              <FaCheck className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Cancel button clicked');
                      onClose();
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    style={{ pointerEvents: 'auto' }}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Assign button clicked', { selectedNurseId, loading });
                      handleAssign();
                    }}
                    disabled={!selectedNurseId || loading}
                    className={`
                      px-6 py-3 rounded-xl font-medium transition-all duration-200
                      ${selectedNurseId && !loading
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }
                    `}
                    style={{ pointerEvents: 'auto' }}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang phân công...
                      </div>
                    ) : (
                      'Phân công Nurse'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NurseSelectionModal;
