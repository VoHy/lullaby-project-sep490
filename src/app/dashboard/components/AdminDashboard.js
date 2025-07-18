'use client';

import accountService from '@/services/api/accountService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import bookingService from '@/services/api/bookingService';
import feedbackService from '@/services/api/feedbackService';
import { useEffect, useState } from 'react';

const AdminDashboard = ({ user }) => {
  const [accounts, setAccounts] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    accountService.getAllAccounts().then(setAccounts);
    nursingSpecialistService.getNursingSpecialists().then(setNursingSpecialists);
    bookingService.getBookingServices().then(setBookings);
    feedbackService.getFeedbacks().then(setFeedbacks);
  }, []);

  return (
    <div>
      <h2>Chào mừng Admin: {user.full_name}</h2>
      <ul>
        <li>Tổng số người dùng: {accounts.length}</li>
        <li>Tổng số y tá/chuyên gia: {nursingSpecialists.length}</li>
        <li>Tổng số booking: {bookings.length}</li>
        <li>Tổng số phản hồi: {feedbacks.length}</li>
      </ul>
      {/* Thêm các bảng, biểu đồ, danh sách chi tiết nếu cần */}
    </div>
  );
};

export default AdminDashboard; 