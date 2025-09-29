"use client";
import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { initRealtimeNotifications, disconnectRealtime } from '@/lib/realtime';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Initialize SignalR when token is available
  useEffect(() => {
    if (!token) return;
    initRealtimeNotifications(() => token).catch(err => console.warn('Realtime init failed', err));
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  // Thêm function để update user info
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Clear all application cache
    const clearAllCache = () => {
      // Clear booking cache
      localStorage.removeItem('booking_services');
      localStorage.removeItem('booking_tasks');
      localStorage.removeItem('booking_cache_time');
      localStorage.removeItem('booking_care_profiles');
      localStorage.removeItem('booking_care_cache_time');
      localStorage.removeItem('booking_nurses');
      localStorage.removeItem('booking_nurses_cache_time');
      
      // Clear services cache
      localStorage.removeItem('services_data');
      localStorage.removeItem('services_cache_time');
      
      // Clear dashboard cache
      localStorage.removeItem('dashboard_data');
      localStorage.removeItem('dashboard_cache_time');
      
      // Clear any other app cache
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('_cache') || key.includes('_data')) {
          localStorage.removeItem(key);
        }
      });
    };
    
    // Disconnect realtime to avoid receiving events after logout
    try { disconnectRealtime(); } catch (_) {}
    clearAllCache();
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}; 