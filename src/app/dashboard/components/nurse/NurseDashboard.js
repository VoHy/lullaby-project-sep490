'use client';

import bookingService from '@/services/api/bookingService';
import careProfileService from '@/services/api/careProfileService';
import feedbackService from '@/services/api/feedbackService';
import { useEffect, useState } from 'react';

const NurseDashboard = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    bookingService.getBookingServices().then(setBookings);
    careProfileService.getCareProfiles().then(setCareProfiles);
    feedbackService.getFeedbacks().then(setFeedbacks);
  }, []);

  // Filter data for current nurse
  const nurseBookings = bookings.filter(b => b.NurseID === user.AccountID);
  const patients = careProfiles.filter(p => nurseBookings.some(b => b.CareID === p.CareID));
  const nurseFeedbacks = feedbacks.filter(f => f.NurseID === user.AccountID);
  const averageRating = nurseFeedbacks.length > 0 
    ? (nurseFeedbacks.reduce((sum, f) => sum + (f.Rating || 5), 0) / nurseFeedbacks.length).toFixed(1)
    : 'N/A';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Chào mừng Y tá: {user.full_name}</h2>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700">Bệnh nhân</h3>
            <p className="text-3xl font-bold text-blue-900">{patients.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700">Lịch hẹn</h3>
            <p className="text-3xl font-bold text-green-900">{nurseBookings.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-700">Phản hồi</h3>
            <p className="text-3xl font-bold text-yellow-900">{nurseFeedbacks.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-700">Đánh giá</h3>
            <p className="text-3xl font-bold text-purple-900">{averageRating}⭐</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
            Xem lịch hẹn
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Quản lý bệnh nhân
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Cập nhật hồ sơ
          </button>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Lịch hẹn hôm nay</h3>
        <div className="space-y-2">
          {nurseBookings.slice(0, 5).map(booking => {
            const patient = patients.find(p => p.CareID === booking.CareID);
            return (
              <div key={booking.BookingServiceID} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{patient?.ProfileName || 'Bệnh nhân'}</span>
                  <p className="text-sm text-gray-500">Booking #{booking.BookingServiceID}</p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  booking.Status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {booking.Status}
                </span>
              </div>
            );
          })}
          {nurseBookings.length === 0 && (
            <p className="text-gray-500 text-center py-4">Không có lịch hẹn nào hôm nay</p>
          )}
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Phản hồi gần đây</h3>
        <div className="space-y-2">
          {nurseFeedbacks.slice(0, 3).map(feedback => (
            <div key={feedback.FeedbackID} className="p-3 bg-yellow-50 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm">{feedback.Comment}</p>
                  <p className="text-xs text-gray-500 mt-1">Đánh giá: {feedback.Rating || 5}/5 ⭐</p>
                </div>
              </div>
            </div>
          ))}
          {nurseFeedbacks.length === 0 && (
            <p className="text-gray-500 text-center py-4">Chưa có phản hồi nào</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
