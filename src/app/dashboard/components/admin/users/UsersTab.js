'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const UsersTab = ({ accounts, searchTerm, setSearchTerm, statusFilter, setStatusFilter, onStatusChange }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

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
  };

  // Hàm xử lý thay đổi input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Hàm submit tạo tài khoản (giả lập)
  const handleCreateAccountSubmit = (e) => {
    e.preventDefault();
    alert('Tạo tài khoản thành công (giả lập)');
    setShowCreateModal(false);
    setAvatarUrl(''); setFullName(''); setEmail(''); setPhone(''); setRole('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setAvatarUrl(''); // Nếu chọn file thì bỏ URL
      };
      reader.readAsDataURL(file);
    }
  };

  // Khi nhập URL thì preview luôn
  const handleAvatarUrlChange = (e) => {
    setAvatarUrl(e.target.value);
    setAvatarPreview(''); // Nếu nhập URL thì bỏ preview file
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
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={handleCloseModal}
              aria-label="Đóng"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-6 text-center">Tạo tài khoản mới</h3>
            <form onSubmit={handleCreateAccountSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Nhập họ và tên"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Nhập email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Nhập số điện thoại"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  >
                    <option value="" hidden>Chọn vai trò</option>
                    <option value="nurse">Y tá</option>
                    <option value="specialist">Chuyên gia</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 mb-2">
                <label className="block text-xs font-medium mb-1 text-gray-600">Ảnh đại diện</label>
                <div className="relative w-24 h-24">
                  <img src={avatarPreview || avatarUrl || "/images/avatar1.jpg"} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-pink-200 mx-auto" />
                  <label className="absolute bottom-0 right-0 bg-pink-500 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-pink-600 transition" title="Đổi ảnh">
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 21h10.5A2.25 2.25 0 0 0 19.5 18.75V8.25A2.25 2.25 0 0 0 17.25 6H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 21z" />
                    </svg>
                  </label>
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Dán URL ảnh đại diện"
                  value={avatarUrl}
                  onChange={handleAvatarUrlChange}
                />
              </div>
              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-8 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
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
                  <select
                    value={account.status || 'active'}
                    onChange={(e) => onStatusChange(account.AccountID, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${account.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm khóa</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(account.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-all duration-200">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-all duration-200">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all duration-200">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
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
    </div>
  );
};

export default UsersTab;