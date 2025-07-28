import React from 'react';

export default function CareProfileDetailModal({ open, onClose, care, zones }) {
  if (!open || !care) return null;
  const zone = zones.find(z => z.ZoneID === care.ZoneDetailID);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-xl relative scale-95 animate-popup-open">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
        <div className="flex flex-col md:flex-row gap-8 p-8">
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <img src={care.Image || '/images/hero-bg.jpg'} alt="avatar" className="w-32 h-32 rounded-full object-cover border-2 border-blue-200" />
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${care.Status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{care.Status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span>
          </div>
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-bold text-purple-700 mb-2">{care.ProfileName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Ngày sinh</div>
                <div className="font-medium text-gray-800">{care.DateOfBirth || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Số điện thoại</div>
                <div className="font-medium text-gray-800">{care.PhoneNumber || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Địa chỉ</div>
                <div className="font-medium text-gray-800">{care.Address || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Zone</div>
                <div className="font-medium text-gray-800">{zone ? zone.Zone_name : 'N/A'}</div>
              </div>
            </div>
            {care.Note && (
              <div>
                <div className="text-xs text-gray-500">Ghi chú</div>
                <div className="font-medium text-gray-800">{care.Note}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 