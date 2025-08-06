'use client';

import { useState } from 'react';
import { FaUser, FaTimes } from 'react-icons/fa';

const NurseSelectionModal = ({ 
  isOpen, 
  onClose, 
  onAssign, 
  nursingSpecialists, 
  customizeTaskId 
}) => {
  const [selectedNurseId, setSelectedNurseId] = useState('');

  const handleAssign = () => {
    if (selectedNurseId && onAssign) {
      onAssign(customizeTaskId, selectedNurseId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Phân công Nurse</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn Nurse:
          </label>
          <select
            value={selectedNurseId}
            onChange={(e) => setSelectedNurseId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          >
            <option value="">Chọn nurse...</option>
            {nursingSpecialists
              .filter(nurse => nurse.major === 'Y tá' || nurse.Major === 'Y tá')
              .map(nurse => (
                <option key={nurse.nursingID} value={nurse.nursingID}>
                  {nurse.fullName} - {nurse.major || nurse.Major}
                </option>
              ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedNurseId}
            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Phân công
          </button>
        </div>
      </div>
    </div>
  );
};

export default NurseSelectionModal; 