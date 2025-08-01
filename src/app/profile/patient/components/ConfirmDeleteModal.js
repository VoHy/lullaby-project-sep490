import React from 'react';

export default function ConfirmDeleteModal({ open, onClose, onConfirm, title, message, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full relative">
        <button className="absolute top-2 right-2 text-xl text-gray-400 hover:text-red-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold text-red-600 mb-4">{title}</h2>
        <div className="mb-4">{message}</div>
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition" onClick={onClose} disabled={loading}>Hủy</button>
          <button className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition" onClick={onConfirm} disabled={loading}>{loading ? 'Đang xóa...' : 'Xóa'}</button>
        </div>
      </div>
    </div>
  );
} 