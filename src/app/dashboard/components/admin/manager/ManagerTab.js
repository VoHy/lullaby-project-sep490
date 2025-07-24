import React, { useState } from 'react';
import accounts from '@/mock/Account';
import zonesData from '@/mock/Zone';

const ManagerTab = () => {
  // Lọc ra các manager
  const [managers, setManagers] = useState(accounts.filter(acc => acc.role_id === 4));
  const [zones, setZones] = useState(zonesData);
  const [saving, setSaving] = useState(false);

  // Lấy ZoneID mà manager đang quản lý (theo AccountID)
  const getZoneIdByManager = (managerId) => {
    const zone = zones.find(z => z.ManagerID === managerId);
    return zone ? zone.ZoneID : '';
  };

  // Lấy tên zone theo ZoneID
  const getZoneName = (zoneId) => {
    const zone = zones.find(z => z.ZoneID === Number(zoneId));
    return zone ? zone.Zone_name : '';
  };

  // Khi đổi zone cho manager: cập nhật ManagerID của zone cũ và mới
  const handleZoneChange = (managerId, newZoneId) => {
    setZones(prevZones => {
      // Tìm zone hiện tại của manager (nếu có)
      const currentZone = prevZones.find(z => z.ManagerID === managerId);
      // Nếu manager đã quản lý zone nào thì bỏ quản lý zone đó
      let updatedZones = prevZones.map(z => {
        if (z.ManagerID === managerId) {
          return { ...z, ManagerID: null };
        }
        return z;
      });
      // Gán managerId cho zone mới (nếu chọn)
      updatedZones = updatedZones.map(z => {
        if (z.ZoneID === Number(newZoneId)) {
          return { ...z, ManagerID: managerId };
        }
        return z;
      });
      return updatedZones;
    });
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Cập nhật quận cho Manager thành công!');
    }, 800);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý theo Quận (Zone)</h2>
      <p className="mb-4 text-gray-600">Có thể thay đổi quận cho các Manager bằng cách chọn các quận.</p>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Tên Manager</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Quận đang quản lý</th>
              <th className="px-6 py-3 text-left">Thay đổi quận</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {managers.map(manager => (
              <tr key={manager.AccountID} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 font-medium">{manager.full_name}</td>
                <td className="px-6 py-4">{manager.email}</td>
                <td className="px-6 py-4">
                  {getZoneName(getZoneIdByManager(manager.AccountID)) || <span className="text-gray-400 italic">Chưa có</span>}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={getZoneIdByManager(manager.AccountID) || ''}
                    onChange={e => handleZoneChange(manager.AccountID, e.target.value)}
                    className="px-3 py-1 rounded-lg border border-gray-300"
                  >
                    <option value="">Chọn quận</option>
                    {zones.map(zone => (
                      <option key={zone.ZoneID} value={zone.ZoneID}>
                        {zone.Zone_name}
                        {zone.ManagerID && zone.ManagerID !== manager.AccountID ? ' (Đã có Manager)' : ''}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60"
        >
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </div>
  );
};

export default ManagerTab;