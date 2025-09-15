'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faSearch, faEye, faUserPlus, faEdit, faTrash,
  faUsers, faUserCheck, faUserTimes, faClock
} from '@fortawesome/free-solid-svg-icons';
import CreateUserModal from './CreateUserModal';
import UserDetailModal from './UserDetailModal';
import accountService from '@/services/api/accountService';

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
  { value: '1', label: 'Quản trị viên' },
  { value: '2', label: 'Chuyên viên' },
  { value: '3', label: 'Quản lý' },
  { value: '4', label: 'Khách hàng' }
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
  '1': 'Quản trị viên',
  '2': 'Chuyên viên',
  '3': 'Quản lý',
  '4': 'Khách hàng'
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [detailAccount, setDetailAccount] = useState(null);
  const [editAccount, setEditAccount] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchAccounts();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await accountService.getAllAccounts();
      setAccounts(data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setAccounts([]);
    }
    setLoading(false);
  };

  // Kiểm tra tài khoản đã xóa
  const isAccountDeleted = (account) => {
    return account.deletedAt && account.deletedAt !== null;
  };

  // Lọc accounts theo search và filter
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = (
      (account.fullName || account.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.phoneNumber || account.phone_number || '').includes(searchTerm)
    );

    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    const matchesRole = roleFilter === 'all' || String(account.roleID) === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Reset trang khi điều kiện lọc thay đổi hoặc dữ liệu cập nhật
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter, accounts]);

  // Pagination calculations
  const totalItems = filteredAccounts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

  // Tính toán stats
  const stats = [
    {
      title: 'Tổng người dùng',
      value: accounts.length,
      icon: faUsers,
      color: 'from-blue-500 to-blue-600',
      subtitle: 'Tất cả tài khoản'
    },
    {
      title: 'Đang hoạt động',
      value: accounts.filter(acc => acc.status === 'active' && !isAccountDeleted(acc)).length,
      icon: faUserCheck,
      color: 'from-green-500 to-green-600',
      subtitle: 'Tài khoản hoạt động'
    },
    {
      title: 'Bị cấm',
      value: accounts.filter(acc => acc.status === 'banned' && !isAccountDeleted(acc)).length,
      icon: faUserTimes,
      color: 'from-red-500 to-red-600',
      subtitle: 'Tài khoản bị cấm'
    },
    {
      title: 'Đã xóa',
      value: accounts.filter(acc => isAccountDeleted(acc)).length,
      icon: faUserTimes,
      color: 'from-gray-500 to-gray-600',
      subtitle: 'Tài khoản đã xóa'
    }
  ];

  const handleCreateAccountClick = () => setShowCreateModal(true);
  const handleCloseModal = () => setShowCreateModal(false);

  const handleViewDetail = (account) => {
    setDetailAccount(account);
    setShowDetailModal(true);
  };

  const handleEditAccount = (account) => {
    if (isAccountDeleted(account)) {
      alert('Không thể chỉnh sửa tài khoản đã xóa!');
      return;
    }
    setEditAccount(account);
    setShowEditModal(true);
  };

  const handleDeleteAccount = async (account) => {
    if (isAccountDeleted(account)) {
      alert('Tài khoản này đã được xóa trước đó!');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${account.fullName || account.full_name}"?`)) {
      try {
        await accountService.deleteAccount(account.accountID);
        await fetchAccounts(); // Refresh data
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Không thể xóa tài khoản. Vui lòng thử lại.');
      }
    }
  };

  const handleUpdateAccount = async (updatedAccount) => {
    try {
      await accountService.updateAccount(updatedAccount.accountID, updatedAccount);
      setShowEditModal(false);
      setEditAccount(null);
      await fetchAccounts(); // Refresh data
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Không thể cập nhật tài khoản. Vui lòng thử lại.');
    }
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
            <span>Tạo tài khoản chuyên viên</span>
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
                <th className="px-6 py-4 text-left font-semibold">Ngày xóa</th>
                <th className="px-6 py-4 text-center font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12 text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : paginatedAccounts.length > 0 ? paginatedAccounts.map((account, index) => {
                const isDeleted = isAccountDeleted(account);
                return (
                  <tr key={account.accountID || account.AccountID || index}
                    className={`transition-colors duration-200 ${isDeleted ? 'opacity-50 bg-gray-50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden ${isDeleted ? 'opacity-60' : ''}`}>
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
                          <p className={`font-medium ${isDeleted ? 'text-gray-500' : 'text-gray-900'}`}>
                            {account.fullName || account.full_name}
                            {isDeleted && <span className="ml-2 text-xs text-gray-400">(Đã xóa)</span>}
                          </p>
                          <p className={`text-sm ${isDeleted ? 'text-gray-400' : 'text-gray-600'}`}>{account.email}</p>
                          <p className={`text-xs ${isDeleted ? 'text-gray-400' : 'text-gray-500'}`}>
                            {account.phoneNumber || account.phone_number || 'Chưa có số điện thoại'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDeleted ? 'bg-gray-100 text-gray-500' : ROLE_STYLES[String(account.roleID)] || 'bg-red-100 text-red-700'
                        }`}>
                        {ROLE_LABELS[String(account.roleID)] || 'Không xác định'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDeleted ? 'bg-gray-100 text-gray-500' : STATUS_STYLES[account.status] || 'bg-red-100 text-red-700'
                        }`}>
                        {isDeleted ? 'Đã xóa' : STATUS_LABELS[account.status] || 'Không xác định'}
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
                    <td className="px-6 py-4 text-gray-600">
                      <div className="text-sm">
                        {account.deletedAt ?
                          new Date(account.deletedAt).toLocaleDateString('vi-VN') :
                          '-'
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        {account.deletedAt ?
                          new Date(account.deletedAt).toLocaleTimeString('vi-VN') :
                          ''
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          className={`p-2 rounded-lg transition-all duration-200 ${isDeleted ?
                            'text-gray-400 cursor-not-allowed' :
                            'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                            }`}
                          onClick={() => handleViewDetail(account)}
                          disabled={isDeleted}
                          title={isDeleted ? "Không thể xem chi tiết tài khoản đã xóa" : "Xem chi tiết"}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          className={`p-2 rounded-lg transition-all duration-200 ${isDeleted ?
                            'text-gray-400 cursor-not-allowed' :
                            'text-green-600 hover:text-green-800 hover:bg-green-50'
                            }`}
                          onClick={() => handleEditAccount(account)}
                          disabled={isDeleted}
                          title={isDeleted ? "Không thể sửa tài khoản đã xóa" : "Sửa"}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className={`p-2 rounded-lg transition-all duration-200 ${isDeleted ?
                            'text-gray-400 cursor-not-allowed' :
                            'text-red-600 hover:text-red-800 hover:bg-red-50'
                            }`}
                          onClick={() => handleDeleteAccount(account)}
                          disabled={isDeleted}
                          title={isDeleted ? "Tài khoản đã được xóa" : "Xóa"}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    <FontAwesomeIcon icon={faUsers} className="text-4xl text-gray-300 mb-4" />
                    <p className="text-lg">Không có dữ liệu người dùng</p>
                    <p className="text-sm">Thử thay đổi bộ lọc để xem kết quả khác</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 p-4">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              Trước
            </button>
            <div className="text-sm">Trang {currentPage} / {totalPages}</div>
            <button
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Sau
            </button>
          </div>
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
      {/* Edit User Modal */}
      {showEditModal && editAccount && (
        <EditUserModal
          show={showEditModal}
          account={editAccount}
          onClose={() => {
            setShowEditModal(false);
            setEditAccount(null);
          }}
          onSave={handleUpdateAccount}
        />
      )}
    </div>
  );
};

// Edit User Modal Component
const EditUserModal = ({ show, account, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    accountID: account?.accountID || '',
    roleID: account?.roleID || 1,
    fullName: account?.fullName || account?.full_name || '',
    phoneNumber: account?.phoneNumber || account?.phone_number || '',
    email: account?.email || '',
    password: account?.password || 'string',
    avatarUrl: account?.avatarUrl || account?.avatar_url || 'string',
    createAt: account?.createAt || account?.createdAt || account?.create_at || new Date().toISOString(),
    deletedAt: account?.deletedAt || account?.delete_at || null,
    status: account?.status || 'active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra tài khoản đã xóa
    if (account.deletedAt) {
      alert('Không thể cập nhật tài khoản đã xóa!');
      return;
    }

    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">Sửa tài khoản</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <select
                name="roleID"
                value={formData.roleID}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                disabled
              >
                <option value={1}>Quản trị viên</option>
                <option value={2}>Chuyên viên</option>
                <option value={3}>Quản lý</option>
                <option value={4}>Khách hàng</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="active">Hoạt động</option>
                <option value="banned">Bị cấm</option>
                <option value="remove">Đã xóa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                placeholder="URL hình ảnh (tùy chọn)"
              />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersTab;