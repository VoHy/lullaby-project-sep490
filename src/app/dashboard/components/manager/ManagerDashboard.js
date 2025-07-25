'use client';
import { useState, useEffect } from 'react';
import ManagerNurseTab from './ManagerNurseTab';
import ManagerSpecialistTab from './ManagerSpecialistTab';
import ManagerBookingTab from './ManagerBookingTab';
import ManagerZoneTab from './ManagerZoneTab';
import { useRouter, useSearchParams } from 'next/navigation';
import zoneService from '@/services/api/zoneService';
import nursingSpecialists from '@/mock/NursingSpecialist';

const TABS = [
  { id: 'nurse', label: 'Quản lý Nurse' },
  { id: 'specialist', label: 'Quản lý Specialist' },
  { id: 'booking', label: 'Quản lý Booking' },
  { id: 'zone', label: 'Quản lý Khu vực' }, // Thêm tab mới
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
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [zoneNurses, setZoneNurses] = useState([]);
  const [zoneSpecialists, setZoneSpecialists] = useState([]);

  useEffect(() => {
    zoneService.getZones().then(setZones);
  }, []);

  useEffect(() => {
    if (!selectedZone) {
      setZoneNurses([]);
      setZoneSpecialists([]);
      return;
    }
    // Lọc nurse
    const nurses = nursingSpecialists.filter(n => n.NursingID && n.ZoneID == selectedZone);
    // Lọc specialist
    const specialists = nursingSpecialists.filter(s => s.NursingID && s.ZoneID == selectedZone);
    setZoneNurses(nurses);
    setZoneSpecialists(specialists);
  }, [selectedZone]);

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
        {activeTab === 'zone' && <ManagerZoneTab />}
      </div>
    </div>
  );
};

export default ManagerDashboard;
