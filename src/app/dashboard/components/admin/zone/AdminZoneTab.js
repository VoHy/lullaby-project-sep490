import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt, faPlus, faEdit, faTrash, faUsers, faUserMd,
  faSearch, faCity, faClock
} from '@fortawesome/free-solid-svg-icons';
import zoneService from '@/services/api/zoneService';
import zoneDetailService from '@/services/api/zoneDetailService';
import accountService from '@/services/api/accountService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import ZoneModal from './ZoneModal';
import ZoneDetailModal from './ZoneDetailModal';
import StaffViewModal from './StaffViewModal';

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
  const [zoneDetails, setZoneDetails] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [zoneForm, setZoneForm] = useState({ zoneID: '', zoneName: '', city: '', accountID: '' });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [zoneDetailForm, setZoneDetailForm] = useState({ zoneDetailID: '', zoneID: '', name: '', note: '' });
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
      const [zonesData, zoneDetailsData, specialistsData, accountsData] = await Promise.all([
        zoneService.getZones(),
        zoneDetailService.getZoneDetails(),
        nursingSpecialistService.getNursingSpecialists(),
        accountService.getAllAccounts()
      ]);
      setZones(zonesData);
      setZoneDetails(zoneDetailsData);
      setNursingSpecialists(specialistsData);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Không thể tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  // ======== MEMOIZED DATA ========

  const filteredZones = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return zones.filter(z =>
      z.zoneName?.toLowerCase().includes(term) ||
      z.city?.toLowerCase().includes(term)
    );
  }, [zones, searchTerm]);

  const zoneDetailsMap = useMemo(() => {
    const map = {};
    zoneDetails.forEach(d => {
      if (!map[d.zoneID]) map[d.zoneID] = [];
      map[d.zoneID].push(d);
    });
    return map;
  }, [zoneDetails]);

  const staffCountMap = useMemo(() => {
    const nurses = {}, specialists = {};
    nursingSpecialists.forEach(n => {
      if (n.major === 'nurse' || n.major === 'Y tá' || n.major === 'Nurse') {
        nurses[n.zoneID] = (nurses[n.zoneID] || 0) + 1;
      } else if (n.major === 'Chuyên gia' || n.major === 'specialist' || n.major === 'Specialist') {
        specialists[n.zoneID] = (specialists[n.zoneID] || 0) + 1;
      }
    });
    return { nurses, specialists };
  }, [nursingSpecialists]);

  const getManagerByZone = (zoneId) => {
    const zone = zones.find(z => z.zoneID === zoneId);
    if (!zone?.managerID) return null;
    return accounts.find(acc => acc.accountID === zone.managerID);
  };

  const getManagerCurrentZone = (managerId) =>
    zones.find(zone => zone.managerID === managerId);

  const getManagerZoneInfo = (managerId) => {
    const currentZone = getManagerCurrentZone(managerId);
    if (!currentZone) return null;
    return {
      zoneName: currentZone.zoneName,
      city: currentZone.city,
      zoneID: currentZone.zoneID
    };
  };

  const isManagerAssignedToOtherZone = (managerId, currentZoneId = null) => {
    const currentZone = getManagerCurrentZone(managerId);
    return currentZone && currentZone.zoneID !== currentZoneId;
  };

  const stats = useMemo(() => [
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
      title: 'Chuyên gia chăm sóc',
      value: Object.values(staffCountMap.nurses).reduce((a, b) => a + b, 0),
      icon: faUsers,
      color: 'from-purple-500 to-pink-500',
      subtitle: 'Tổng'
    },
    {
      title: 'Chuyên viên tư vấn',
      value: Object.values(staffCountMap.specialists).reduce((a, b) => a + b, 0),
      icon: faUserMd,
      color: 'from-orange-500 to-red-500',
      subtitle: 'Tổng'
    }
  ], [zones, staffCountMap]);

  // ======== CRUD ZONE ========
  const handleOpenZoneModal = (zone = null) => {
    setZoneForm(zone ? {
      zoneID: zone.zoneID,
      zoneName: zone.zoneName,
      city: zone.city,
      accountID: zone.managerID || ''
    } : { zoneID: '', zoneName: '', city: '', accountID: '' });
    setShowZoneModal(true);
  };

  const handleSaveZone = async () => {
    if (!zoneForm.zoneName.trim()) return alert('Vui lòng nhập tên khu vực!');
    if (!zoneForm.city.trim()) return alert('Vui lòng nhập tên thành phố!');
    if (!zoneForm.accountID) return alert('Vui lòng chọn quản lý!');

    const managerID = zoneForm.accountID;
    try {
      if (zoneForm.zoneID) {
        await zoneService.updateZone(zoneForm.zoneID, {
          zoneID: zoneForm.zoneID,
          zoneName: zoneForm.zoneName.trim(),
          city: zoneForm.city.trim(),
          managerID
        });
        alert('Cập nhật khu vực thành công!');
      } else {
        await zoneService.createZone({
          zoneID: 0,
          zoneName: zoneForm.zoneName.trim(),
          city: zoneForm.city.trim(),
          managerID
        });
        alert('Tạo khu vực thành công!');
      }
      await fetchData();
      setShowZoneModal(false);
    } catch (error) {
      console.error(error);
      alert('Thao tác thất bại!');
    }
  };

  const handleDeleteZone = async (zoneId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khu vực này?')) return;
    try {
      await zoneService.deleteZone(zoneId);
      alert('Xóa khu vực thành công!');
      await fetchData();
      setSelectedZone(null);
    } catch (error) {
      alert('Xóa khu vực thất bại!');
    }
  };

  // ======== CRUD ZONE DETAIL ========
  const handleOpenZoneDetailModal = (detail = null, zoneId = null) => {
    setZoneDetailForm(detail ? {
      zoneDetailID: detail.zoneDetailID,
      zoneID: detail.zoneID,
      name: detail.name,
      note: detail.note
    } : {
      zoneDetailID: '',
      zoneID: zoneId || '',
      name: '',
      note: ''
    });
    setShowDetailModal(true);
  };

  const handleSaveZoneDetail = async () => {
    if (!zoneDetailForm.name.trim()) return alert('Vui lòng nhập tên chi tiết khu vực!');
    if (!zoneDetailForm.zoneID) return alert('Vui lòng chọn khu vực!');
    try {
      if (zoneDetailForm.zoneDetailID) {
        await zoneDetailService.updateZoneDetail(zoneDetailForm.zoneDetailID, {
          zoneDetailID: zoneDetailForm.zoneDetailID,
          zoneID: parseInt(zoneDetailForm.zoneID),
          name: zoneDetailForm.name.trim(),
          note: zoneDetailForm.note.trim()
        });
        alert('Cập nhật chi tiết thành công!');
      } else {
        await zoneDetailService.createZoneDetail({
          zoneDetailID: 0,
          zoneID: parseInt(zoneDetailForm.zoneID),
          name: zoneDetailForm.name.trim(),
          note: zoneDetailForm.note.trim()
        });
        alert('Tạo chi tiết thành công!');
      }
      await fetchData();
      setShowDetailModal(false);
    } catch (error) {
      alert('Thao tác thất bại!');
    }
  };

  const handleDeleteZoneDetail = async (detailId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chi tiết khu vực này?')) return;
    try {
      await zoneDetailService.deleteZoneDetail(detailId);
      alert('Xóa chi tiết thành công!');
      await fetchData();
    } catch (error) {
      alert('Xóa chi tiết thất bại!');
    }
  };

  // ======== UI ========
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
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

      {/* Search */}
      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row gap-4">
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

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Tên khu vực</th>
                <th className="px-6 py-4 text-left">Thành phố</th>
                <th className="px-6 py-4 text-left">Chi tiết</th>
                <th className="px-6 py-4 text-left">Nhân sự</th>
                <th className="px-6 py-4 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredZones.map(zone => (
                <tr key={zone.zoneID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{zone.zoneName} <div className="text-sm text-gray-500">ID: {zone.zoneID}</div></td>
                  <td className="px-6 py-4">{zone.city}</td>
                  <td className="px-6 py-4">
                    {(zoneDetailsMap[zone.zoneID] || []).map(d => (
                      <div key={d.zoneDetailID} className="flex justify-between bg-gray-50 p-2 rounded-lg mb-1">
                        <span>{d.name} {d.note && <span className="text-xs text-gray-500">({d.note})</span>}</span>
                        <div>
                          <button className="text-blue-600 mr-1" onClick={() => handleOpenZoneDetailModal(d, zone.zoneID)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button className="text-red-600" onClick={() => handleDeleteZoneDetail(d.zoneDetailID)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      className="text-sm text-purple-600 hover:underline mt-1"
                      onClick={() => handleOpenZoneDetailModal(null, zone.zoneID)}
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-xs" /> Thêm chi tiết
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`text-sm font-medium ${getManagerByZone(zone.zoneID) ? 'text-green-600' : 'text-red-500'
                        }`}
                    >
                      Quản lý: {getManagerByZone(zone.zoneID)?.fullName || 'Chưa có'}
                    </div>

                    <div className="text-sm">Chuyên gia chăm sóc: {staffCountMap.nurses[zone.zoneID] || 0}</div>
                    <div className="text-sm">Chuyên viên tư vấn: {staffCountMap.specialists[zone.zoneID] || 0}</div>

                    <button
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => setSelectedZone(zone.zoneID)}
                    >
                      Xem nhân sự
                    </button>
                  </td>

                  <td className="px-6 py-4 flex space-x-2">
                    <button className="text-yellow-600" onClick={() => handleOpenZoneModal(zone)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="text-red-600" onClick={() => handleDeleteZone(zone.zoneID)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showZoneModal && (
        <ZoneModal
          showZoneModal={showZoneModal}
          setShowZoneModal={setShowZoneModal}
          zoneForm={zoneForm}
          setZoneForm={setZoneForm}
          handleSaveZone={handleSaveZone}
          accounts={accounts}
          zones={zones}
          getManagerZoneInfo={getManagerZoneInfo}
          isManagerAssignedToOtherZone={isManagerAssignedToOtherZone}
        />
      )}

      {showDetailModal && (
        <ZoneDetailModal
          showDetailModal={showDetailModal}
          setShowDetailModal={setShowDetailModal}
          zonedetailForm={zoneDetailForm}
          setZonedetailForm={setZoneDetailForm}
          handleSaveZonedetail={handleSaveZoneDetail}
          zones={zones}
        />
      )}

      {selectedZone && (
        <StaffViewModal
          showStaffModal={!!selectedZone}
          setShowStaffModal={() => setSelectedZone(null)}
          selectedZone={zones.find(z => z.zoneID === selectedZone)}
          getNursesByZone={(id) => nursingSpecialists.filter(n => n.zoneID === id && (n.major === 'nurse' || n.major === 'Y tá' || n.major === 'Nurse'))}
          getSpecialistsByZone={(id) => nursingSpecialists.filter(n => n.zoneID === id && (n.major === 'Chuyên gia' || n.major === 'specialist' || n.major === 'Specialist'))}
          getManagerByZone={getManagerByZone}
        />
      )}
    </div>
  );
};

export default AdminZoneTab;
