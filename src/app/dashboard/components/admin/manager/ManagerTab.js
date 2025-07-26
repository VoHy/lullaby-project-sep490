import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, faPlus, faEye, faEdit, faTrash, faSearch, faFilter,
  faUsers, faChartLine, faClock, faSave
} from '@fortawesome/free-solid-svg-icons';
import accounts from '@/mock/Account';
import zonesData from '@/mock/Zone';
import CreateManagerModal from './CreateManagerModal';
import ManagerDetailModal from './ManagerDetailModal';

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

const ManagerTab = () => {
  // Lọc ra các manager
  const [managers, setManagers] = useState(accounts.filter(acc => acc.role_id === 4));
  const [zones, setZones] = useState(zonesData);
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredManagers = managers.filter(manager => {
    const matchesSearch = manager.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || manager.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: 'Tổng Manager',
      value: managers.length,
      icon: faUserMd,
      color: 'from-blue-500 to-cyan-500',
      subtitle: 'Tất cả Manager'
    },
    {
      title: 'Đang hoạt động',
      value: managers.filter(m => m.status === 'active').length,
      icon: faUsers,
      color: 'from-green-500 to-emerald-500',
      subtitle: 'Manager hoạt động'
    },
    {
      title: 'Tạm khóa',
      value: managers.filter(m => m.status === 'inactive').length,
      icon: faChartLine,
      color: 'from-orange-500 to-red-500',
      subtitle: 'Manager tạm khóa'
    }
  ];

  const handleCreateManager = async (accountData) => {
    try {
      // Tạo account mới với thông tin cơ bản
      const newAccount = {
        ...accountData,
        AccountID: Date.now(),
        role_name: "Quản lý",
        created_at: new Date().toISOString()
      };

      // Thêm vào danh sách managers
      setManagers(prev => [...prev, newAccount]);

      // Nếu có chọn khu vực quản lý, cập nhật Zone
      if (accountData.zone_id) {
        setZones(prevZones => 
          prevZones.map(zone => 
            zone.ZoneID === Number(accountData.zone_id) 
              ? { ...zone, AccountID: newAccount.AccountID }
              : zone
          )
        );
      }

      alert('Tạo Manager thành công!');
    } catch (error) {
      console.error('Error creating manager:', error);
      alert('Có lỗi xảy ra khi tạo Manager!');
    }
  };

  const handleViewDetail = (manager) => {
    setSelectedManager(manager);
    setShowDetailModal(true);
  };

  const handleUpdateManager = async (managerId, updatedData) => {
    try {
      setManagers(prev => 
        prev.map(m => m.AccountID === managerId ? { ...m, ...updatedData } : m)
      );

      alert('Cập nhật Manager thành công!');
    } catch (error) {
      console.error('Error updating manager:', error);
      alert('Có lỗi xảy ra khi cập nhật Manager!');
    }
  };

  const handleDeleteManager = (managerId) => {
    if (confirm('Bạn có chắc chắn muốn xóa Manager này?')) {
      setManagers(prev => prev.filter(m => m.AccountID !== managerId));
      
      // Xóa zone assignment khi xóa Manager
      setZones(prevZones => 
        prevZones.map(zone => 
          zone.AccountID === managerId ? { ...zone, AccountID: null } : zone
        )
      );
      
      alert('Xóa Manager thành công!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Manager</h2>
          <p className="text-gray-600">Quản lý các Manager trong hệ thống</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {currentTime.toLocaleString('vi-VN')}
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Thêm Manager
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm Manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm khóa</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Manager List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Manager</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Số điện thoại</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Khu vực quản lý</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ngày tạo</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredManagers.map((manager) => {
                // Tìm khu vực mà Manager đang quản lý
                const managedZone = zones.find(zone => zone.AccountID === manager.AccountID);
                
                return (
                  <tr key={manager.AccountID} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {manager.full_name?.charAt(0) || 'M'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{manager.full_name}</div>
                          <div className="text-sm text-gray-500">ID: {manager.AccountID}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{manager.email}</td>
                    <td className="px-6 py-4 text-gray-700">{manager.phone_number}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {managedZone ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {managedZone.Zone_name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Chưa phân công</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        manager.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {manager.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {manager.created_at ? new Date(manager.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewDetail(manager)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => handleViewDetail(manager)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleDeleteManager(manager.AccountID)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredManagers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">Không tìm thấy Manager nào</div>
            <div className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateManagerModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateManager}
      />

      <ManagerDetailModal
        show={showDetailModal}
        manager={selectedManager}
        onClose={() => setShowDetailModal(false)}
        onSave={handleUpdateManager}
      />
    </div>
  );
};

export default ManagerTab;