'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar, faUsers, faUserNurse, faFileAlt, faCog, faCalendarAlt,
  faUser, faMoneyBill, faHospital, faNotesMedical
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ user }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = {
    admin: [
      { name: 'Tổng quan', path: '/dashboard', icon: '' },
      { name: 'Quản lý người dùng', path: '/dashboard/users', icon: '' },
      { name: 'Quản lý y tá', path: '/dashboard/nurses', icon: '' },
      { name: 'Báo cáo', path: '/dashboard/reports', icon: '' },
      { name: 'Cài đặt', path: '/dashboard/settings', icon: '' },
    ],
    nurse: [
      { name: 'Tổng quan', path: '/dashboard', icon: '' },
      { name: 'Hồ sơ cá nhân', path: '/profile', icon: '' },
      { name: 'Hồ sơ bệnh nhân', path: '/profile/patient', icon: '' },
      { name: 'Đặt lịch', path: '/booking', icon: '' },
      { name: 'Lịch hẹn', path: '/dashboard/appointments', icon: '' },
    ],
    specialist: [
      { name: 'Tổng quan', path: '/dashboard', icon: '' },
      { name: 'Hồ sơ cá nhân', path: '/profile', icon: '' },
      { name: 'Hồ sơ bệnh nhân', path: '/profile/patient', icon: '' },
      { name: 'Đặt lịch', path: '/booking', icon: '' },
      { name: 'Ca bệnh', path: '/dashboard/cases', icon: '' },
    ],
  };

  const currentMenuItems = menuItems[user?.role] || [];

  const iconMap = {
    'Tổng quan': faChartBar,
    'Quản lý người dùng': faUsers,
    'Quản lý y tá': faUserNurse,
    'Báo cáo': faFileAlt,
    'Cài đặt': faCog,
    'Hồ sơ cá nhân': faUser,
    'Hồ sơ bệnh nhân': faNotesMedical,
    'Đặt lịch': faCalendarAlt,
    'Lịch hẹn': faCalendarAlt,
    'Ca bệnh': faHospital,
  };

  return (
    <div className={`bg-white h-screen shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} relative`}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h2 className="text-xl font-bold">Lullaby</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        <div className="mt-4">
          <UserDropdown user={user} isCollapsed={isCollapsed} />
        </div>
      </div>

      <nav className="mt-4">
        {currentMenuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
              pathname === item.path ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <span className="text-xl mr-3">
              <FontAwesomeIcon icon={iconMap[item.name]} />
            </span>
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

// Dropdown component
const UserDropdown = ({ user, isCollapsed }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.href = '/auth/login';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setOpen((v) => !v)}
      >
        {user?.name?.charAt(0)}
      </button>
      {!isCollapsed && (
        <div className="ml-3 inline-block align-middle">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>
      )}
      {open && !isCollapsed && (
        <div className="absolute left-0 bottom-12 w-48 bg-white shadow-lg rounded-lg py-2 z-20 border">
          <Link
            href="/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Thông tin tài khoản
          </Link>
          <Link
            href="/profile/patient"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Hồ sơ bệnh nhân
          </Link>
          <button
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 