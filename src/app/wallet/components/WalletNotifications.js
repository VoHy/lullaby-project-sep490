'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const WalletNotifications = ({ notifications, onMarkAsRead, onDelete }) => {
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    if (!notifications) return;
    
    let filtered = notifications;
    if (filter === 'unread') {
      filtered = notifications.filter(n => !n.isRead);
    } else if (filter === 'read') {
      filtered = notifications.filter(n => n.isRead);
    }
    
    setFilteredNotifications(filtered);
  }, [notifications, filter]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheck className="text-green-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaBell className="text-blue-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <FaBell className="text-3xl text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Không có thông báo nào</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FaBell className="text-purple-500" />
          Thông báo ví
        </h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
        >
          <option value="all">Tất cả</option>
          <option value="unread">Chưa đọc</option>
          <option value="read">Đã đọc</option>
        </select>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications.map((notification, index) => (
          <motion.div
            key={notification.notificationID || notification.NotificationID}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`border rounded-lg p-4 ${getNotificationColor(notification.type)} ${
              !notification.isRead ? 'border-l-4 border-l-purple-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {notification.title || notification.Title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {notification.content || notification.Content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatDate(notification.createdDate || notification.CreatedDate)}</span>
                    {!notification.isRead && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                        Chưa đọc
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!notification.isRead && (
                  <button
                    onClick={() => onMarkAsRead(notification.notificationID || notification.NotificationID)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Đánh dấu đã đọc"
                  >
                    <FaCheck className="text-xs" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(notification.notificationID || notification.NotificationID)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Xóa thông báo"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-8">
          <FaBell className="text-3xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Không có thông báo nào phù hợp</p>
        </div>
      )}
    </motion.div>
  );
};

export default WalletNotifications; 