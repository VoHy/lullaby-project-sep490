'use client';
import { useState, useEffect } from 'react';
import ManagerNurseTab from './ManagerNurseTab';
import ManagerSpecialistTab from './ManagerSpecialistTab';
import ManagerBookingTab from './ManagerBookingTab';
import ManagerZoneTab from './ManagerZoneTab';
import { useRouter, useSearchParams } from 'next/navigation';
import zoneService from '@/services/api/zoneService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';

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
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const [zonesData, nursingSpecialistsData] = await Promise.all([
          zoneService.getZones(),
          nursingSpecialistService.getNursingSpecialists()
        ]);

        setZones(zonesData);
        setNursingSpecialists(nursingSpecialistsData);
      } catch (error) {
        console.error('Error fetching manager dashboard data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
  }, [selectedZone, nursingSpecialists]);

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

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
          Thử lại
        </button>
      </div>
    );
  }

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
