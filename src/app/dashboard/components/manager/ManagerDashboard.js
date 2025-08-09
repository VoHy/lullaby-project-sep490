'use client';
import { useState, useEffect } from 'react';
import ManagerNurseTab from './ManagerNurseTab';
import ManagerSpecialistTab from './ManagerSpecialistTab';
import ManagerBookingTab from './ManagerBookingTab';
import { useRouter, useSearchParams } from 'next/navigation';
import zoneService from '@/services/api/zoneService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';

const TABS = [
  { id: 'nurse', label: 'Quản lý Nurse', icon: '👩‍⚕️' },
  { id: 'specialist', label: 'Quản lý Specialist', icon: '👨‍⚕️' },
  { id: 'booking', label: 'Quản lý Booking', icon: '📅' },
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
  const [tabLoading, setTabLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Load data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [zonesData, nursingSpecialistsData] = await Promise.all([
          zoneService.getZones(),
          nursingSpecialistService.getAllNursingSpecialists()
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
    const nurses = nursingSpecialists.filter(n => n.nursingID && n.zoneID == selectedZone);
    // Lọc specialist
    const specialists = nursingSpecialists.filter(s => s.nursingID && s.zoneID == selectedZone);
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
  const handleTabChange = async (tabId) => {
    if (tabId === activeTab) return;

    setTabLoading(true);
    setActiveTab(tabId);

    if (searchParams.get('tab') !== tabId) {
      router.push(`?tab=${tabId}`, { scroll: false });
    }

    // Hiển thị thông báo
    const selectedTab = TABS.find(tab => tab.id === tabId);
    setNotificationMessage(`Đã chuyển sang ${selectedTab.label}`);
    setShowNotification(true);

    // Simulate loading time for better UX
    setTimeout(() => {
      setTabLoading(false);
      // Ẩn thông báo sau 2 giây
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }, 300);
  };

  // Tính toán thống kê
  const getManagedZone = () => {
    if (!user?.accountID) return null;
    return zones.find(zone => zone.managerID === user.accountID);
  };

  const getZoneStats = () => {
    const managedZone = getManagedZone();
    if (!managedZone) return { nurses: 0, specialists: 0, total: 0 };

    const zoneNurses = nursingSpecialists.filter(ns =>
      ns.zoneID === managedZone.zoneID && ns.major === 'nurse'
    );
    const zoneSpecialists = nursingSpecialists.filter(ns =>
      ns.zoneID === managedZone.zoneID && ns.major === 'specialist'
    );

    return {
      nurses: zoneNurses.length,
      specialists: zoneSpecialists.length,
      total: zoneNurses.length + zoneSpecialists.length
    };
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

  const managedZone = getManagedZone();
  const stats = getZoneStats();

  return (
    <div className="space-y-6">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-in">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Chào mừng Manager: {user.fullName}</h2>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-400 rounded-lg">
                <span className="text-2xl">👩‍⚕️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm opacity-90">Tổng Nurse</p>
                <p className="text-2xl font-bold">{stats.nurses}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-400 rounded-lg">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm opacity-90">Tổng Specialist</p>
                <p className="text-2xl font-bold">{stats.specialists}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-400 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm opacity-90">Tổng nhân sự</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-pink-400 rounded-lg">
                <span className="text-2xl">🗺️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm opacity-90">Khu vực quản lý</p>
                <p className="text-lg font-bold">{managedZone?.zoneName || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 md:gap-4">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={tabLoading}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                  }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {tabLoading && activeTab === tab.id && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px] relative">
          {tabLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Đang chuyển tab...</p>
              </div>
            </div>
          )}

          <div className={`transition-all duration-300 ${activeTab === 'nurse' ? 'opacity-100' : 'opacity-0 hidden'}`}>
            {activeTab === 'nurse' && <ManagerNurseTab />}
          </div>

          <div className={`transition-all duration-300 ${activeTab === 'specialist' ? 'opacity-100' : 'opacity-0 hidden'}`}>
            {activeTab === 'specialist' && <ManagerSpecialistTab />}
          </div>

          <div className={`transition-all duration-300 ${activeTab === 'booking' ? 'opacity-100' : 'opacity-0 hidden'}`}>
            {activeTab === 'booking' && <ManagerBookingTab />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
