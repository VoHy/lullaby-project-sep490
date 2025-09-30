'use client';

import React, { useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaBell, FaClock, FaEnvelope, FaCalendarAlt, FaCreditCard, FaCheck } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import notificationService from '@/services/api/notificationService';

export default function NotificationBell() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const getCreatedAtTs = (n) => {
      const v = n.createdAt || n.CreatedAt || n.created_at || n.createdAT;
      const t = v ? new Date(v).getTime() : 0;
      return Number.isFinite(t) ? t : 0;
    };
    const fetchUnread = async () => {
      try {
        if (!user) return;
        const accountId = user.accountID || user.AccountID;
        if (!accountId) return;

        // Try to get count; if API not available, fall back to length of unread list
        try {
          const count = await notificationService.getUnreadCountByAccount(accountId);
          if (typeof count === 'number') {
            setUnreadCount(count);
            // continue to fetch recent notifications
          }
        } catch (_) {
          // ignore and try fetch unread list
          const unread = await notificationService.getUnreadByAccount(accountId);
          const unreadArray = Array.isArray(unread) ? unread : [];
          setUnreadCount(unreadArray.length);
        }

        // Get recent notifications for dropdown
        const allNotifications = await notificationService.getAllByAccount(accountId);
        const recentNotifications = Array.isArray(allNotifications)
          ? [...allNotifications].sort((a, b) => getCreatedAtTs(b) - getCreatedAtTs(a)).slice(0, 5)
          : [];
        setNotifications(recentNotifications);
      } catch (e) {
        setUnreadCount(0);
        setNotifications([]);
      }
    };

    fetchUnread();

    // Tự động cập nhật mỗi 30 giây
    const interval = setInterval(fetchUnread, 30000);

    // Lắng nghe tín hiệu realtime để refetch ngay
    const onRealtimeRefresh = () => fetchUnread();
    window.addEventListener('notification:refresh', onRealtimeRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('notification:refresh', onRealtimeRefresh);
    };
  }, [user]);

  // Thêm hàm để refresh thủ công
  const refreshNotifications = async () => {
    try {
      if (!user) return;
      const accountId = user.accountID || user.AccountID;
      if (!accountId) return;

      // Try to get count; if API not available, fall back to length of unread list
      try {
        const count = await notificationService.getUnreadCountByAccount(accountId);
        if (typeof count === 'number') {
          setUnreadCount(count);
        }
      } catch (_) {
        // ignore and try fetch unread list
        const unread = await notificationService.getUnreadByAccount(accountId);
        const unreadArray = Array.isArray(unread) ? unread : [];
        setUnreadCount(unreadArray.length);
      }

      // Get recent notifications for dropdown
      const allNotifications = await notificationService.getAllByAccount(accountId);
      const getCreatedAtTs = (n) => {
        const v = n.createdAt || n.CreatedAt || n.created_at || n.createdAT;
        const t = v ? new Date(v).getTime() : 0;
        return Number.isFinite(t) ? t : 0;
      };
      const recentNotifications = Array.isArray(allNotifications)
        ? [...allNotifications].sort((a, b) => getCreatedAtTs(b) - getCreatedAtTs(a)).slice(0, 5)
        : [];
      setNotifications(recentNotifications);
    } catch (e) {
      setUnreadCount(0);
      setNotifications([]);
    }
  };

  // Mark all unread notifications as read (user-provided implementation)
  const [markingAll, setMarkingAll] = useState(false);
  const [markAllMessage, setMarkAllMessage] = useState('');

  const markAllAsRead = async (e) => {
    // prevent dropdown close when clicking this button
    if (e && e.stopPropagation) e.stopPropagation();

    try {
      if (!user) return;
      const accountId = user.accountID || user.AccountID;
      if (!accountId) return;

      setMarkingAll(true);
      setMarkAllMessage('Đang đánh dấu...');

      // Prefer bulk API if available
      if (typeof notificationService.markAllAsReadByAccount === 'function') {
        await notificationService.markAllAsReadByAccount(accountId);
      } else {
        // Fallback: fetch unread list from server and mark individually
        const unread = await notificationService.getUnreadByAccount(accountId);
        const unreadArray = Array.isArray(unread) ? unread : [];
        const ids = unreadArray
          .map(n => n.notificationID || n.id || n.NotificationID)
          .filter(Boolean);
        await Promise.all(ids.map(id => notificationService.markAsRead(id)));
      }

      // Optimistically update local notifications and count
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setMarkAllMessage('Đã đánh dấu tất cả là đã đọc');
      // Close dropdown after marking all
      setShowDropdown(false);
      setTimeout(() => {
        setMarkAllMessage('');
      }, 2000);

      // Refresh to sync with backend
      await refreshNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setMarkAllMessage('Không thể đánh dấu tất cả');
      setTimeout(() => setMarkAllMessage(''), 3000);
    } finally {
      setMarkingAll(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleNotificationClick = (notification) => {
    setShowDropdown(false);
    router.push('/notifications');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label="Thông báo"
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-purple-600 transition-all duration-300 hover:scale-110"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
  <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-purple-100 z-50 animate-pop-in">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Thông báo gần đây</h3>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); router.push('/notifications'); }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                >
                  Xem tất cả
                </button>
                <button
                  type="button"
                  onClick={markAllAsRead}
                  disabled={markingAll}
                  className={`text-sm ${markingAll ? 'text-gray-400' : 'text-purple-600 hover:text-purple-700'} font-medium transition-colors duration-200`}
                >
                  {markingAll ? 'Đang xử lý...' : 'Đọc tất cả'}
                </button>
              </div>
            </div>
            {markAllMessage && (
              <div className="mt-2 text-sm text-gray-600">{markAllMessage}</div>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} thông báo chưa đọc
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto notification-dropdown">
            {notifications.length === 0 ? (
              <div className="p-6 text-center animate-fade-in">
                <FaBell className="text-3xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Không có thông báo</p>
              </div>
            ) : (
              notifications.map((notification, index) => {
                const typeInfo = getNotificationType(notification);
                const isUnread = !notification.isRead;

                return (
                  <div
                    key={notification.notificationID}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 cursor-pointer transition-all duration-300 hover:bg-gray-50 border-l-4 notification-item animate-slide-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {isUnread && (
                            <span className={`w-2 h-2 bg-${typeInfo.color}-500 rounded-full animate-pulse`}></span>
                          )}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${typeInfo.color}-100 text-${typeInfo.color}-800 transition-all duration-200`}>
                            {typeInfo.label}
                          </span>
                        </div>
                        <p className={`text-sm font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'
                          } line-clamp-2 transition-colors duration-200`}>
                          {notification.message || notification.Content || 'Thông báo mới'}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <FaClock className="text-xs" />
                          <span>
                            {new Date(notification.createdAt).toLocaleString('vi-VN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl animate-slide-in-up">
            </div>
          )}
        </div>
      )}
    </div>
  );
}


