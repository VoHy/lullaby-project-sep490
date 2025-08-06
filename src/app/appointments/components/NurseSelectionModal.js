'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserMd, FaTimes, FaCheck, FaPhone, FaStar } from 'react-icons/fa';

const NurseSelectionModal = ({
  isOpen,
  onClose,
  onAssign,
  nursingSpecialists = [],
  customizeTaskId,
  taskInfo = null
}) => {
  const [selectedNurseId, setSelectedNurseId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedNurseId || !customizeTaskId) return;
    
    setLoading(true);
    try {
      await onAssign(customizeTaskId, selectedNurseId);
      onClose();
    } catch (error) {
      console.error('Error assigning nurse:', error);
      alert('Có lỗi xảy ra khi phân công nurse');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <FaUserMd className="text-4xl" />
                  Chọn Nurse/Specialist
                </h2>
                {taskInfo && (
                  <p className="text-purple-100 text-lg mt-2">
                    Cho nhiệm vụ: {taskInfo.serviceName}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-3 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {nursingSpecialists.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-6">👩‍⚕️</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Không có nurse khả dụng</h3>
                <p className="text-lg text-gray-600">Hiện tại chưa có nurse/specialist nào có thể phân công.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Chọn nurse/specialist phù hợp:
                  </h3>
                  <p className="text-base text-gray-600">
                    Có {nursingSpecialists.length} nurse/specialist khả dụng
                  </p>
                </div>
                
                {nursingSpecialists.map((nurse) => {
                  const nurseId = nurse.nursingID || nurse.NursingID;
                  const nurseName = nurse.name || nurse.Name || nurse.fullName || nurse.FullName || `Nurse #${nurseId}`;
                  const nurseSpec = nurse.specialization || nurse.Specialization || nurse.major || nurse.Major || 'Chăm sóc tổng quát';
                  const nursePhone = nurse.phoneNumber || nurse.PhoneNumber || nurse.phone || '';
                  const nurseExperience = nurse.experience || nurse.Experience || '';
                  
                  return (
                    <motion.div
                      key={nurseId}
                      onClick={() => setSelectedNurseId(nurseId)}
                      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedNurseId === nurseId
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-3 rounded-xl ${
                              selectedNurseId === nurseId ? 'bg-purple-500' : 'bg-gray-400'
                            }`}>
                              <FaUserMd className="text-white text-xl" />
                            </div>
                            
                            <div>
                              <h4 className="text-xl font-bold text-gray-900">{nurseName}</h4>
                              <p className="text-base text-purple-600 font-medium">{nurseSpec}</p>
                            </div>
                            
                            {selectedNurseId === nurseId && (
                              <div className="ml-auto">
                                <div className="p-2 bg-green-500 rounded-full">
                                  <FaCheck className="text-white text-lg" />
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {nursePhone && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <FaPhone className="text-purple-500" />
                                <span className="text-base">{nursePhone}</span>
                              </div>
                            )}
                            
                            {nurseExperience && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <FaStar className="text-yellow-500" />
                                <span className="text-base">{nurseExperience} năm kinh nghiệm</span>
                              </div>
                            )}
                          </div>

                          {/* Additional info */}
                          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-600">
                              ID: {nurseId} • Chuyên môn: {nurseSpec}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {nursingSpecialists.length > 0 && (
            <div className="p-8 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors text-lg font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!selectedNurseId || loading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg font-semibold"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    'Phân công ngay'
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NurseSelectionModal;