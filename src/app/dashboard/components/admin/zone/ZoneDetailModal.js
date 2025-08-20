import React from 'react';

const ZoneDetailModal = ({
  showDetailModal,
  setShowDetailModal,
  zonedetailForm,
  setZonedetailForm,
  handleSaveZonedetail,
  zones
}) => {
  if (!showDetailModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl font-bold z-10"
          onClick={() => setShowDetailModal(false)}
        >
          &times;
        </button>
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            {zonedetailForm.zoneDetailID ? 'Sửa chi tiết khu vực' : 'Thêm chi tiết khu vực'}
          </h3>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded mx-auto"></div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực</label>
            <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-700">
              {zones.find(z => z.zoneID === parseInt(zonedetailForm.zoneID))?.zoneName || 'Không xác định'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên chi tiết</label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Nhập tên chi tiết khu vực"
              value={zonedetailForm.name}
              onChange={e => setZonedetailForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Nhập ghi chú (không bắt buộc)"
              value={zonedetailForm.note ?? ""}
              onChange={e => setZonedetailForm(f => ({ ...f, note: e.target.value }))}
              rows="3"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-3">
          <button
            className="px-6 py-2 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all duration-300"
            onClick={() => setShowDetailModal(false)}
          >
            Hủy
          </button>
          <button
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleSaveZonedetail}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZoneDetailModal; 