'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import notificationService from '@/services/api/notificationService';
import { FaCheck, FaClock, FaInfoCircle, FaBell, FaEnvelope, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';

export default function NotificationsPage() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Số thông báo mỗi trang
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getAllByAccount(user.accountID || user.AccountID);
      const items = Array.isArray(data) ? data : [];
      // Sắp xếp thông báo mới nhất lên đầu
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(items);
      setCurrentPage(1); // Reset về trang đầu khi load mới
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.notificationID === notificationId
            ? { ...n, isRead: true }
            : n
        )
      );
      // Close detail modal if open
      if (selectedNotification?.notificationID === notificationId) {
        setSelectedNotification(null);
      }
      // Refresh notifications to sync with backend
      setTimeout(() => {
        fetchNotifications();
      }, 500);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(n => notificationService.markAsRead(n.notificationID))
      );
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      // Refresh notifications to sync with backend
      setTimeout(() => {
        fetchNotifications();
      }, 500);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (notification) => {
    const message = (notification.message || notification.Content || '').toLowerCase();
    if (message.includes('đặt lịch') || message.includes('booking')) {
      return <FaCalendarAlt className="text-blue-500" />;
    } else if (message.includes('thanh toán') || message.includes('payment')) {
      return <FaCreditCard className="text-green-500" />;
    } else if (message.includes('xác nhận') || message.includes('confirm')) {
      return <FaCheck className="text-purple-500" />;
    }
    return <FaEnvelope className="text-gray-500" />;
  };

  const getNotificationType = (notification) => {
    const message = (notification.message || notification.Content || '').toLowerCase();
    if (message.includes('đặt lịch') || message.includes('booking')) {
      return { label: 'Đặt lịch', color: 'blue' };
    } else if (message.includes('thanh toán') || message.includes('payment')) {
      return { label: 'Thanh toán', color: 'green' };
    } else if (message.includes('xác nhận') || message.includes('confirm')) {
      return { label: 'Xác nhận', color: 'purple' };
    }
    return { label: 'Thông báo', color: 'gray' };
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }

    // Tự động cập nhật mỗi 30 giây
    const interval = setInterval(() => {
      if (user) {
        fetchNotifications();
      }
    }, 30000);

    // Lắng nghe realtime để refetch ngay
    const onRealtimeRefresh = () => {
      if (user) fetchNotifications();
    };
    window.addEventListener('notification:refresh', onRealtimeRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('notification:refresh', onRealtimeRefresh);
    };
  }, [user]);

  // Tính toán phân trang
  const totalPages = Math.ceil(notifications.length / pageSize);
  const paginatedNotifications = notifications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) {
    {
      notifications.length === 0 ? (
        <div className="bg-white p-8 text-center border rounded-lg">
          <FaInfoCircle className="text-3xl text-gray-400 mb-2" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Không có thông báo</h3>
          <p className="text-gray-500">Bạn chưa có thông báo nào.</p>
        </div>
      ) : (
      <table className="w-full bg-white border rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-3 text-left">Loại</th>
            <th className="py-2 px-3 text-left">Nội dung</th>
            <th className="py-2 px-3 text-left">Thời gian</th>
            <th className="py-2 px-3 text-left">Trạng thái</th>
            <th className="py-2 px-3 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {paginatedNotifications.map((notification) => {
            const typeInfo = getNotificationType(notification);
            return (
              <tr key={notification.notificationID} className="border-b">
                <td className="py-2 px-3">{typeInfo.label}</td>
                <td className="py-2 px-3">{notification.message || notification.Content || 'Thông báo mới'}</td>
                <td className="py-2 px-3">{new Date(notification.createdAt).toLocaleString('vi-VN')}</td>
                <td className="py-2 px-3">
                  {notification.isRead ? (
                    <span className="text-green-600">Đã đọc</span>
                  ) : (
                    <span className="text-purple-600">Chưa đọc</span>
                  )}
                </td>
                <td className="py-2 px-3">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.notificationID)}
                      className="px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedNotification(notification)}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 ml-2"
                  >
                    Xem
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
            <p className="mt-6 text-gray-600 text-lg">Đang tải thông báo...</p>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                <FaBell className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Thông báo
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  {notifications.length} thông báo • {unreadCount} chưa đọc
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {/* Button 'Làm mới' đã bị xoá */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FaCheck className="text-sm" />
                  Đánh dấu tất cả đã đọc
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-purple-100">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <FaInfoCircle className="text-4xl text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Không có thông báo</h3>
              <p className="text-gray-600 text-lg">Bạn chưa có thông báo nào liên quan đến booking.</p>
            </div>
          ) : (
            paginatedNotifications.map((notification, index) => {
              const typeInfo = getNotificationType(notification);
              return (
                <div
                  key={notification.notificationID}
                  className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 notification-item animate-slide-in-up ${!notification.isRead
                      ? `border-${typeInfo.color}-500 bg-gradient-to-r from-${typeInfo.color}-50 to-white`
                      : 'border-gray-200'
                    }`}
                  onClick={() => setSelectedNotification(notification)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {!notification.isRead && (
                          <span className={`w-3 h-3 bg-${typeInfo.color}-500 rounded-full animate-pulse`}></span>
                        )}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${typeInfo.color}-100 text-${typeInfo.color}-800`}>
                          {typeInfo.label}
                        </span>
                        <h3 className={`font-semibold text-lg ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                          {notification.message || notification.Content || 'Thông báo mới'}
                        </h3>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-xs" />
                          {new Date(notification.createdAt).toLocaleString('vi-VN')}
                        </div>
                        {!notification.isRead && (
                          <span className={`text-${typeInfo.color}-600 font-medium flex items-center gap-1`}>
                            <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
                            Chưa đọc
                          </span>
                        )}
                      </div>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.notificationID);
                        }}
                        className={`bg-${typeInfo.color}-100 text-${typeInfo.color}-600 p-3 rounded-xl hover:bg-${typeInfo.color}-200 transition-all duration-300 flex-shrink-0`}
                        title="Đánh dấu đã đọc"
                      >
                        <FaCheck className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trang trước
              </button>
              <span className="mx-2 text-gray-600">Trang {currentPage} / {totalPages}</span>
              <button
                className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Trang sau
              </button>
            </div>
          )}
        </div>

        {/* Notification Detail Modal */}
        {selectedNotification && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-purple-100 animate-pop-in">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {getNotificationIcon(selectedNotification)}
                    <h2 className="text-2xl font-bold text-gray-900">Chi tiết thông báo</h2>
                  </div>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="text-gray-400 hover:text-gray-600 text-3xl transition-colors duration-200 hover:scale-110"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nội dung
                    </label>
                    <p className="text-gray-900 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 text-lg">
                      {selectedNotification.message || selectedNotification.Content || 'Không có nội dung'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ID thông báo
                      </label>
                      <p className="text-gray-900 font-mono">#{selectedNotification.notificationID}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Trạng thái
                      </label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedNotification.isRead
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                        }`}>
                        {selectedNotification.isRead ? 'Đã đọc' : 'Chưa đọc'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Thời gian tạo
                    </label>
                    <p className="text-gray-900 text-lg">
                      {new Date(selectedNotification.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  {!selectedNotification.isRead && (
                    <button
                      onClick={() => {
                        markAsRead(selectedNotification.notificationID);
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FaCheck className="text-sm" />
                      Đánh dấu đã đọc
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 