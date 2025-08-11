'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaBell } from 'react-icons/fa';
import NurseOverviewTab from './NurseOverviewTab';
import NurseScheduleTab from './NurseScheduleTab';
import NurseBookingsTab from './NurseBookingsTab';
import NursePatientsTab from './NursePatientsTab';
import NurseNotificationsTab from './NurseNotificationsTab';
import NurseProfileTab from './NurseProfileTab';
import NurseMedicalNoteTab from './NurseMedicalNoteTab';
import { AuthContext } from '@/context/AuthContext';
// import bookingService from '@/services/api/bookingService';
import careProfileService from '@/services/api/careProfileService';
import notificationService from '@/services/api/notificationService';
import workScheduleService from '@/services/api/workScheduleService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
// import medicalNoteService from '@/services/api/medicalNoteService';
// import customizeTaskService from '@/services/api/customizeTaskService';

const NurseDashboard = ({ user, initialTab }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(initialTab || 'overview');

  // State cho API data
  const [nurseBookings, setNurseBookings] = useState([]);
  const [nurseWorkSchedules, setNurseWorkSchedules] = useState([]);
  const [patients, setPatients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [medicalNotes, setMedicalNotes] = useState([]);
  const [specialist, setSpecialist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Load data từ API
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.accountID) return;

      try {
        setLoading(true);
        setError("");
        
        // Lấy thông tin specialist
        const specialists = await nursingSpecialistService.getAllNursingSpecialists();
        const currentSpecialist = specialists.find(n => n.accountID === user.accountID);
        setSpecialist(currentSpecialist);

        if (!currentSpecialist?.nursingID) {
          setLoading(false);
          return;
        }

        const nursingID = currentSpecialist.nursingID;

        // Load tất cả data song song
        const [
          allCareProfiles,
          myWorkSchedules
        ] = await Promise.all([
          careProfileService.getCareProfiles(),
          workScheduleService.getAllByNursing(nursingID)
        ]);

        // Lọc data theo nursingID
        // const userCustomizeTasks = allCustomizeTasks.filter(task => task.nursingID === nursingID);
        // const bookingIDs = [...new Set(userCustomizeTasks.map(task => task.bookingID))]; // Comment vì bookingService chưa hoàn thiện
        // const filteredBookings = allBookings.filter(b => bookingIDs.includes(b.bookingID)); // Comment vì bookingService chưa hoàn thiện
        
        // const filteredWorkSchedules = allWorkSchedules.filter(ws => ws.nursingID === nursingID);
        // const filteredPatients = allCareProfiles.filter(p => filteredBookings.some(b => b.careProfileID === p.careProfileID)); // Comment vì bookingService chưa hoàn thiện
        // const filteredNotifications = allNotifications.filter(n => n.receiverID === user.accountID || n.receiverRole === user.roleID);
        // const filteredMedicalNotes = allMedicalNotes.filter(note => note.nursingID === nursingID);

        // setNurseBookings(filteredBookings); // Comment vì bookingService chưa hoàn thiện
        setNurseWorkSchedules(Array.isArray(myWorkSchedules) ? myWorkSchedules : []);
        // setPatients(filteredPatients); // Comment vì bookingService chưa hoàn thiện
        // setNotifications(filteredNotifications);
        // setMedicalNotes(filteredMedicalNotes);

        // Fetch unread notifications
        try {
          const unread = await notificationService.getUnreadByAccount(user.accountID);
          setUnreadNotifications(Array.isArray(unread) ? unread.length : 0);
        } catch (error) {
          console.error('Error fetching notifications:', error);
          setUnreadNotifications(0);
        }

      } catch (error) {
        console.error('Error fetching nurse dashboard data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'schedule', label: 'Lịch của tôi' },
    { id: 'bookings', label: 'Lịch hẹn' },
    { id: 'patients', label: 'Hồ sơ bệnh nhân' },
    { id: 'medicalnote', label: 'Ghi chú y tế' },
    { id: 'notifications', label: 'Thông báo' },
    { id: 'profile', label: 'Tài khoản cá nhân' },
  ];

  // Khi đổi tab thì cập nhật query param
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('tab', tabId);
    router.replace(`/dashboard?${params.toString()}`);
  };

  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
    // eslint-disable-next-line
  }, [initialTab]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Chào mừng {user?.fullName || 'User'}!</h2>
        <button
          onClick={() => router.push('/notifications')}
          className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors"
          title="Xem thông báo"
        >
          <FaBell className="text-xl" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </button>
      </div>
      <div className="flex gap-4 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab.id ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-purple-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6 w-full">
        <div>
          {activeTab === 'overview' && (
            <NurseOverviewTab nurseAccount={user} nurseBookings={nurseBookings} patients={patients} notifications={notifications} />
          )}
          {activeTab === 'schedule' && (
            <NurseScheduleTab workSchedules={nurseWorkSchedules} nurseBookings={nurseBookings} />
          )}
          {activeTab === 'bookings' && (
            <NurseBookingsTab nurseBookings={nurseBookings} />
          )}
          {activeTab === 'patients' && (
            <NursePatientsTab patients={patients} />
          )}
          {activeTab === 'medicalnote' && (
            <NurseMedicalNoteTab medicalNotes={medicalNotes} patients={patients} />
          )}
          {activeTab === 'notifications' && (
            <NurseNotificationsTab notifications={notifications} />
          )}
          {activeTab === 'profile' && (
            <NurseProfileTab nurseAccount={user} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
