'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import bookingsMock from '@/mock/Booking';
import careProfilesMock from '@/mock/CareProfile';
import notificationsMock from '@/mock/Notification';
import accounts from '@/mock/Account';
import NurseOverviewTab from './NurseOverviewTab';
import NurseScheduleTab from './NurseScheduleTab';
import NurseBookingsTab from './NurseBookingsTab';
import NursePatientsTab from './NursePatientsTab';
import NurseNotificationsTab from './NurseNotificationsTab';
import NurseProfileTab from './NurseProfileTab';
import workSchedulesMock from '@/mock/WorkSchedule';
import nursingSpecialists from '@/mock/NursingSpecialist';
import NurseMedicalNoteTab from './NurseMedicalNoteTab';
import medicalNotesMock from '@/mock/MedicalNote';
import customerTasks from '@/mock/CustomerTask';
import { AuthContext } from '@/context/AuthContext';

const NurseDashboard = ({ initialTab }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(initialTab || 'overview');
  const { user } = useContext(AuthContext);

  // Lấy NursingSpecialist theo user.AccountID
  const specialist = nursingSpecialists.find(n => n.AccountID === user?.AccountID);
  const nursingID = specialist?.NursingID;
  const major = specialist?.Major;

  // Chỉ lấy booking mà user phụ trách ít nhất 1 dịch vụ con (CustomerTask)
  const userCustomerTasks = customerTasks.filter(task => task.NursingID === nursingID);
  const bookingIDs = [...new Set(userCustomerTasks.map(task => task.BookingID))];
  const nurseBookings = bookingsMock.filter(b => bookingIDs.includes(b.BookingID));

  // Các filter khác giữ nguyên
  const nurseWorkSchedules = workSchedulesMock.filter(ws => ws.NursingID === nursingID);
  const patients = careProfilesMock.filter(p => nurseBookings.some(b => b.CareProfileID === p.CareProfileID));
  const notifications = notificationsMock.filter(n => n.ReceiverID === user?.AccountID || n.ReceiverRole === user?.role_id);
  const medicalNotes = medicalNotesMock.filter(note => note.NursingID === nursingID);

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'schedule', label: 'Lịch của tôi' },
    { id: 'bookings', label: 'Lịch sử lịch hẹn' },
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Chào mừng {user?.full_name || 'User'}!</h2>
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
