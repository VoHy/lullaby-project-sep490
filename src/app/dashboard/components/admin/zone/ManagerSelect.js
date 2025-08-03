import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faExclamationTriangle, faCheckCircle, faInfoCircle,
  faMapMarkerAlt, faUserTie, faUserClock, faArrowRight, faChevronDown
} from '@fortawesome/free-solid-svg-icons';

const ManagerSelect = ({ 
  zoneForm, 
  setZoneForm, 
  accounts, 
  zones,
  getManagerZoneInfo,
  isManagerAssignedToOtherZone 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedManager = accounts.find(acc => acc.accountID === zoneForm.accountID);
  const managerZoneInfo = selectedManager ? getManagerZoneInfo(zoneForm.accountID) : null;
  const isAssignedToOtherZone = selectedManager ? isManagerAssignedToOtherZone(zoneForm.accountID, zoneForm.zoneID) : false;

  const getManagerStatus = (manager) => {
    const managerZoneInfo = getManagerZoneInfo(manager.accountID);
    const isAssignedToOtherZone = isManagerAssignedToOtherZone(manager.accountID, zoneForm.zoneID);
    
    if (managerZoneInfo && isAssignedToOtherZone) {
      return {
        text: `Đang quản lý: ${managerZoneInfo.zoneName}`,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        nameColor: 'text-orange-700',
        nameBg: 'bg-orange-100'
      };
    } else if (managerZoneInfo && !isAssignedToOtherZone) {
      return {
        text: 'Quản lý khu vực này',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        nameColor: 'text-green-700',
        nameBg: 'bg-green-100'
      };
    } else {
      return {
        text: 'Chưa được phân công',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        nameColor: 'text-blue-700',
        nameBg: 'bg-blue-100'
      };
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Quản lý</label>
      
      {/* Custom Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-left flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-2">
            {selectedManager ? (
              <>
                <span className={`font-bold text-lg ${getManagerStatus(selectedManager).nameColor}`}>
                  {selectedManager.fullName}
                </span>
                <span className={`text-sm ${getManagerStatus(selectedManager).color}`}>
                  - {getManagerStatus(selectedManager).text}
                </span>
              </>
            ) : (
              <span className="text-gray-500">Chọn quản lý</span>
            )}
          </div>
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {accounts.filter(acc => acc.roleID === 3).map(manager => {
              const status = getManagerStatus(manager);
              const isSelected = manager.accountID === zoneForm.accountID;
              
              return (
                <div
                  key={manager.accountID}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                  }`}
                  onClick={() => {
                    setZoneForm(f => ({ ...f, accountID: manager.accountID }));
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`font-bold text-lg ${status.nameColor}`}>
                        {manager.fullName}
                      </span>
                    </div>
                    <span className={`text-sm ${status.color} font-medium`}>
                      {status.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Hiển thị thông tin chi tiết về manager được chọn */}
      {zoneForm.accountID && selectedManager && (() => {
        const status = getManagerStatus(selectedManager);
        
        return (
          <div className="mt-4 p-4 rounded-xl border-2 shadow-sm">
            {/* Header với thông tin manager */}
            <div className="flex items-center space-x-3 mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">{selectedManager.fullName}</h4>
                <p className="text-sm text-gray-600">Manager</p>
              </div>
            </div>
            
            {/* Trạng thái quản lý */}
            {managerZoneInfo && isAssignedToOtherZone ? (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-orange-800">Đang quản lý khu vực khác</h5>
                    <p className="text-sm text-orange-600">Sẽ được chuyển sang khu vực này</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-orange-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span className="text-sm font-medium">Khu vực hiện tại:</span>
                    <span className="text-sm bg-orange-100 px-2 py-1 rounded-md font-medium">
                      {managerZoneInfo.zoneName} ({managerZoneInfo.city})
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-purple-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-sm font-medium">Sẽ chuyển sang:</span>
                    <span className="text-sm bg-purple-100 px-2 py-1 rounded-md font-medium">
                      Khu vực mới
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 p-2 bg-orange-100 rounded-lg">
                  <p className="text-xs text-orange-700">
                    <strong>Lưu ý:</strong> Manager này sẽ được chuyển từ khu vực hiện tại sang quản lý khu vực này
                  </p>
                </div>
              </div>
            ) : managerZoneInfo && !isAssignedToOtherZone ? (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-green-800">Đang quản lý khu vực này</h5>
                    <p className="text-sm text-green-600">Không cần thay đổi</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm font-medium">Khu vực quản lý:</span>
                  <span className="text-sm bg-green-100 px-2 py-1 rounded-md font-medium">
                    {managerZoneInfo.zoneName} ({managerZoneInfo.city})
                  </span>
                </div>
                
                <div className="mt-3 p-2 bg-green-100 rounded-lg">
                  <p className="text-xs text-green-700">
                    <strong>Trạng thái:</strong> Manager này đã được phân công quản lý khu vực này
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">?</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-800">Chưa được phân công</h5>
                    <p className="text-sm text-blue-600">Sẵn sàng nhận khu vực mới</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-blue-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm">Chưa có khu vực quản lý nào</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-purple-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-sm font-medium">Sẽ được phân công:</span>
                    <span className="text-sm bg-purple-100 px-2 py-1 rounded-md font-medium">
                      Khu vực mới
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Lợi thế:</strong> Manager này chưa có khu vực quản lý, có thể phân công ngay lập tức
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default ManagerSelect; 