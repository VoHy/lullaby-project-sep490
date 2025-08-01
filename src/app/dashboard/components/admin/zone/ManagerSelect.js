import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faExclamationTriangle, faCheckCircle, faInfoCircle 
} from '@fortawesome/free-solid-svg-icons';

const ManagerSelect = ({ 
  zoneForm, 
  setZoneForm, 
  accounts, 
  zones,
  getManagerZoneInfo,
  isManagerAssignedToOtherZone 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Quản lý</label>
      <select 
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        value={zoneForm.accountID}
        onChange={e => setZoneForm(f => ({ ...f, accountID: parseInt(e.target.value) }))}
      >
        <option value="">Chọn quản lý</option>
        {accounts.filter(acc => acc.roleID === 3).map(manager => {
          const managerZoneInfo = getManagerZoneInfo(manager.accountID);
          const isAssignedToOtherZone = isManagerAssignedToOtherZone(manager.accountID, zoneForm.zoneID);
          
          return (
            <option key={manager.accountID} value={manager.accountID}>
              {manager.fullName}
              {managerZoneInfo && isAssignedToOtherZone && ` - Đang quản lý: ${managerZoneInfo.zoneName} (${managerZoneInfo.city})`}
              {managerZoneInfo && !isAssignedToOtherZone && ` - Quản lý khu vực này`}
              {!managerZoneInfo && ' - Chưa được phân công'}
            </option>
          );
        })}
      </select>
      
      {/* Hiển thị thông tin chi tiết về manager được chọn */}
      {zoneForm.accountID && (() => {
        const selectedManager = accounts.find(acc => acc.accountID === zoneForm.accountID);
        const managerZoneInfo = getManagerZoneInfo(zoneForm.accountID);
        const isAssignedToOtherZone = isManagerAssignedToOtherZone(zoneForm.accountID, zoneForm.zoneID);
        
        if (!selectedManager) return null;
        
        return (
          <div className="mt-2 p-3 rounded-lg border">
            <div className="flex items-center space-x-2 mb-2">
              <FontAwesomeIcon icon={faUser} className="text-blue-500" />
              <span className="font-medium text-sm">{selectedManager.fullName}</span>
            </div>
            
            {managerZoneInfo && isAssignedToOtherZone ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600" />
                  <span className="text-sm font-medium">Đang quản lý khu vực khác:</span>
                </div>
                <div className="text-sm text-yellow-700 mt-1">
                  <p>• <strong>{managerZoneInfo.zoneName}</strong> ({managerZoneInfo.city})</p>
                  <p>• Nếu chọn manager này, họ sẽ được chuyển sang quản lý khu vực này</p>
                </div>
              </div>
            ) : managerZoneInfo && !isAssignedToOtherZone ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                <div className="flex items-center space-x-2 text-green-800">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                  <span className="text-sm font-medium">Đang quản lý khu vực này</span>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                <div className="flex items-center space-x-2 text-blue-800">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600" />
                  <span className="text-sm font-medium">Chưa được phân công khu vực nào</span>
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