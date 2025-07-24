import { useState } from 'react';
import zonesMock from '@/mock/Zone';
import zoneDetailsMock from '@/mock/Zone_Detail';
import nursingSpecialists from '@/mock/NursingSpecialist';

const AdminZoneTab = () => {
  const [zones, setZones] = useState(zonesMock);
  const [zoneDetails, setZoneDetails] = useState(zoneDetailsMock);
  const [selectedZone, setSelectedZone] = useState(null);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [zoneForm, setZoneForm] = useState({ ZoneID: '', Zone_name: '', City: '' });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [zoneDetailForm, setZoneDetailForm] = useState({ ZoneDetailID: '', ZoneID: '', Name: '', Note: '' });

  // Thêm/sửa Zone
  const handleOpenZoneModal = (zone = null) => {
    setZoneForm(zone ? { ...zone } : { ZoneID: '', Zone_name: '', City: '' });
    setShowZoneModal(true);
  };
  const handleSaveZone = () => {
    if (zoneForm.ZoneID) {
      setZones(zones.map(z => z.ZoneID === zoneForm.ZoneID ? { ...zoneForm, ZoneID: Number(zoneForm.ZoneID) } : z));
    } else {
      const newId = Math.max(...zones.map(z => z.ZoneID)) + 1;
      setZones([...zones, { ...zoneForm, ZoneID: newId }]);
    }
    setShowZoneModal(false);
  };
  const handleDeleteZone = (zoneId) => {
    setZones(zones.filter(z => z.ZoneID !== zoneId));
    setZoneDetails(zoneDetails.filter(d => d.ZoneID !== zoneId));
    setSelectedZone(null);
  };

  // Thêm/sửa ZoneDetail
  const handleOpenZoneDetailModal = (detail = null, zoneId = null) => {
    setZoneDetailForm(detail ? { ...detail } : { ZoneDetailID: '', ZoneID: zoneId || '', Name: '', Note: '' });
    setShowDetailModal(true);
  };
  const handleSaveZoneDetail = () => {
    if (zoneDetailForm.ZoneDetailID) {
      setZoneDetails(zoneDetails.map(d => d.ZoneDetailID === zoneDetailForm.ZoneDetailID ? { ...zoneDetailForm, ZoneDetailID: Number(zoneDetailForm.ZoneDetailID), ZoneID: Number(zoneDetailForm.ZoneID) } : d));
    } else {
      const newId = Math.max(0, ...zoneDetails.map(d => d.ZoneDetailID)) + 1;
      setZoneDetails([...zoneDetails, { ...zoneDetailForm, ZoneDetailID: newId, ZoneID: Number(zoneDetailForm.ZoneID) }]);
    }
    setShowDetailModal(false);
  };
  const handleDeleteZoneDetail = (detailId) => {
    setZoneDetails(zoneDetails.filter(d => d.ZoneDetailID !== detailId));
  };

  // Xem nhân sự theo khu vực
  const getNursesByZone = (zoneId) => nursingSpecialists.filter(n => n.ZoneID === zoneId && n.NursingID);
  const getSpecialistsByZone = (zoneId) => nursingSpecialists.filter(n => n.ZoneID === zoneId && n.SpecialistID);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Khu vực</h2>
      <div className="mb-4 flex justify-between items-center">
        <span className="font-semibold text-lg">Danh sách khu vực</span>
        <button className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg" onClick={() => handleOpenZoneModal()}>Thêm khu vực</button>
      </div>
      <div className="overflow-x-auto mb-8">
        <table className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Tên khu vực</th>
              <th className="px-6 py-3 text-left">Thành phố</th>
              <th className="px-6 py-3 text-left">Chi tiết</th>
              <th className="px-6 py-3 text-left">Nhân sự</th>
              <th className="px-6 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {zones.map(zone => (
              <tr key={zone.ZoneID} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{zone.Zone_name}</td>
                <td className="px-6 py-4">{zone.City}</td>
                <td className="px-6 py-4">
                  <ul className="list-disc pl-4">
                    {zoneDetails.filter(d => d.ZoneID === zone.ZoneID).map(d => (
                      <li key={d.ZoneDetailID} className="mb-1 flex items-center justify-between">
                        <span>{d.Name} <span className="text-xs text-gray-400">({d.Note})</span></span>
                        <span>
                          <button className="text-blue-600 hover:underline mr-2" onClick={() => handleOpenZoneDetailModal(d, zone.ZoneID)}>Sửa</button>
                          <button className="text-red-500 hover:underline" onClick={() => handleDeleteZoneDetail(d.ZoneDetailID)}>Xóa</button>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button className="text-sm text-purple-600 hover:underline mt-2" onClick={() => handleOpenZoneDetailModal(null, zone.ZoneID)}>+ Thêm chi tiết</button>
                </td>
                <td className="px-6 py-4">
                  <div className="mb-1 text-xs text-gray-600">Y tá: {getNursesByZone(zone.ZoneID).length}</div>
                  <div className="mb-1 text-xs text-gray-600">Chuyên gia: {getSpecialistsByZone(zone.ZoneID).length}</div>
                  <button className="text-xs text-blue-600 hover:underline" onClick={() => setSelectedZone(zone.ZoneID)}>Xem nhân sự</button>
                </td>
                <td className="px-6 py-4">
                  <button className="text-yellow-600 hover:underline mr-2" onClick={() => handleOpenZoneModal(zone)}>Sửa</button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDeleteZone(zone.ZoneID)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal thêm/sửa Zone */}
      {showZoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-pink-500 text-2xl font-bold z-10" onClick={() => setShowZoneModal(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">{zoneForm.ZoneID ? 'Sửa khu vực' : 'Thêm khu vực'}</h3>
            <div className="space-y-3">
              <input className="w-full px-3 py-2 border rounded mb-2" placeholder="Tên khu vực" value={zoneForm.Zone_name} onChange={e => setZoneForm(f => ({ ...f, Zone_name: e.target.value }))} />
              <input className="w-full px-3 py-2 border rounded mb-2" placeholder="Thành phố" value={zoneForm.City} onChange={e => setZoneForm(f => ({ ...f, City: e.target.value }))} />
            </div>
            <div className="flex justify-end mt-4">
              <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg" onClick={handleSaveZone}>Lưu</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal thêm/sửa ZoneDetail */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-pink-500 text-2xl font-bold z-10" onClick={() => setShowDetailModal(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">{zoneDetailForm.ZoneDetailID ? 'Sửa chi tiết khu vực' : 'Thêm chi tiết khu vực'}</h3>
            <div className="space-y-3">
              <input className="w-full px-3 py-2 border rounded mb-2" placeholder="Tên chi tiết khu vực" value={zoneDetailForm.Name} onChange={e => setZoneDetailForm(f => ({ ...f, Name: e.target.value }))} />
              <input className="w-full px-3 py-2 border rounded mb-2" placeholder="Ghi chú" value={zoneDetailForm.Note} onChange={e => setZoneDetailForm(f => ({ ...f, Note: e.target.value }))} />
            </div>
            <div className="flex justify-end mt-4">
              <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg" onClick={handleSaveZoneDetail}>Lưu</button>
            </div>
          </div>
        </div>
      )}
      {/* Xem nhân sự theo khu vực */}
      {selectedZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm overflow-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative my-8 mx-2">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-pink-500 text-2xl font-bold z-10" onClick={() => setSelectedZone(null)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Nhân sự khu vực</h3>
            <div className="mb-2 font-semibold">Y tá:</div>
            <ul className="mb-4 list-disc pl-6">
              {getNursesByZone(selectedZone).length === 0 && <li className="text-gray-400">Không có y tá nào</li>}
              {getNursesByZone(selectedZone).map(n => <li key={n.AccountID}>{n.Nurse_Name} <span className="text-xs text-gray-500">({n.Address})</span></li>)}
            </ul>
            <div className="mb-2 font-semibold">Chuyên gia:</div>
            <ul className="mb-2 list-disc pl-6">
              {getSpecialistsByZone(selectedZone).length === 0 && <li className="text-gray-400">Không có chuyên gia nào</li>}
              {getSpecialistsByZone(selectedZone).map(s => <li key={s.AccountID}>{s.Specialist_Name} <span className="text-xs text-gray-500">({s.Address})</span></li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminZoneTab; 