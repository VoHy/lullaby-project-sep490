import React from 'react';

export default function CareProfileDetailModal({ open, onClose, care, zones, zoneDetails, successMessage }) {
  if (!open || !care) return null;
  // Lấy zoneDetail và zone đúng

  const zoneDetail = zoneDetails.find(z => Number(z.zoneDetailID) === Number(care.zoneDetailID));
  const zone = zoneDetail && zones ? zones.find(z => Number(z.zoneID) === Number(zoneDetail.zoneID)) : null;


  function formatDate(dateStr) {
    if (!dateStr) return '';
    if (dateStr.includes('T')) return dateStr.split('T')[0];
    return dateStr;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-xl relative scale-95 animate-popup-open">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
        <div className="flex flex-col md:flex-row gap-8 p-8">
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <img src={care.image || '/images/hero-bg.jpg'} alt="avatar" className="w-32 h-32 rounded-full object-cover border-2 border-blue-200" />
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${care.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{care.status === 'Active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span>
          </div>
          <div className="flex-1 space-y-3">
            {successMessage && (
              <div className="text-green-600 bg-green-50 p-2 rounded mb-2 text-center">
                {successMessage}
              </div>
            )}
            <h2 className="text-2xl font-bold text-purple-700 mb-2">{care.profileName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Ngày sinh</div>
                <div className="font-medium text-gray-800">{formatDate(care.dateOfBirth) || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Số điện thoại</div>
                <div className="font-medium text-gray-800">{care.phoneNumber || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Địa chỉ</div>
                <div className="font-medium text-gray-800">{care.address || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Khu vực</div>
                <div className="font-medium text-gray-800">
                  {zone ? zone.zoneName : 'N/A'}
                  {zoneDetail ? ` - ${zoneDetail.name}` : ''}
                </div>
              </div>
            </div>
            {care.note && (
              <div>
                <div className="text-xs text-gray-500">Ghi chú</div>
                <div className="font-medium text-gray-800">{care.note}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 