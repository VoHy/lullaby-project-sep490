'use client';

import React, { useState, useEffect, useContext } from 'react';
import { FaBell, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import notificationService from '@/services/api/notificationService';

export default function NotificationsPage() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getAllNotificationsByAccount(user.accountID);
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Không thể tải thông báo. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
        return <FaCheckCircle className="text-green-500" />;
      case 'booking_cancelled':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaBell className="text-blue-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'booking_confirmed':
        return 'bg-green-50 border-green-200';
      case 'booking_cancelled':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.IsRead;
    return notification.Type === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Đang tải thông báo...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Có lỗi xảy ra
              </h3>
              <p className="text-gray-500">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaBell className="mr-2 text-blue-500" />
                Thông báo
              </h3>
              <span className="text-sm text-gray-500">
                {filteredNotifications.length} thông báo
              </span>
            </div>

            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔔</div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Không có thông báo nào
                </h3>
                <p className="text-gray-500">
                  Bạn sẽ nhận được thông báo khi có cập nhật về booking
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.NotificationID}
                    className={`p-4 rounded-lg border ${getNotificationColor(notification.Type)} ${
                      !notification.IsRead ? 'ring-2 ring-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getNotificationIcon(notification.Type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-800">
                              {notification.Title}
                            </h4>
                            {!notification.IsRead && (
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {notification.Content}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-500">
                              {notification.CreatedAt 
                                ? new Date(notification.CreatedAt).toLocaleString('vi-VN')
                                : 'Vừa xong'
                              }
                            </span>
                            <div className="flex space-x-2">
                              {!notification.IsRead && (
                                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                  Đánh dấu đã đọc
                                </button>
                              )}
                              <button className="text-xs text-gray-500 hover:text-gray-700">
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Filter và Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Đánh dấu tất cả đã đọc
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-800">
                    Xóa tất cả
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Lọc:</span>
                  <select 
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    <option value="unread">Chưa đọc</option>
                    <option value="booking_confirmed">Booking đã xác nhận</option>
                    <option value="booking_cancelled">Booking đã hủy</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 