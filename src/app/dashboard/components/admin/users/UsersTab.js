'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faEye, faUserPlus,
  faUsers, faUserCheck, faUserTimes, faClock
} from '@fortawesome/free-solid-svg-icons';
import CreateUserModal from './CreateUserModal';
import UserDetailModal from './UserDetailModal';

const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
        <FontAwesomeIcon icon={icon} className="text-white text-xl" />
      </div>
      {trend && (
        <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
    <div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const UsersTab = ({ accounts, searchTerm, setSearchTerm, statusFilter, setStatusFilter, onStatusChange }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailAccount, setDetailAccount] = useState(null);
  const [accountsState, setAccountsState] = useState(accounts);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: 'Tổng người dùng',
      value: accounts.length,
      icon: faUsers,
      color: 'from-blue-500 to-cyan-500',
      subtitle: 'Tất cả người dùng',
      trend: 12
    },
    {
      title: 'Hoạt động',
      value: accounts.filter(acc => acc.status === 'active').length,
      icon: faUserCheck,
      color: 'from-green-500 to-emerald-500',
      subtitle: 'Đang hoạt động',
      trend: 8
    },
    {
      title: 'Tạm khóa',
      value: accounts.filter(acc => acc.status === 'inactive').length,
      icon: faUserTimes,
      color: 'from-red-500 to-pink-500',
      subtitle: 'Đã tạm khóa',
      trend: -3
    },
    {
      title: 'Mới tháng này',
      value: accounts.filter(acc => {
        const createdDate = new Date(acc.created_at);
        const currentMonth = new Date().getMonth();
        return createdDate.getMonth() === currentMonth;
      }).length,
      icon: faUserPlus,
      color: 'from-purple-500 to-pink-500',
      subtitle: 'Tháng hiện tại',
      trend: 15
    }
  ];

  const handleCreateAccountClick = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleViewDetail = (account) => {
    setDetailAccount(account);
    setShowDetailModal(true);
  };

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
            <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
            <p className="text-gray-600 mt-1">Quản lý tất cả người dùng trong hệ thống</p>
          </div>
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            onClick={handleCreateAccountClick}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Tạo tài khoản mới</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Tạm khóa</option>
          </select>
          <div className="text-sm text-gray-500 flex items-center">
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            {currentTime.toLocaleTimeString('vi-VN')}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Người dùng</th>
                <th className="px-6 py-4 text-left font-semibold">Vai trò</th>
                <th className="px-6 py-4 text-left font-semibold">Trạng thái</th>
                <th className="px-6 py-4 text-left font-semibold">Ngày tạo</th>
                <th className="px-6 py-4 text-center font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAccounts.length > 0 ? filteredAccounts.map((account, index) => (
                <tr key={account.AccountID || index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                        {account.avatar_url ? (
                          <img
                            src={account.avatar_url}
                            alt={account.full_name}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                        ) : (
                          account.full_name?.charAt(0) || '?'
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{account.full_name}</p>
                        <p className="text-sm text-gray-600">{account.email}</p>
                        <p className="text-xs text-gray-500">{account.phone_number || 'Chưa có số điện thoại'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {account.role_name || account.roleName || 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      account.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {account.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="text-sm">
                      {new Date(account.created_at).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(account.created_at).toLocaleTimeString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        onClick={() => handleViewDetail(account)}
                        title="Xem chi tiết"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    <FontAwesomeIcon icon={faUsers} className="text-4xl text-gray-300 mb-4" />
                    <p className="text-lg">Không có dữ liệu người dùng</p>
                    <p className="text-sm">Thử thay đổi bộ lọc để xem kết quả khác</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          show={showCreateModal}
          onClose={handleCloseModal}
          onSubmit={(accountData, nursingSpecialistData) => {
            alert('Tạo tài khoản thành công (giả lập):\n' + JSON.stringify(accountData, null, 2) + (nursingSpecialistData ? ('\n---\nThông tin chuyên môn:\n' + JSON.stringify(nursingSpecialistData, null, 2)) : ''));
          }}
        />
      )}

      {/* User Detail Modal */}
      {showDetailModal && detailAccount && (
        <UserDetailModal
          show={showDetailModal}
          account={detailAccount}
          onClose={() => setShowDetailModal(false)}
          onSave={(accountId, newStatus) => {
            setAccountsState(prev => prev.map(acc => acc.AccountID === accountId ? { ...acc, status: newStatus } : acc));
            setShowDetailModal(false);
          }}
        />
      )}
    </div>
  );
};

export default UsersTab;