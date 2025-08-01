import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserTie, faUserMd, faUsers, faTimes, faMapMarkerAlt 
} from '@fortawesome/free-solid-svg-icons';

const StaffViewModal = ({ 
  showStaffModal, 
  setShowStaffModal, 
  selectedZone, 
  getNursesByZone, 
  getSpecialistsByZone, 
  getManagerByZone 
}) => {
  if (!showStaffModal || !selectedZone) return null;

  const nurses = getNursesByZone(selectedZone.zoneID);
  const specialists = getSpecialistsByZone(selectedZone.zoneID);
  const manager = getManagerByZone(selectedZone.zoneID);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Nhân sự khu vực: {selectedZone.zoneName}</h3>
              <p className="text-purple-100 text-sm mt-1">{selectedZone.city}</p>
            </div>
            <button 
              className="text-white hover:text-gray-200 text-2xl font-bold" 
              onClick={() => setShowStaffModal(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Manager*/}
          <div className="mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 max-w-md mx-auto">
              <div className="flex items-center space-x-2 mb-3">
                <FontAwesomeIcon icon={faUserTie} className="text-blue-600 text-lg" />
                <h4 className="font-semibold text-blue-800">Quản lý khu vực</h4>
              </div>
              {manager ? (
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {manager.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 break-words">{manager.fullName}</p>
                      <p className="text-sm text-gray-600 break-words">{manager.email}</p>
                      <p className="text-xs text-gray-500">{manager.phone}</p>
                      {manager.address && (
                        <div className="flex items-start space-x-1 mt-1">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 text-xs mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-600 break-words">{manager.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-3 border border-blue-200 text-center text-gray-500">
                  Chưa có quản lý được phân công
                </div>
              )}
            </div>
          </div>

          {/* Y tá và Chuyên gia 2 cột*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nurses */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-3">
                <FontAwesomeIcon icon={faUserMd} className="text-green-600 text-lg" />
                <h4 className="font-semibold text-green-800">Y tá ({nurses.length})</h4>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {nurses.length > 0 ? (
                  nurses.map(nurse => (
                    <div key={nurse.accountID} className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {nurse.fullName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 break-words">{nurse.fullName}</p>
                          <p className="text-sm text-gray-600 break-words">{nurse.email}</p>
                          <p className="text-xs text-gray-500">{nurse.phone}</p>
                          {nurse.address && (
                            <div className="flex items-start space-x-1 mt-1">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500 text-xs mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-gray-600 break-words">{nurse.address}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg p-3 border border-green-200 text-center text-gray-500">
                    Chưa có y tá nào được phân công
                  </div>
                )}
              </div>
            </div>

            {/* Specialists */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center space-x-2 mb-3">
                <FontAwesomeIcon icon={faUsers} className="text-purple-600 text-lg" />
                <h4 className="font-semibold text-purple-800">Chuyên gia ({specialists.length})</h4>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {specialists.length > 0 ? (
                  specialists.map(specialist => (
                    <div key={specialist.accountID} className="bg-white rounded-lg p-3 border border-purple-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {specialist.fullName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 break-words">{specialist.fullName}</p>
                          <p className="text-sm text-gray-600 break-words">{specialist.email}</p>
                          <p className="text-xs text-gray-500">{specialist.phone}</p>
                          {specialist.address && (
                            <div className="flex items-start space-x-1 mt-1">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-500 text-xs mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-gray-600 break-words">{specialist.address}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg p-3 border border-purple-200 text-center text-gray-500">
                    Chưa có chuyên gia nào được phân công
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl border-t">
          <div className="flex justify-end">
            <button 
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
              onClick={() => setShowStaffModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffViewModal; 