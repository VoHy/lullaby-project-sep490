'use client';
import { useState, useEffect } from 'react';
import ManagerNurseTab from './ManagerNurseTab';
import ManagerSpecialistTab from './ManagerSpecialistTab';
import ManagerBookingTab from './ManagerBookingTab';
import { useRouter, useSearchParams } from 'next/navigation';

const TABS = [
  { id: 'nurse', label: 'Quản lý Nurse' },
  { id: 'specialist', label: 'Quản lý Specialist' },
  { id: 'booking', label: 'Quản lý Booking' },
];

const ManagerDashboard = ({ user }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const validTabs = TABS.map(t => t.id);
  const getInitialTab = () => {
    const tabParam = searchParams.get('tab');
    if (tabParam && validTabs.includes(tabParam)) return tabParam;
    return 'nurse';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Khi URL query string thay đổi thì cập nhật tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Khi click tab thì cập nhật URL
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (searchParams.get('tab') !== tabId) {
      router.push(`?tab=${tabId}`, { scroll: false });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Chào mừng Manager: {user.full_name}</h2>
        <div className="flex gap-4 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab.id ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-purple-100'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'nurse' && <ManagerNurseTab />}
        {activeTab === 'specialist' && <ManagerSpecialistTab />}
        {activeTab === 'booking' && <ManagerBookingTab />}
      </div>
    </div>
  );
};

export default ManagerDashboard;
