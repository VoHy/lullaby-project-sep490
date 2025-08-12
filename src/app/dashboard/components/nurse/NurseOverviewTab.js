import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import bookingService from '@/services/api/bookingService';
import workScheduleService from '@/services/api/workScheduleService';
import notificationService from '@/services/api/notificationService';

const NurseOverviewTab = () => {
  const { user } = useContext(AuthContext);
  const [counts, setCounts] = useState({ bookings: 0, patients: 0, notifications: 0, schedulesToday: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!user?.accountID) return;
        const specialists = await nursingSpecialistService.getAllNursingSpecialists();
        const me = specialists.find(s => (s.accountID || s.AccountID) === (user.accountID || user.AccountID));
        const nursingID = me?.nursingID || me?.NursingID;
        const accountId = user.accountID || user.AccountID;

        let myBookings = [];
        try { myBookings = await bookingService.getBookingsByNursing(nursingID); } catch (_) {}

        // schedules and notifications
        const [schedules, unread] = await Promise.all([
          workScheduleService.getAllByNursing(nursingID),
          notificationService.getUnreadByAccount(accountId)
        ]);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const schedulesToday = (schedules || []).filter(ws => {
          const d = new Date(ws.workDate || ws.WorkDate || ws.Date);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === today.getTime();
        }).length;

        // patients count from bookings' care profiles
        const patientIds = new Set((myBookings || []).map(b => b.careProfileID || b.CareProfileID).filter(Boolean));

        setCounts({
          bookings: (myBookings || []).length,
          patients: patientIds.size,
          notifications: Array.isArray(unread) ? unread.length : (unread?.count || 0),
          schedulesToday,
        });
      } catch (e) {
        setError(e?.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-purple-50 p-4 rounded">
        <div className="text-sm text-purple-600">Booking của tôi</div>
        <div className="text-3xl font-bold text-purple-800">{counts.bookings}</div>
      </div>
      <div className="bg-blue-50 p-4 rounded">
        <div className="text-sm text-blue-600">Bệnh nhân</div>
        <div className="text-3xl font-bold text-blue-800">{counts.patients}</div>
      </div>
      <div className="bg-green-50 p-4 rounded">
        <div className="text-sm text-green-600">Lịch hôm nay</div>
        <div className="text-3xl font-bold text-green-800">{counts.schedulesToday}</div>
      </div>
      <div className="bg-pink-50 p-4 rounded">
        <div className="text-sm text-pink-600">Thông báo chưa đọc</div>
        <div className="text-3xl font-bold text-pink-800">{counts.notifications}</div>
      </div>
    </div>
  );
};

export default NurseOverviewTab; 