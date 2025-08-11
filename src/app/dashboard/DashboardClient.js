'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import AdminDashboard from './components/admin/AdminDashboard';
import NurseDashboard from './components/nurse/NurseDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import Sidebar from './components/Sidebar';

// Skeleton Loading Component
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="flex">
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-white shadow-lg min-h-screen">
        <div className="p-6">
          <div className="h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content Skeleton */}
      <div className="flex-1 p-8">
        <div className="h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

// Utility function to clear dashboard cache
const clearDashboardCache = () => {
  localStorage.removeItem('dashboard_data');
  localStorage.removeItem('dashboard_cache_time');
};

export default function DashboardClient() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setLoading(false);
    };

    // Delay để đảm bảo AuthContext đã load
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [user, router]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null; // Sẽ redirect về login
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">{error}</h3>
          <button 
            onClick={() => {
              clearDashboardCache();
              window.location.reload();
            }} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Render dashboard based on user role
  const renderDashboard = () => {
    const roleID = user.roleID;
    
    switch (roleID) {
      case 1: // Admin
        return <AdminDashboard user={user} />;
      case 2: // NurseSpecialist
        return <NurseDashboard user={user} />;
      case 3: // Manager
        return <ManagerDashboard user={user} />;
      case 4: // Customer - redirect to home
        router.push('/');
        return null;
      default:
        router.push('/');
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex relative">
        <Sidebar user={user} />
        <div className="flex-1 relative">
          {renderDashboard()}
        </div>
      </div>
    </div>
  );
}


