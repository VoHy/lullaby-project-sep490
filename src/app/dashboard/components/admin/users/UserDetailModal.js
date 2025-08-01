import { useState, useEffect } from 'react';
import accountService from '@/services/api/accountService';

const UserDetailModal = ({ show, account, onClose, onSave }) => {
  const [status, setStatus] = useState(account?.status || 'inactive');
  useEffect(() => {
    setStatus(account?.status || 'inactive');
  }, [account]);

  if (!show || !account) return null;

  const handleToggle = async () => {
    try {
      await accountService.banAccount(account.AccountID || account.accountID);
      if (onSave) onSave(account.AccountID || account.accountID);
    } catch (err) {
      alert('Cập nhật trạng thái tài khoản thất bại!');
    }
    if (onClose) onClose();
  };

  // Hiển thị toàn bộ thông tin tài khoản (chuẩn hóa field)
  const infoList = [
    { label: "ID tài khoản", value: account.AccountID || account.accountID || '-' },
    { label: "Họ và tên", value: account.full_name || account.fullName || '-' },
    { label: "Email", value: account.email || '-' },
    { label: "Số điện thoại", value: account.phone_number || account.phoneNumber || '-' },
    { label: "Ngày tạo", value: account.createAt || account.createAt || '-' },
    { label: "Trạng thái", value: status === 'active' ? 'Hoạt động' : 'Tạm khóa' },
  ];

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
                          <img src={(account.avatar_url || account.avatarUrl) && (account.avatar_url || account.avatarUrl) !== 'string' ? (account.avatar_url || account.avatarUrl) : '/images/logo-eldora.png'} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-pink-200 mb-2" />
          <div className="font-semibold text-lg text-gray-800 mb-1">{account.full_name || account.fullName || '-'}</div>
          <div className="text-xs text-gray-500 mb-1">{account.email || '-'}</div>
        </div>
        <div className="space-y-2 text-sm">
          {infoList.map((item, idx) => (
            <div key={idx}>
              <span className="font-medium text-gray-600">{item.label}:</span>{" "}
              <span>{item.value || '-'}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{status === 'active' ? 'Hoạt động' : 'Tạm khóa'}</span>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleToggle}
            className={`px-6 py-2 rounded-lg font-semibold hover:shadow-lg ${
              status === 'active'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            }`}
          >
            {status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal; 