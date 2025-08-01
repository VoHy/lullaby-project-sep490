import React, { useState } from 'react';

const NursePatientsTab = ({ patients }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Hồ sơ bệnh nhân phụ trách</h3>
      <ul className="space-y-2">
        {patients.length === 0 && (
          <li className="text-gray-500">Không có bệnh nhân nào.</li>
        )}
        {patients.map(p => (
          <li key={p.CareProfileID} className="p-3 bg-gray-50 rounded flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <span className="font-semibold">{p.ProfileName}</span> - {p.DateOfBirth}
              <div className="text-xs text-gray-500">Địa chỉ: {p.Address}</div>
            </div>
            <button
              className="mt-2 md:mt-0 px-4 py-1 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold hover:shadow-lg"
              onClick={() => setSelectedPatient(p)}
            >
              Xem hồ sơ
            </button>
          </li>
        ))}
      </ul>

      {/* Modal chi tiết bệnh nhân */}
      {selectedPatient && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setSelectedPatient(null)}
              title="Đóng"
            >✕</button>
            <h4 className="text-xl font-bold mb-4 text-blue-700">Chi tiết hồ sơ bệnh nhân</h4>
            <div className="flex flex-col items-center mb-4">
              <img
                src={selectedPatient.Image && selectedPatient.Image !== 'string' ? selectedPatient.Image : '/images/logo-eldora.png'}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-200 mb-2"
              />
              <div className="font-semibold text-lg text-gray-800 mb-1">{selectedPatient.ProfileName}</div>
              <div className="text-xs text-gray-500 mb-1">{selectedPatient.DateOfBirth} - {selectedPatient.Gender}</div>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium text-gray-600">Địa chỉ:</span> {selectedPatient.Address}</div>
              <div><span className="font-medium text-gray-600">Số điện thoại:</span> {selectedPatient.PhoneNumber}</div>
              <div><span className="font-medium text-gray-600">Ghi chú:</span> {selectedPatient.Notes}</div>
              <div>
                <span className="font-medium text-gray-600">Trạng thái:</span>{' '}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedPatient.Status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedPatient.Status === 'active' ? 'Đang theo dõi' : 'Ngưng theo dõi'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NursePatientsTab; 