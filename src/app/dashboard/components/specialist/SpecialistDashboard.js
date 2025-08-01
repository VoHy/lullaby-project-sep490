'use client';

import { useState } from 'react';

const tabs = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'schedule', label: 'Lịch làm việc' },
  { id: 'bookings', label: 'Booking/Dịch vụ' },
  { id: 'patients', label: 'Hồ sơ bệnh nhân' },
  { id: 'notifications', label: 'Thông báo' },
  { id: 'profile', label: 'Tài khoản cá nhân' },
];

const SpecialistDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab.id ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-100'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div>
          {activeTab === 'overview' && <div className="text-lg font-bold text-pink-700">Chào mừng Specialist! (Tổng quan)</div>}
          {activeTab === 'schedule' && <div>Lịch làm việc (placeholder)</div>}
          {activeTab === 'bookings' && <div>Booking/Dịch vụ (placeholder)</div>}
          {activeTab === 'patients' && <div>Hồ sơ bệnh nhân (placeholder)</div>}
          {activeTab === 'notifications' && <div>Thông báo (placeholder)</div>}
          {activeTab === 'profile' && <div>Tài khoản cá nhân (placeholder)</div>}
        </div>
      </div>
    </div>
  );
};

export default SpecialistDashboard; 