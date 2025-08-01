import React from 'react';

export default function RelativeDetailModal({ open, onClose, relative }) {
  if (!open || !relative) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md relative scale-95 animate-popup-open">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
        <div className="flex flex-col md:flex-row gap-8 p-8">
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <img src={relative.Image || '/default-avatar.png'} alt="avatar" className="w-28 h-28 rounded-full object-cover border-2 border-blue-200" />
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${relative.Status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{relative.Status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}</span>
          </div>
          <div className="flex-1 space-y-3">
            <h2 className="text-xl font-bold text-purple-700 mb-2">{relative.Relative_Name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Ngày sinh</div>
                <div className="font-medium text-gray-800">{relative.DateOfBirth || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Giới tính</div>
                <div className="font-medium text-gray-800">{relative.Gender || 'N/A'}</div>
              </div>
            </div>
            {relative.Note && (
              <div>
                <div className="text-xs text-gray-500">Ghi chú</div>
                <div className="font-medium text-gray-800">{relative.Note}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 