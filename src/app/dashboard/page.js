'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth/authService';
import AdminDashboard from './components/AdminDashboard';
import NurseDashboard from './components/NurseDashboard';
import SpecialistDashboard from './components/SpecialistDashboard';
import PatientProfile from './components/PatientProfile';
import Sidebar from './components/Sidebar';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra xác thực và chuyển hướng nếu chưa đăng nhập
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        router.push('/auth/login');
        return;
      }
      
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Hiển thị dashboard phù hợp theo vai trò
  const renderDashboardByRole = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return <AdminDashboard user={user} />;
      case 'nurse':
        return <NurseDashboard user={user} />;
      case 'specialist':
        return <SpecialistDashboard user={user} />; 
      default:
        return <AdminDashboard user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Xin chào, {user?.name}!</p>
          </div>
          
          {renderDashboardByRole()}
        </div>
      </div>
    </div>
  );
} 