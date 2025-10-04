"use client";

import React, { useEffect, useState } from 'react';
import SuccessNotification from '@/app/components/SuccessNotification';

function extractMessageFromPayload(payload) {
  if (!payload) return '';
  
  // Direct message
  if (payload.message) return payload.message;
  
  // Check args array
  if (payload.args && Array.isArray(payload.args) && payload.args.length) {
    const first = payload.args[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object') {
      return first.message || first.Content || first.content || first.text || JSON.stringify(first);
    }
  }
  
  // Event-based messages với Vietnamese
  if (payload.event) {
    const eventMessages = {
      'BookingCreated': 'Đã tạo booking mới',
      'ScheduleCreated': 'Đã tạo lịch trình mới', 
      'ScheduleCancelled': 'Lịch trình đã bị hủy',
      'AssignNurseRequested': 'Yêu cầu phân công y tá',
      'NurseArrived': 'Y tá đã đến',
      'GenericNotification': 'Thông báo mới',
      'TestNotification': 'Thông báo test - SignalR hoạt động!'
    };
    return eventMessages[payload.event] || `Sự kiện: ${payload.event}`;
  }
  
  return '';
}

export default function RealtimeToastHandler() {
  // Stack of toasts
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Listen for realtime events and show toasts
  useEffect(() => {
    const handleRealtimeEvent = (event) => {
      const payload = event.detail;      
      // Skip connection events
      if (payload?.event === 'ConnectionId' || payload?.event === 'Reconnected') {
        return;
      }
      
      // Extract message from payload
      const message = extractMessageFromPayload(payload);
      if (!message) return;
      
      // Add new toast
      const newToast = {
        id: Date.now() + Math.random(),
        message: message,
        type: 'success', // có thể customize dựa trên event type
        duration: 5000
      };
      
      setToasts(prev => [...prev, newToast]);
      
      // Also check pending notifications queue
      try {
        if (typeof window !== 'undefined' && window.__pendingRealtimeNotifications) {
          const pending = window.__pendingRealtimeNotifications || [];
          window.__pendingRealtimeNotifications = [];
          
          pending.forEach(pendingPayload => {
            if (pendingPayload?.event !== 'ConnectionId' && pendingPayload?.event !== 'Reconnected') {
              const pendingMessage = extractMessageFromPayload(pendingPayload);
              if (pendingMessage) {
                const pendingToast = {
                  id: Date.now() + Math.random(),
                  message: pendingMessage,
                  type: 'success',
                  duration: 5000
                };
                setToasts(prev => [...prev, pendingToast]);
              }
            }
          });
        }
      } catch (err) {
        console.warn('[RealtimeToastHandler] Error processing pending notifications:', err);
      }
    };

    // Listen for realtime events
    if (typeof window !== 'undefined') {
      window.addEventListener('notification:refresh', handleRealtimeEvent);
      
      // Process any pending notifications on mount
      handleRealtimeEvent({ detail: {} });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('notification:refresh', handleRealtimeEvent);
      }
    };
  }, []);

  // Render stacked toasts (top-right)
  return (
    <>
      {toasts.map((t, idx) => (
        <div 
          key={t.id} 
          className="fixed top-4 right-4" 
          style={{ marginTop: idx * 90, zIndex: 99999 }}
        >
          <SuccessNotification
            message={t.message}
            isVisible={true}
            type={t.type}
            duration={t.duration}
            onClose={() => removeToast(t.id)}
          />
        </div>
      ))}
    </>
  );
}