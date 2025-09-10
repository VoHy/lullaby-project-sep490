'use client';

// Singleton SignalR connection with safe dynamic import
let connection = null;
let isConnecting = false;

function dispatchRefreshEvent(payload = {}) {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('notification:refresh', { detail: payload }));
    }
  } catch (_) {}
}

export async function initRealtimeNotifications(getAuthToken) {
  if (connection || isConnecting) return connection;
  isConnecting = true;
  try {
    const hubUrl = process.env.NEXT_PUBLIC_SIGNALR_HUB || process.env.NEXT_PUBLIC_SIGNALR_URL || '';
    if (!hubUrl) {
      console.warn('[SignalR] NEXT_PUBLIC_SIGNALR_HUB/URL chưa được cấu hình. Bỏ qua realtime.');
      isConnecting = false;
      return null;
    }

    const signalR = await import('@microsoft/signalr');

    const builder = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: async () => {
          try { return (await Promise.resolve(getAuthToken?.())) || ''; }
          catch { return ''; }
        },
      })
      .withAutomaticReconnect({ nextRetryDelayInMilliseconds: () => 3000 });

    connection = builder.build();

    // Register server events
    const onEvent = (eventName) => (...args) => {
      dispatchRefreshEvent({ event: eventName, args });
    };

    const events = [
      'BookingCreated',
      'ScheduleCreated',
      'ScheduleCancelled',
      'AssignNurseRequested',
      'NurseArrived',
      'GenericNotification'
    ];
    events.forEach((evt) => {
      try { connection.on(evt, onEvent(evt)); } catch (_) {}
    });

    // Start connection
    try { await connection.start(); }
    catch (err) {
      console.warn('[SignalR] Không thể kết nối hub lần đầu:', err);
      try { await connection.start(); } catch (_) {}
    }

    // Also refresh on reconnect
    connection.onreconnected(() => dispatchRefreshEvent({ event: 'Reconnected' }));

    isConnecting = false;
    return connection;
  } catch (err) {
    console.warn('[SignalR] Không khởi tạo được (có thể thiếu @microsoft/signalr):', err);
    isConnecting = false;
    return null;
  }
}

// Optional: send client ack or mark as read via hub if backend hỗ trợ
export async function invokeHub(methodName, ...args) {
  try {
    if (!connection) return null;
    return await connection.invoke(methodName, ...args);
  } catch (err) {
    console.warn('[SignalR] invoke lỗi:', err);
    return null;
  }
}

// Firebase Messaging scaffold with dynamic import (an toàn nếu chưa cài SDK)
export async function initFirebaseMessaging(firebaseConfig) {
  try {
    if (typeof window === 'undefined') return null;
    const [{ initializeApp }, { getMessaging, getToken, onMessage, isSupported }] = await Promise.all([
      import('firebase/app'),
      import('firebase/messaging')
    ]);

    if (!(await isSupported())) {
      console.warn('[FCM] Trình duyệt không hỗ trợ push messaging.');
      return null;
    }

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    // Register service worker nếu có
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      } catch (e) {
        console.warn('[FCM] Đăng ký service worker thất bại:', e);
      }
    }

    // Lấy token (với VAPID key từ env)
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || undefined;
    let fcmToken = null;
    try {
      fcmToken = await getToken(messaging, { vapidKey });
      if (fcmToken) {
        // Phát sự kiện để backend/client có thể gửi token lên server lưu mapping
        dispatchRefreshEvent({ event: 'FcmToken', token: fcmToken });
      }
    } catch (e) {
      console.warn('[FCM] Không lấy được token:', e);
    }

    // Lắng nghe message foreground -> làm tươi danh sách thông báo
    onMessage(messaging, () => dispatchRefreshEvent({ event: 'FcmMessage' }));

    return fcmToken;
  } catch (err) {
    console.warn('[FCM] Không khởi tạo được (có thể thiếu firebase SDK):', err);
    return null;
  }
}


