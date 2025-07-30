import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, faPlus, faEdit, faTrash, faUsers, faUserMd,
  faSearch, faCity, faClock, faUserTie
} from '@fortawesome/free-solid-svg-icons';
import zoneService from '@/services/api/zoneService';
import accountService from '@/services/api/accountService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';

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
  const [zones, setZones] = useState([]);
  const [zonedetails, setZonedetails] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [zoneForm, setZoneForm] = useState({ zoneID: '', zoneName: '', city: '', managerID: '' });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [zonedetailForm, setZonedetailForm] = useState({ zonedetailid: '', zoneID: '', name: '', note: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [zonesData, zonedetailsData, specialistsData, accountsData] = await Promise.all([
        zoneService.getZones(),
        zoneService.getZoneDetails(),
        nursingSpecialistService.getNursingSpecialists(),
        accountService.getAllAccounts()
      ]);
      setZones(zonesData);
      setZonedetails(zonedetailsData);
      setNursingSpecialists(specialistsData);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Không thể tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const filteredZones = zones.filter(zone => 
    zone.zoneName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.city?.toLowerCase().includes(searchTerm.toLowerCase())
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
      value: new Set(zones.map(z => z.city)).size,
      icon: faCity,
      color: 'from-green-500 to-emerald-500',
      subtitle: 'Số thành phố'
    },
    {
      title: 'Y tá',
      value: nursingSpecialists.filter(n => n.zoneID && n.nursingID).length,
      icon: faUsers,
      color: 'from-purple-500 to-pink-500',
      subtitle: 'Tổng y tá'
    },
    {
      title: 'Chuyên gia',
      value: nursingSpecialists.filter(n => n.zoneID && n.nursingID).length,
      icon: faUserMd,
      color: 'from-orange-500 to-red-500',
      subtitle: 'Tổng chuyên gia'
    }
  ];

  // Thêm/sửa Zone
  const handleOpenZoneModal = (zone = null) => {
    setZoneForm(zone ? { 
      zoneID: zone.zoneID, 
      zoneName: zone.zoneName, 
      city: zone.city,
      managerID: zone.managerID || '' // Ensure managerID is set if zone exists
    } : { zoneID: '', zoneName: '', city: '', managerID: '' });
    setShowZoneModal(true);
  };

  const handleSaveZone = async () => {
    try {
      // Validation
      if (!zoneForm.zoneName.trim()) {
        alert('Vui lòng nhập tên khu vực!');
        return;
      }
      
      if (!zoneForm.city.trim()) {
        alert('Vui lòng nhập tên thành phố!');
        return;
      }

      if (!zoneForm.managerID) {
        alert('Vui lòng chọn quản lý!');
        return;
      }

      // Sử dụng managerID từ form
      const managerID = zoneForm.managerID;

      if (zoneForm.zoneID) {
        // Update existing zone
        await zoneService.updateZone(zoneForm.zoneID, {
          zoneName: zoneForm.zoneName.trim(),
          city: zoneForm.city.trim(),
          managerID: managerID
        });
        alert('Cập nhật khu vực thành công!');
      } else {
        // Create new zone
        await zoneService.createZone({
          zoneName: zoneForm.zoneName.trim(),
          city: zoneForm.city.trim(),
          managerID: managerID
        });
        alert('Tạo khu vực thành công!');
      }
      await fetchData(); // Reload data
      setShowZoneModal(false);
    } catch (error) {
      alert('Thao tác thất bại!');
      console.error('Error saving zone:', error);
    }
  };

  const handleDeleteZone = async (zoneId) => {
    if (confirm('Bạn có chắc chắn muốn xóa khu vực này?')) {
      try {
        await zoneService.deleteZone(zoneId);
        alert('Xóa khu vực thành công!');
        await fetchData(); // Reload data
        setSelectedZone(null);
      } catch (error) {
        alert('Xóa khu vực thất bại!');
        console.error('Error deleting zone:', error);
      }
    }
  };

  // Thêm/sửa ZoneDetail
  const handleOpenZonedetailModal = (detail = null, zoneId = null) => {
    setZonedetailForm(detail ? { 
      zonedetailid: detail.zonedetailid, 
      zoneID: detail.zoneID, 
      name: detail.name, 
      note: detail.note 
    } : { 
      zonedetailid: '', 
      zoneID: zoneId || '', 
      name: '', 
      note: '' 
    });
    setShowDetailModal(true);
  };

  const handleSaveZonedetail = async () => {
    try {
      // Validation
      if (!zonedetailForm.name.trim()) {
        alert('Vui lòng nhập tên chi tiết khu vực!');
        return;
      }
      
      if (!zonedetailForm.zoneID) {
        alert('Vui lòng chọn khu vực!');
        return;
      }

      if (zonedetailForm.zonedetailid) {
        // Update existing zone detail - chỉ gửi name và note
        const updateData = {
          name: zonedetailForm.name.trim(),
          note: zonedetailForm.note.trim()
        };
        console.log('Update zone detail data:', updateData);
        await zoneService.updateZoneDetail(zonedetailForm.zonedetailid, updateData);
        alert('Cập nhật chi tiết khu vực thành công!');
      } else {
        // Create new zone detail
        await zoneService.createZoneDetail({
          zoneID: parseInt(zonedetailForm.zoneID),
          name: zonedetailForm.name.trim(),
          note: zonedetailForm.note.trim()
        });
        alert('Tạo chi tiết khu vực thành công!');
      }
      await fetchData(); // Reload data
      setShowDetailModal(false);
    } catch (error) {
      alert('Thao tác thất bại!');
      console.error('Error saving zone detail:', error);
    }
  };

  const handleDeleteZonedetail = async (detailId) => {
    if (confirm('Bạn có chắc chắn muốn xóa chi tiết khu vực này?')) {
      try {
        await zoneService.deleteZoneDetail(detailId);
        alert('Xóa chi tiết khu vực thành công!');
        await fetchData(); // Reload data
      } catch (error) {
        alert('Xóa chi tiết khu vực thất bại!');
        console.error('Error deleting zone detail:', error);
      }
    }
  };

  // Xem nhân sự theo khu vực
  const getNursesByZone = (zoneId) =>
    nursingSpecialists.filter(n => n.zoneID === zoneId && n.major === 'Y tá');

  const getSpecialistsByZone = (zoneId) =>
    nursingSpecialists.filter(n => n.zoneID === zoneId && n.major === 'Chuyên gia');

  // Lấy Manager theo AccountID của Zone
  const getManagerByZone = (zoneId) => {
    const zone = zones.find(z => z.zoneID === zoneId);
    if (!zone || !zone.accountID) return null;
    return accounts.find(acc => acc.accountID === zone.accountID && acc.roleID === 4);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

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
                <tr key={zone.zoneID} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{zone.zoneName}</p>
                        <p className="text-sm text-gray-600">ID: {zone.zoneID}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faCity} className="text-gray-400" />
                      <span className="font-medium">{zone.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {zonedetails.filter(d => d.zoneID === zone.zoneID).map(d => (
                        <div key={d.zonedetailid} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                          <div>
                            <span className="font-medium text-sm">{d.name}</span>
                            {d.note && <span className="text-xs text-gray-500 ml-2">({d.note})</span>}
                          </div>
                          <div className="flex space-x-1">
                            <button 
                              className="text-blue-600 hover:text-blue-800 text-xs p-1 hover:bg-blue-50 rounded"
                              onClick={() => handleOpenZonedetailModal(d, zone.zoneID)}
                              title="Sửa"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button 
                              className="text-red-500 hover:text-red-700 text-xs p-1 hover:bg-red-50 rounded"
                              onClick={() => handleDeleteZonedetail(d.zonedetailid)}
                              title="Xóa"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button 
                        className="text-sm text-purple-600 hover:text-purple-800 hover:underline flex items-center space-x-1"
                        onClick={() => handleOpenZonedetailModal(null, zone.zoneID)}
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
                        <span>Y tá: {getNursesByZone(zone.zoneID).length}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <FontAwesomeIcon icon={faUserMd} className="text-green-500" />
                        <span>Chuyên gia: {getSpecialistsByZone(zone.zoneID).length}</span>
                      </div>
                      <button 
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={() => setSelectedZone(zone.zoneID)}
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
                        onClick={() => handleDeleteZone(zone.zoneID)}
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
                {zoneForm.zoneID ? 'Sửa khu vực' : 'Thêm khu vực'}
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên khu vực</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  placeholder="Nhập tên khu vực"
                  value={zoneForm.zoneName} 
                  onChange={e => setZoneForm(f => ({ ...f, zoneName: e.target.value }))} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  placeholder="Nhập tên thành phố"
                  value={zoneForm.city} 
                  onChange={e => setZoneForm(f => ({ ...f, city: e.target.value }))} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quản lý</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={zoneForm.managerID}
                  onChange={e => setZoneForm(f => ({ ...f, managerID: parseInt(e.target.value) }))}
                >
                  <option value="">Chọn quản lý</option>
                  {accounts.filter(acc => acc.roleID === 3).map(manager => (
                    <option key={manager.accountID} value={manager.accountID}>{manager.fullName}</option>
                  ))}
                </select>
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
                {zonedetailForm.zonedetailid ? 'Sửa chi tiết khu vực' : 'Thêm chi tiết khu vực'}
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực</label>
                <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-700">
                  {zones.find(z => z.zoneID === parseInt(zonedetailForm.zoneID))?.zoneName || 'Không xác định'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên chi tiết</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  placeholder="Nhập tên chi tiết khu vực"
                  value={zonedetailForm.name} 
                  onChange={e => setZonedetailForm(f => ({ ...f, name: e.target.value }))} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  placeholder="Nhập ghi chú (tùy chọn)"
                  rows="3"
                  value={zonedetailForm.note} 
                  onChange={e => setZonedetailForm(f => ({ ...f, note: e.target.value }))} 
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
                onClick={handleSaveZonedetail}
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
              {/* Manager */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-xl">
                <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                  <FontAwesomeIcon icon={faUserTie} className="mr-2" />
                  Manager
                </h4>
                {getManagerByZone(selectedZone) ? (
                  <div className="flex flex-col gap-1 p-2 bg-white rounded border">
                    <span className="font-medium text-sm">{getManagerByZone(selectedZone).fullName}</span>
                    <span className="text-xs text-gray-500">{getManagerByZone(selectedZone).email}</span>
                    <span className="text-xs text-gray-500">{getManagerByZone(selectedZone).phoneNumber}</span>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">Chưa có Manager</div>
                )}
              </div>
              {/* Y tá */}
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
                      <li key={n.accountID} className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="font-medium text-sm">{n.fullName}</span>
                        <span className="text-xs text-gray-500">{n.address}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              {/* Chuyên gia */}
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
                      <li key={s.accountID} className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="font-medium text-sm">{s.fullName}</span>
                        <span className="text-xs text-gray-500">{s.address}</span>
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