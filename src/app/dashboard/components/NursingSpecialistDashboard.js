import bookingService from '@/services/api/bookingService';
import careProfileService from '@/services/api/careProfileService';
import feedbackService from '@/services/api/feedbackService';
import { useEffect, useState } from 'react';

const NursingSpecialistDashboard = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    bookingService.getBookingServices().then(setBookings);
    careProfileService.getCareProfiles().then(setCareProfiles);
    feedbackService.getFeedbacks().then(setFeedbacks);
  }, []);

  // Lọc các booking liên quan đến nurse hiện tại
  const nurseBookings = bookings.filter(b => b.NurseID === user.AccountID);
  const patients = careProfiles.filter(p => nurseBookings.some(b => b.CareID === p.CareID));
  const nurseFeedbacks = feedbacks.filter(f => f.NurseID === user.AccountID);

  return (
    <div>
      <h2>Chào mừng Y tá/Chuyên gia: {user.full_name}</h2>
      <ul>
        <li>Số lượng bệnh nhân: {patients.length}</li>
        <li>Số lượng booking: {nurseBookings.length}</li>
        <li>Số lượng phản hồi: {nurseFeedbacks.length}</li>
      </ul>
      {/* Thêm danh sách booking, feedback, bệnh nhân chi tiết nếu cần */}
    </div>
  );
};

export default NursingSpecialistDashboard; 