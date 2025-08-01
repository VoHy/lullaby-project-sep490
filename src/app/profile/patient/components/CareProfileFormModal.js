import React from 'react';

export default function CareProfileFormModal({ open, onClose, onSave, formData, onChange, onAvatarChange, loading, isEdit, zones = [], zonedetails = [], user }) {
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Đảm bảo có đủ dữ liệu cần thiết
    const submitData = {
      ...formData,
      accountID: user?.accountID || user?.AccountID, // luôn lấy từ user hiện tại
      zonedetailid: parseInt(formData.zonedetailid) || 1,
      profileName: formData.profileName || formData.ProfileName,
      dateOfBirth: formData.dateOfBirth || formData.DateOfBirth,
      phoneNumber: formData.phoneNumber || formData.PhoneNumber,
      address: formData.address || formData.Address,
      image: formData.image || '/images/hero-bg.jpg', // truyền ảnh mặc định nếu rỗng
              note: formData.note || formData.Note || '',
      status: formData.status || formData.Status || 'Active'
    };
    onSave(submitData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-3xl relative scale-95 animate-popup-open"> {/* tăng max-w-3xl */}
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
            {isEdit ? 'Chỉnh sửa hồ sơ' : 'Tạo hồ sơ mới'}
          </h2>
          <form onSubmit={handleSubmit} className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Cột trái: Thông tin */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Tên hồ sơ *</label>
                  <input
                    name="profileName"
                    value={formData.profileName || formData.ProfileName || ''}
                    onChange={onChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Ngày sinh *</label>
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth || formData.DateOfBirth || ''}
                    onChange={onChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Số điện thoại *</label>
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber || formData.PhoneNumber || ''}
                    onChange={onChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Khu vực</label>
                  <select name="zonedetailid" value={formData.zonedetailid || formData.ZonedetailID || ''} onChange={onChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm">
                    <option value="">Chọn khu vực</option>
                    {zonedetails && zonedetails.length > 0 ? zonedetails.map(zd => {
                      const zone = zones.find(z => z.zoneID === zd.zoneID);
                      return (
                        <option key={zd.zonedetailid} value={zd.zonedetailid}>
                          {zone ? zone.zoneName : 'Unknown Zone'} - {zd.name}
                        </option>
                      );
                    }) : (
                      <option value="1">Quận 1 - Phường Bến Nghé</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Địa chỉ *</label>
                  <textarea
                    name="address"
                    value={formData.address || formData.Address || ''}
                    onChange={onChange}
                    rows="2"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Ghi chú</label>
                  <textarea
                    name="note"
                    value={formData.note || formData.Note || ''}
                    onChange={onChange}
                    rows="2"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-primary text-sm"
                  />
                </div>
              </div>
              {/* Cột phải: Ảnh đại diện */}
              <div className="flex flex-col items-center justify-start gap-4 pt-2">
                <label className="block text-sm font-medium mb-2 text-gray-700">Ảnh đại diện</label>
                <div className="relative w-32 h-32">
                  <img src={formData.image || '/images/hero-bg.jpg'} alt="avatar" className="w-32 h-32 rounded-full object-cover border-2 border-blue-200 mx-auto" />
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-blue-700 transition" title="Đổi ảnh">
                    <input type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 21h10.5A2.25 2.25 0 0 0 19.5 18.75V8.25A2.25 2.25 0 0 0 17.25 6H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 21z" />
                    </svg>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Tạo hồ sơ')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 