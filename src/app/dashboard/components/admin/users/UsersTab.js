'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faEye, faUserPlus,
  faUsers, faUserCheck, faUserTimes, faClock
} from '@fortawesome/free-solid-svg-icons';
import CreateUserModal from './CreateUserModal';
import UserDetailModal from './UserDetailModal';

// Định nghĩa các trạng thái tài khoản đồng bộ
const ACCOUNT_STATUSES = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'banned', label: 'Bị cấm' },
  { value: 'remove', label: 'Đã xóa' }
];

// Định nghĩa các loại tài khoản theo role
const ACCOUNT_ROLES = [
  { value: 'all', label: 'Tất cả vai trò' },
  { value: '1', label: 'Admin' },
  { value: '2', label: 'Nursing Specialist' },
  { value: '3', label: 'Manager' },
  { value: '4', label: 'Customer' }
];

const STATUS_LABELS = {
  active: 'Hoạt động',
  banned: 'Bị cấm',
  remove: 'Đã xóa'
};

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700',
  banned: 'bg-red-100 text-red-700',
  remove: 'bg-gray-100 text-gray-700'
};

const ROLE_LABELS = {
  '1': 'Admin',
  '2': 'Nursing Specialist',
  '3': 'Manager', 
  '4': 'Customer'
};

const ROLE_STYLES = {
  '1': 'bg-red-100 text-red-700',
  '2': 'bg-purple-100 text-purple-700',
  '3': 'bg-blue-100 text-blue-700',
  '4': 'bg-green-100 text-green-700'
};

const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
        <FontAwesomeIcon icon={icon} className="text-white text-xl" />
      </div>
      {trend && (
        <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>{trend > 0 ? '+' : ''}{trend}%</div>
      )}
    </div>
    <div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const UsersTab = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailAccount, setDetailAccount] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchAccounts();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/accounts/getall');
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setAccounts([]);
    }
    setLoading(false);
  };

  // Lọc tài khoản theo search và status đồng bộ
  const filteredAccounts = accounts.filter(account => {
    const name = account.fullName || account.full_name || '';
    const email = account.email || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    // Chỉ lọc đúng status được chọn, không gộp các status lại
    const matchesStatus = statusFilter === 'all' ? true : account.status === statusFilter;
    // So sánh roleID với roleFilter, chuyển đổi kiểu dữ liệu nếu cần
    const matchesRole = roleFilter === 'all' ? true : String(account.roleID) === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
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
      title: 'Admin',
      value: accounts.filter(acc => String(acc.roleID) === '1').length,
      icon: faUserPlus,
      color: 'from-red-500 to-pink-500',
      subtitle: 'Admin',
      trend: 8
    },
    {
      title: 'Nursing Specialist',
      value: accounts.filter(acc => String(acc.roleID) === '2').length,
      icon: faUserPlus,
      color: 'from-purple-500 to-pink-500',
      subtitle: 'Chuyên gia',
      trend: 8
    },
    {
      title: 'Manager',
      value: accounts.filter(acc => String(acc.roleID) === '3').length,
      icon: faUserCheck,
      color: 'from-blue-500 to-cyan-500',
      subtitle: 'Quản lý khu vực',
      trend: 5
    },
    {
      title: 'Customer',
      value: accounts.filter(acc => String(acc.roleID) === '4').length,
      icon: faUsers,
      color: 'from-green-500 to-emerald-500',
      subtitle: 'Khách hàng',
      trend: 15
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
      value: accounts.filter(acc => acc.status === 'banned').length,
      icon: faUserTimes,
      color: 'from-yellow-500 to-yellow-300',
      subtitle: 'Đã tạm khóa',
      trend: -3
    },
    {
      title: 'Bị cấm/Đã xóa',
      value: accounts.filter(acc => acc.status === 'banned' || acc.status === 'remove').length,
      icon: faUserTimes,
      color: 'from-red-500 to-pink-500',
      subtitle: 'Bị cấm & Đã xóa',
      trend: -2
    },
    {
      title: 'Mới tháng này',
      value: accounts.filter(acc => {
        const createdDate = new Date(acc.createdAt || acc.created_at);
        const currentMonth = new Date().getMonth();
        return createdDate.getMonth() === currentMonth;
      }).length,
      icon: faUserPlus,
      color: 'from-purple-500 to-pink-500',
      subtitle: 'Tháng hiện tại',
      trend: 15
    }
  ];

  const handleCreateAccountClick = () => setShowCreateModal(true);
  const handleCloseModal = () => setShowCreateModal(false);
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 relative">
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
            {ACCOUNT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {ACCOUNT_ROLES.map((role) => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 text-sm text-gray-500 flex items-center justify-end">
          <FontAwesomeIcon icon={faClock} className="mr-2" />
          {currentTime.toLocaleTimeString('vi-VN')}
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
              {loading ? (
                <tr><td colSpan="5" className="text-center py-12 text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filteredAccounts.length > 0 ? filteredAccounts.map((account, index) => (
                <tr key={account.accountID || account.AccountID || index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                        {(account.avatarUrl || account.avatar_url) && (account.avatarUrl || account.avatar_url) !== 'string' ? (
                          <img
                            src={account.avatarUrl || account.avatar_url}
                            alt={account.fullName || account.full_name}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                        ) : (
                          (account.fullName || account.full_name || '?').charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{account.fullName || account.full_name}</p>
                        <p className="text-sm text-gray-600">{account.email}</p>
                        <p className="text-xs text-gray-500">{account.phoneNumber || account.phone_number || 'Chưa có số điện thoại'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ROLE_STYLES[String(account.roleID)] || 'bg-red-100 text-red-700'
                    }`}>
                      {ROLE_LABELS[String(account.roleID)] || 'Không xác định'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_STYLES[account.status] || 'bg-red-100 text-red-700'
                    }`}>
                      {STATUS_LABELS[account.status] || 'Không xác định'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="text-sm">
                      {new Date(account.createAt || account.createdAt || account.create_at).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(account.createAt || account.createdAt || account.create_at).toLocaleTimeString('vi-VN')}
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
          onSubmit={() => {
            fetchAccounts();
          }}
        />
      )}
      {/* User Detail Modal */}
      {showDetailModal && detailAccount && (
        <UserDetailModal
          show={showDetailModal}
          account={detailAccount}
          onClose={() => setShowDetailModal(false)}
          onSave={() => {
            setShowDetailModal(false);
            fetchAccounts();
          }}
        />
      )}
    </div>
  );
};

export default UsersTab;