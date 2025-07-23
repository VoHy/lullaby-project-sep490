import React, { useState } from 'react';
import accounts from '@/mock/Account';
import nursingSpecialists from '@/mock/NursingSpecialist';

const nurses = accounts.filter(acc => acc.role_id === 2);

const ManagerNurseTab = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleView = (nurse) => {
    const detail = nursingSpecialists.find(n => n.AccountID === nurse.AccountID);
    setDetailData({ ...nurse, ...detail });
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailData(null);
  };

  const handleCreateNurseClick = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setAvatarUrl(''); setAvatarPreview(''); setFullName(''); setEmail(''); setPhone(''); setPassword('');
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setAvatarUrl('');
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAvatarUrlChange = (e) => {
    setAvatarUrl(e.target.value);
    setAvatarPreview('');
  };
  const handleCreateNurseSubmit = (e) => {
    e.preventDefault();
    alert('Tạo nurse thành công (giả lập)');
    handleCloseCreateModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Danh sách Nurse</h3>
        <button
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg"
          onClick={handleCreateNurseClick}
        >
          Thêm mới
        </button>
      </div>
      {/* Popup tạo nurse */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={handleCloseCreateModal}>&times;</button>
            <h3 className="text-2xl font-bold mb-6 text-center">Tạo Nurse mới</h3>
            <form onSubmit={handleCreateNurseSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Nhập họ và tên" value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Nhập email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Nhập số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                  <input type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Nhập mật khẩu" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
                <div className="relative w-28 h-28 rounded-full border-2 border-purple-300 flex items-center justify-center overflow-hidden mb-2">
                  <img src={avatarPreview || avatarUrl || '/images/avatar1.jpg'} alt="avatar" className="object-cover w-full h-full" />
                  <label className="absolute bottom-1 right-1 bg-pink-500 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-pink-600 transition" title="Đổi ảnh">
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 21h10.5A2.25 2.25 0 0 0 19.5 18.75V8.25A2.25 2.25 0 0 0 17.25 6H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 21z" />
                    </svg>
                  </label>
                </div>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Dán URL ảnh đại diện" value={avatarUrl} onChange={handleAvatarUrlChange} />
              </div>
              <div className="md:col-span-2 flex justify-end mt-4">
                <button type="submit" className="px-8 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Popup chi tiết nurse */}
      {showDetail && detailData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={handleCloseDetail}>&times;</button>
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full border-4 border-pink-300 overflow-hidden mb-2">
                <img src={detailData.avatar_url || '/images/avatar1.jpg'} alt="avatar" className="object-cover w-full h-full" />
              </div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-1">{detailData.full_name || 'Không có'}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${detailData.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{detailData.status || 'Không có'}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="font-medium text-gray-600">Email:</div>
              <div>{detailData.email || 'Không có'}</div>
              <div className="font-medium text-gray-600">Số điện thoại:</div>
              <div>{detailData.phone_number || 'Không có'}</div>
              <div className="font-medium text-gray-600">Địa chỉ:</div>
              <div>{detailData.Address || 'Không có'}</div>
              <div className="font-medium text-gray-600">Kinh nghiệm:</div>
              <div>{detailData.Experience || 'Không có'} năm</div>
              <div className="font-medium text-gray-600">Chuyên ngành:</div>
              <div>{detailData.Major || 'Không có'}</div>
              <div className="font-medium text-gray-600">Slogan:</div>
              <div>{detailData.Slogan || 'Không có'}</div>
              <div className="font-medium text-gray-600">Giới tính:</div>
              <div>{detailData.Gender || 'Không có'}</div>
              <div className="font-medium text-gray-600">Ngày sinh:</div>
              <div>{detailData.DateOfBirth || 'Không có'}</div>
            </div>
          </div>
        </div>
      )}
      <table className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <tr>
            <th className="px-6 py-3 text-left">Tên</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Trạng thái</th>
            <th className="px-6 py-3 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {nurses.map(nurse => (
            <tr key={nurse.AccountID} className="hover:bg-gray-50">
              <td className="px-6 py-4">{nurse.full_name}</td>
              <td className="px-6 py-4">{nurse.email}</td>
              <td className="px-6 py-4">{nurse.status}</td>
              <td className="px-6 py-4">
                <button onClick={() => handleView(nurse)} className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600">Xem chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerNurseTab; 