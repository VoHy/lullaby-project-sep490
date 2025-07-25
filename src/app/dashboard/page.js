'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import authService from '@/services/auth/authService';
import AdminDashboard from './components/admin/AdminDashboard';
import NurseDashboard from './components/nurse/NurseDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import SpecialistDashboard from './components/specialist/SpecialistDashboard';
import Sidebar from './components/Sidebar';

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    const tabParam = searchParams.get('tab');
    switch (user.role_id) {
      case 1: // Admin
        return <AdminDashboard user={user} initialTab={tabParam} />;
      case 2: // Nurse
        return <NurseDashboard user={user} initialTab={tabParam} />;
      case 4: // Manager
        return <ManagerDashboard user={user} />;
      case 5: // Specialist
        return <NurseDashboard user={user} initialTab={tabParam} />;
      default:
        return (
          <div className="text-center py-10">
            <p className="text-gray-500">Không có quyền truy cập dashboard</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 overflow-auto">
        {renderDashboardByRole()}
      </div>
    </div>
  );
} 