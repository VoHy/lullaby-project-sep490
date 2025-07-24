'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import CreateUserModal from './CreateUserModal';
import UserDetailModal from './UserDetailModal';

const UsersTab = ({ accounts, searchTerm, setSearchTerm, statusFilter, setStatusFilter, onStatusChange }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  // Thông tin chuyên môn
  const [zoneId, setZoneId] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [major, setMajor] = useState('');
  const [experience, setExperience] = useState('');
  const [slogan, setSlogan] = useState('');
  const [address, setAddress] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailAccount, setDetailAccount] = useState(null);
  const [accountsState, setAccountsState] = useState(accounts);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Hàm xử lý khi nhấn nút tạo tài khoản
  const handleCreateAccountClick = () => {
    setShowCreateModal(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setAvatarUrl(''); setFullName(''); setEmail(''); setPhone(''); setRole(''); setAvatarPreview('');
    setZoneId(''); setGender(''); setDob(''); setMajor(''); setExperience(''); setSlogan(''); setAddress('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <button
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
          onClick={handleCreateAccountClick}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Tạo tài khoản cho điều dưỡng / chuyên gia
        </button>
      </div>

      {/* Modal tạo tài khoản */}
      {showCreateModal && (
        <CreateUserModal
          show={showCreateModal}
          onClose={handleCloseModal}
          onSubmit={(accountData, nursingSpecialistData) => {
            alert('Tạo tài khoản thành công (giả lập):\n' + JSON.stringify(accountData, null, 2) + (nursingSpecialistData ? ('\n---\nThông tin chuyên môn:\n' + JSON.stringify(nursingSpecialistData, null, 2)) : ''));
          }}
        />
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Tạm khóa</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Người dùng</th>
              <th className="px-6 py-3 text-left">Vai trò</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Ngày tạo</th>
              <th className="px-6 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAccounts && filteredAccounts.length > 0 ? filteredAccounts.map((account, index) => (
              <tr key={account.AccountID || index} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3 overflow-hidden">
                      {account.avatar_url ? (
                        <img
                          src={account.avatar_url}
                          alt={account.full_name}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      ) : (
                        account.full_name?.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{account.full_name}</p>
                      <p className="text-sm text-gray-600">{account.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {account.role_name || account.roleName || 'User'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${account.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{account.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(account.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    className="px-4 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all duration-200"
                    onClick={() => { setDetailAccount(account); setShowDetailModal(true); }}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">Không có dữ liệu người dùng</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal chi tiết tài khoản */}
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