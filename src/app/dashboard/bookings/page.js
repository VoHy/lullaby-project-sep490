'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

export default function BookingsPage() {
  const { user } = useContext(AuthContext);

  // Chỉ admin mới có quyền truy cập
  if (!user || user.role_id !== 1) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Quản lý Booking</h1>
          <p className="text-gray-600">Trang quản lý booking sẽ được hiển thị từ AdminDashboard component.</p>
          <div className="mt-4">
            <a 
              href="/dashboard" 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Quay lại Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
