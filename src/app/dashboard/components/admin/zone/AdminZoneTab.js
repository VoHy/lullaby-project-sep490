import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, faPlus, faEdit, faTrash, faUsers, faUserMd,
  faSearch, faCity, faClock
} from '@fortawesome/free-solid-svg-icons';
import zonesMock from '@/mock/Zone';
import zoneDetailsMock from '@/mock/Zone_Detail';
import nursingSpecialists from '@/mock/NursingSpecialist';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
        <FontAwesomeIcon icon={icon} className="text-white text-xl" />
      </div>
    </div>
    <div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const AdminZoneTab = () => {
  const [zones, setZones] = useState(zonesMock);
  const [zoneDetails, setZoneDetails] = useState(zoneDetailsMock);
  const [selectedZone, setSelectedZone] = useState(null);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [zoneForm, setZoneForm] = useState({ ZoneID: '', Zone_name: '', City: '' });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [zoneDetailForm, setZoneDetailForm] = useState({ ZoneDetailID: '', ZoneID: '', Name: '', Note: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredZones = zones.filter(zone => 
    zone.Zone_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.City.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: 'Tổng khu vực',
      value: zones.length,
      icon: faMapMarkerAlt,
      color: 'from-blue-500 to-cyan-500',
      subtitle: 'Tất cả khu vực'
    },
    {
      title: 'Thành phố',
      value: new Set(zones.map(z => z.City)).size,
      icon: faCity,
      color: 'from-green-500 to-emerald-500',
      subtitle: 'Số thành phố'
    },
    {
      title: 'Y tá',
      value: nursingSpecialists.filter(n => n.ZoneID && n.NursingID).length,
      icon: faUsers,
      color: 'from-purple-500 to-pink-500',
      subtitle: 'Tổng y tá'
    },
    {
      title: 'Chuyên gia',
      value: nursingSpecialists.filter(n => n.ZoneID && n.NursingID).length,
      icon: faUserMd,
      color: 'from-orange-500 to-red-500',
      subtitle: 'Tổng chuyên gia'
    }
  ];

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
    if (confirm('Bạn có chắc chắn muốn xóa khu vực này?')) {
      setZones(zones.filter(z => z.ZoneID !== zoneId));
      setZoneDetails(zoneDetails.filter(d => d.ZoneID !== zoneId));
      setSelectedZone(null);
    }
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
    if (confirm('Bạn có chắc chắn muốn xóa chi tiết khu vực này?')) {
      setZoneDetails(zoneDetails.filter(d => d.ZoneDetailID !== detailId));
    }
  };

  // Xem nhân sự theo khu vực
  const getNursesByZone = (zoneId) => nursingSpecialists.filter(n => n.ZoneID === zoneId && n.NursingID);
  const getSpecialistsByZone = (zoneId) => nursingSpecialists.filter(n => n.ZoneID === zoneId && n.NursingID);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Header with Create Button */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Quản lý Khu vực</h2>
            <p className="text-gray-600 mt-1">Quản lý các khu vực và chi tiết khu vực</p>
          </div>
          <button 
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            onClick={() => handleOpenZoneModal()}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Thêm khu vực</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khu vực hoặc thành phố..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            {currentTime.toLocaleTimeString('vi-VN')}
          </div>
        </div>
      </div>

      {/* Zones Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Tên khu vực</th>
                <th className="px-6 py-4 text-left font-semibold">Thành phố</th>
                <th className="px-6 py-4 text-left font-semibold">Chi tiết</th>
                <th className="px-6 py-4 text-left font-semibold">Nhân sự</th>
                <th className="px-6 py-4 text-left font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredZones.map(zone => (
                <tr key={zone.ZoneID} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{zone.Zone_name}</p>
                        <p className="text-sm text-gray-600">ID: {zone.ZoneID}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faCity} className="text-gray-400" />
                      <span className="font-medium">{zone.City}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {zoneDetails.filter(d => d.ZoneID === zone.ZoneID).map(d => (
                        <div key={d.ZoneDetailID} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                          <div>
                            <span className="font-medium text-sm">{d.Name}</span>
                            {d.Note && <span className="text-xs text-gray-500 ml-2">({d.Note})</span>}
                          </div>
                          <div className="flex space-x-1">
                            <button 
                              className="text-blue-600 hover:text-blue-800 text-xs p-1 hover:bg-blue-50 rounded"
                              onClick={() => handleOpenZoneDetailModal(d, zone.ZoneID)}
                              title="Sửa"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button 
                              className="text-red-500 hover:text-red-700 text-xs p-1 hover:bg-red-50 rounded"
                              onClick={() => handleDeleteZoneDetail(d.ZoneDetailID)}
                              title="Xóa"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button 
                        className="text-sm text-purple-600 hover:text-purple-800 hover:underline flex items-center space-x-1"
                        onClick={() => handleOpenZoneDetailModal(null, zone.ZoneID)}
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                        <span>Thêm chi tiết</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
                        <span>Y tá: {getNursesByZone(zone.ZoneID).length}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <FontAwesomeIcon icon={faUserMd} className="text-green-500" />
                        <span>Chuyên gia: {getSpecialistsByZone(zone.ZoneID).length}</span>
                      </div>
                      <button 
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={() => setSelectedZone(zone.ZoneID)}
                      >
                        Xem nhân sự
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                        onClick={() => handleOpenZoneModal(zone)}
                        title="Sửa"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                        onClick={() => handleDeleteZone(zone.ZoneID)}
                        title="Xóa"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal thêm/sửa Zone */}
      {showZoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl font-bold z-10" onClick={() => setShowZoneModal(false)}>&times;</button>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                {zoneForm.ZoneID ? 'Sửa khu vực' : 'Thêm khu vực'}
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên khu vực</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  placeholder="Nhập tên khu vực"
                  value={zoneForm.Zone_name} 
                  onChange={e => setZoneForm(f => ({ ...f, Zone_name: e.target.value }))} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  placeholder="Nhập tên thành phố"
                  value={zoneForm.City} 
                  onChange={e => setZoneForm(f => ({ ...f, City: e.target.value }))} 
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button 
                className="px-6 py-2 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all duration-300" 
                onClick={() => setShowZoneModal(false)}
              >
                Hủy
              </button>
              <button 
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
                onClick={handleSaveZone}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm/sửa ZoneDetail */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl font-bold z-10" onClick={() => setShowDetailModal(false)}>&times;</button>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                {zoneDetailForm.ZoneDetailID ? 'Sửa chi tiết khu vực' : 'Thêm chi tiết khu vực'}
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên chi tiết</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  placeholder="Nhập tên chi tiết khu vực"
                  value={zoneDetailForm.Name} 
                  onChange={e => setZoneDetailForm(f => ({ ...f, Name: e.target.value }))} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  placeholder="Nhập ghi chú (tùy chọn)"
                  rows="3"
                  value={zoneDetailForm.Note} 
                  onChange={e => setZoneDetailForm(f => ({ ...f, Note: e.target.value }))} 
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button 
                className="px-6 py-2 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all duration-300" 
                onClick={() => setShowDetailModal(false)}
              >
                Hủy
              </button>
              <button 
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
                onClick={handleSaveZoneDetail}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Xem nhân sự theo khu vực */}
      {selectedZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm overflow-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative my-8 mx-2">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl font-bold z-10" onClick={() => setSelectedZone(null)}>&times;</button>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Nhân sự khu vực</h3>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  Y tá ({getNursesByZone(selectedZone).length})
                </h4>
                <ul className="space-y-2">
                  {getNursesByZone(selectedZone).length === 0 ? (
                    <li className="text-gray-400 text-sm">Không có y tá nào</li>
                  ) : (
                    getNursesByZone(selectedZone).map(n => (
                      <li key={n.AccountID} className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="font-medium text-sm">{n.FullName}</span>
                        <span className="text-xs text-gray-500">{n.Address}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <FontAwesomeIcon icon={faUserMd} className="mr-2" />
                  Chuyên gia ({getSpecialistsByZone(selectedZone).length})
                </h4>
                <ul className="space-y-2">
                  {getSpecialistsByZone(selectedZone).length === 0 ? (
                    <li className="text-gray-400 text-sm">Không có chuyên gia nào</li>
                  ) : (
                    getSpecialistsByZone(selectedZone).map(s => (
                      <li key={s.AccountID} className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="font-medium text-sm">{s.FullName}</span>
                        <span className="text-xs text-gray-500">{s.Address}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button 
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedZone(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminZoneTab; 