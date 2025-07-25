import React from 'react';

const NurseProfileTab = ({ nurseAccount }) => (
  <div>
    <h3 className="font-semibold text-lg mb-2">Tài khoản cá nhân</h3>
    <div className="flex flex-col items-center mb-4">
      <img src={nurseAccount?.avatar_url || '/images/avatar1.jpg'} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-pink-200 mb-2" />
      <div className="font-semibold text-lg text-gray-800 mb-1">{nurseAccount?.full_name}</div>
      <div className="text-xs text-gray-500 mb-1">{nurseAccount?.email}</div>
    </div>
    <div className="space-y-2 text-sm">
      <div><span className="font-medium text-gray-600">Số điện thoại:</span> {nurseAccount?.phone_number || '-'}</div>
      <div><span className="font-medium text-gray-600">Vai trò:</span> {nurseAccount?.role_name || '-'}</div>
      <div><span className="font-medium text-gray-600">Trạng thái:</span> <span className={`px-3 py-1 rounded-full text-xs font-semibold ${nurseAccount?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{nurseAccount?.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}</span></div>
    </div>
    <button className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg">Cập nhật thông tin</button>
  </div>
);

export default NurseProfileTab; 