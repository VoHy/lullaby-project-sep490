import { useState, useEffect } from 'react';

const UserDetailModal = ({ show, account, onClose, onSave }) => {
  const [status, setStatus] = useState(account?.status || 'active');

  useEffect(() => {
    setStatus(account?.status || 'active');
  }, [account]);

  if (!show || !account) return null;

  const handleSave = () => {
    if (onSave) onSave(account.AccountID, status);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm overflow-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative my-8 mx-2">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-pink-500 text-2xl font-bold z-10"
          onClick={onClose}
          aria-label="Đóng"
          type="button"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Chi tiết tài khoản</h3>
        <div className="flex flex-col items-center mb-4">
          <img src={account.avatar_url || '/images/avatar1.jpg'} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-pink-200 mb-2" />
          <div className="font-semibold text-lg text-gray-800 mb-1">{account.full_name}</div>
          <div className="text-xs text-gray-500 mb-1">{account.email}</div>
        </div>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium text-gray-600">Số điện thoại:</span> {account.phone_number || '-'}</div>
          <div><span className="font-medium text-gray-600">Vai trò:</span> {account.role_name || account.roleName || '-'}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{status === 'active' ? 'Hoạt động' : 'Tạm khóa'}</span>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="ml-2 px-2 py-1 rounded border focus:ring-2 focus:ring-purple-400"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm khóa</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal; 