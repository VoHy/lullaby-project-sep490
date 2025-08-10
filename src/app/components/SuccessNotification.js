'use client';

import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimes, FaBell } from 'react-icons/fa';

export default function SuccessNotification({ 
  message, 
  isVisible, 
  onClose, 
  type = 'success',
  duration = 5000 
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          icon: <FaCheckCircle className="text-2xl text-white" />,
          border: 'border-green-200'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
          icon: <FaBell className="text-2xl text-white" />,
          border: 'border-blue-200'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          icon: <FaBell className="text-2xl text-white" />,
          border: 'border-yellow-200'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-pink-500',
          icon: <FaTimes className="text-2xl text-white" />,
          border: 'border-red-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          icon: <FaCheckCircle className="text-2xl text-white" />,
          border: 'border-green-200'
        };
    }
  };

  const styles = getNotificationStyles();

  return (
    <div className={`fixed top-4 right-4 z-50 animate-slide-in-right ${isAnimating ? 'animate-slide-in-right' : 'animate-slide-in-up'}`}>
      <div className={`${styles.bg} text-white rounded-2xl shadow-2xl border ${styles.border} p-4 min-w-80 max-w-md transform transition-all duration-300 ${isAnimating ? 'scale-100' : 'scale-95'}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {styles.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-lg leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-white hover:text-gray-200 transition-colors duration-200 p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 bg-white bg-opacity-20 rounded-full h-1 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-300 ease-linear"
            style={{ 
              width: isAnimating ? '100%' : '0%',
              transition: `width ${duration}ms linear`
            }}
          />
        </div>
      </div>
    </div>
  );
} 