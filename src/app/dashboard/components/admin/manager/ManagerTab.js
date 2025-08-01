import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, faPlus, faEye, faTrash, faSearch, faFilter,
  faUsers, faChartLine, faExclamationTriangle, faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import CreateManagerModal from './CreateManagerModal';
import ManagerDetailModal from './ManagerDetailModal';
import accountService from '@/services/api/accountService';
import zoneService from '@/services/api/zoneService';

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

const MANAGER_STATUS = {
  ACTIVE: 'active',
  BANNED: 'banned',
  REMOVE: 'remove',
};

const ManagerTab = () => {
  const [managers, setManagers] = useState([]);
  const [zones, setZones] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeletedNotification, setShowDeletedNotification] = useState(false);
  const [deletedManagerName, setDeletedManagerName] = useState('');

  useEffect(() => {
    fetchManagers();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [managersData, zonesData] = await Promise.all([
        accountService.getManagers(),
        zoneService.getZones()
      ]);
      
      // Hiển thị tất cả manager trừ những manager đã bị xóa (remove)
      const visibleManagers = managersData.filter(manager => manager.status !== MANAGER_STATUS.REMOVE);
      setManagers(visibleManagers);
      setZones(zonesData);
    } catch (error) {
      console.error('Error fetching managers and zones:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm kiểm tra manager đã được khôi phục (có deletedAt nhưng status active)
  const isRestoredManager = (manager) => {
    return manager.deletedAt && manager.status === MANAGER_STATUS.ACTIVE;
  };

  // Hàm lấy trạng thái hiển thị cho manager
  const getManagerStatus = (manager) => {
    if (isRestoredManager(manager)) {
      return {
        text: 'Đã khôi phục',
        color: 'bg-yellow-100 text-yellow-700',
        description: 'Manager này đã được khôi phục sau khi xóa',
        icon: faExclamationCircle
      };
    }
    if (manager.status === MANAGER_STATUS.ACTIVE) {
      return {
        text: 'Hoạt động',
        color: 'bg-green-100 text-green-700',
        description: 'Manager đang hoạt động bình thường',
        icon: faUserMd
      };
    }
    if (manager.status === MANAGER_STATUS.BANNED) {
      return {
        text: 'Bị cấm',
        color: 'bg-red-100 text-red-700',
        description: 'Manager đã bị cấm (banned)',
        icon: faExclamationTriangle
      };
    }
    // Trường hợp khác (dự phòng)
    return {
      text: manager.status,
      color: 'bg-gray-100 text-gray-700',
      description: 'Trạng thái không xác định',
      icon: faExclamationTriangle
    };
  };

  const filteredManagers = managers.filter(manager => {
    const matchesSearch = manager.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email?.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesStatus = true;
    if (statusFilter === 'all') {
      matchesStatus = true;
    } else {
      matchesStatus = manager.status === statusFilter;
    }
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: 'Tổng Manager',
      value: managers.length,
      icon: faUserMd,
      color: 'from-blue-500 to-cyan-500',
      subtitle: 'Tổng số Manager (trừ đã xóa)'
    },
    {
      title: 'Đang hoạt động',
      value: managers.filter(m => m.status === MANAGER_STATUS.ACTIVE && !m.deletedAt).length,
      icon: faUsers,
      color: 'from-green-500 to-emerald-500',
      subtitle: 'Manager hoạt động bình thường'
    },
    {
      title: 'Đã khôi phục',
      value: managers.filter(m => isRestoredManager(m)).length,
      icon: faChartLine,
      color: 'from-yellow-500 to-orange-500',
      subtitle: 'Manager đã khôi phục sau xóa'
    },
    {
      title: 'Bị cấm',
      value: managers.filter(m => m.status === MANAGER_STATUS.BANNED).length,
      icon: faExclamationTriangle,
      color: 'from-orange-500 to-red-500',
      subtitle: 'Manager bị cấm (banned)'
    }
  ];

  const handleCreateManager = async () => {
    try {
      setSaving(true);
      await fetchManagers();
    } catch (error) {
      console.error('ManagerTab: Error in handleCreateManager:', error);
      alert('Có lỗi xảy ra khi refresh danh sách Manager!');
    } finally {
      setSaving(false);
    }
  };

  const handleViewDetail = (manager) => {
    setSelectedManager(manager);
    setShowDetailModal(true);
  };

  const handleUpdateManager = async (managerId, updatedData) => {
    try {
      setSaving(true);
      await accountService.updateManager(managerId, updatedData);
      await fetchManagers();
      alert('Cập nhật Manager thành công!');
    } catch (error) {
      console.error('Error updating manager:', error);
      alert(`Có lỗi xảy ra khi cập nhật Manager: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteManager = async (managerId) => {
    const managerToDelete = managers.find(m => m.accountID === managerId);
    const managerName = managerToDelete?.fullName || 'Manager';
    const isRestored = isRestoredManager(managerToDelete);

    let confirmMessage = `Bạn có chắc chắn muốn xóa Manager "${managerName}"? Hành động này sẽ đánh dấu Manager là đã xóa (soft delete).`;

    if (isRestored) {
      confirmMessage = `Manager "${managerName}" đã được khôi phục trước đó. Bạn có chắc chắn muốn xóa lại? Lưu ý: Manager này có thể không thể xóa được do đã bị xóa trước đó.`;
    }

    if (confirm(confirmMessage)) {
      try {
        setSaving(true);
        await accountService.deleteAccount(managerId);
        await fetchManagers();
        setDeletedManagerName(managerName);
        setShowDeletedNotification(true);
        setTimeout(() => {
          setShowDeletedNotification(false);
          setDeletedManagerName('');
        }, 5000);
      } catch (error) {
        console.error('Error deleting manager:', error);
        let errorMessage = error.message;
        if (error.message.includes('Endpoint DELETE không tồn tại')) {
          errorMessage = 'Backend chưa hỗ trợ endpoint DELETE. Vui lòng liên hệ admin để cập nhật API.';
        } else if (error.message.includes('does not exist or has been deleted')) {
          errorMessage = 'Manager này đã được khôi phục sau khi xóa và không thể xóa lại. Vui lòng liên hệ admin để xử lý.';
        }
        alert(`Có lỗi xảy ra khi xóa Manager: ${errorMessage}`);
      } finally {
        setSaving(false);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải dữ liệu Manager...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={fetchManagers} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {showDeletedNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
          <div>
            <div className="font-semibold">Xóa thành công!</div>
            <div className="text-sm">Manager "{deletedManagerName}" đã được đánh dấu là đã xóa.</div>
          </div>
          <button 
            onClick={() => setShowDeletedNotification(false)}
            className="ml-4 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

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
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            {saving ? 'Đang xử lý...' : 'Thêm Manager'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <option value={MANAGER_STATUS.ACTIVE}>Hoạt động</option>
                <option value={MANAGER_STATUS.BANNED}>Bị cấm</option>
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
              {filteredManagers.map((manager, index) => {
                // Tìm khu vực mà Manager đang quản lý
                const managedZone = zones.find(zone => zone.managerID === manager.accountID);
                
                return (
                  <tr key={manager.accountID || `manager-${index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {manager.fullName?.charAt(0) || 'M'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{manager.fullName}</div>
                          <div className="text-sm text-gray-500">ID: {manager.accountID}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{manager.email}</td>
                    <td className="px-6 py-4 text-gray-700">{manager.phoneNumber}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {managedZone ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {managedZone.zoneName}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Chưa phân công</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${
                        getManagerStatus(manager).color
                      }`} title={getManagerStatus(manager).description}>
                        {getManagerStatus(manager).icon && (
                          <FontAwesomeIcon icon={getManagerStatus(manager).icon} className="text-xs" />
                        )}
                        <span>{getManagerStatus(manager).text}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {manager.createAt ? new Date(manager.createAt).toLocaleString('vi-VN') : 'N/A'}
                      {isRestoredManager(manager) && (
                        <div className="text-xs text-yellow-600 mt-1">
                          <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                          Đã xóa: {new Date(manager.deletedAt).toLocaleString('vi-VN')}
                        </div>
                      )}
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
                          onClick={() => handleDeleteManager(manager.accountID)}
                          disabled={saving}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Xóa (Soft Delete)"
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
        onSave={fetchManagers}
      />
    </div>
  );
};

export default ManagerTab;