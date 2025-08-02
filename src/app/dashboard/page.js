'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import AdminDashboard from './components/admin/AdminDashboard';
import NurseDashboard from './components/nurse/NurseDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import SpecialistDashboard from './components/specialist/SpecialistDashboard';
import Sidebar from './components/Sidebar';

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    // Kiểm tra xác thực và chuyển hướng nếu chưa đăng nhập
    const checkAuth = () => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Bổ sung kiểm tra trạng thái user
      if (
        !user ||
        user.deletedAt !== null && user.deletedAt !== undefined && user.deletedAt !== 'NULL' && user.deletedAt !== '' ||
        (user.status && user.status !== 'active')
      ) {
        logout();
        localStorage.clear();
        router.push('/auth/login');
        return;
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, user, logout]);

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
    const userRole = user.roleID || user.role_id;
    
    switch (userRole) {
      case 1: // Admin
        return <AdminDashboard user={user} initialTab={tabParam} />;
      case 2: // NurseSpecialist
        return <NurseDashboard user={user} initialTab={tabParam} />;
      case 3: // Manager
        return <ManagerDashboard user={user} />;
      case 4: // Customer
        return (
          <div className="text-center py-10">
            <p className="text-gray-500">Không có quyền truy cập dashboard</p>
          </div>
        );
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