'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar, faUsers, faUserNurse, faFileAlt, faCog, faCalendarAlt,
  faUser, faMoneyBill, faHospital, faNotesMedical, faChevronLeft,
  faChevronRight, faSignOutAlt, faBars, faHome, faStethoscope,
  faClipboardList, faUserMd, faTasks, faBlog, faNewspaper, faCalendarTimes, faCalendarCheck, faMapLocationDot
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ user }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = {
    1: [ // Admin
      { name: 'Tổng quan', path: '/dashboard?tab=overview', icon: faChartBar, color: 'text-purple-500', tab: 'overview' },
      { name: 'Quản lý người dùng', path: '/dashboard?tab=users', icon: faUsers, color: 'text-blue-500', tab: 'users' },
      { name: 'Quản lý Manager', path: '/dashboard?tab=managers', icon: faUserMd, color: 'text-indigo-500', tab: 'managers' },
      { name: 'Quản lý Booking', path: '/dashboard?tab=bookings', icon: faCalendarAlt, color: 'text-green-500', tab: 'bookings' },
      { name: 'Quản lý Dịch vụ', path: '/dashboard?tab=services', icon: faStethoscope, color: 'text-pink-500', tab: 'services' },
      { name: 'Báo cáo Doanh thu', path: '/dashboard?tab=revenue', icon: faMoneyBill, color: 'text-yellow-500', tab: 'revenue' },
      { name: 'Quản lý Blog', path: '/dashboard?tab=blog', icon: faNewspaper, color: 'text-red-500', tab: 'blog' },
      { name: 'Quản lý Lịch nghỉ', path: '/dashboard?tab=holiday', icon: faCalendarCheck, color: 'text-red-500', tab: 'holiday' },
      { name: 'Cài đặt Hệ thống', path: '/dashboard?tab=settings', icon: faCog, color: 'text-gray-500', tab: 'settings' },
    ],
    2: [ // Nurse
      { name: 'Tổng quan', path: '/dashboard', icon: faChartBar, color: 'text-purple-500' },
      { name: 'Hồ sơ cá nhân', path: '/profile', icon: faUser, color: 'text-pink-500' },
      { name: 'Hồ sơ bệnh nhân', path: '/profile/patient', icon: faNotesMedical, color: 'text-blue-500' },
      { name: 'Lịch hẹn', path: '/dashboard/appointments', icon: faCalendarAlt, color: 'text-green-500' },
    ],
    4: [ // Manager
      { name: 'Quản lý Nurse', path: '/dashboard?tab=nurse', icon: faUserNurse, color: 'text-blue-500', tab: 'nurse' },
      { name: 'Quản lý Specialist', path: '/dashboard?tab=specialist', icon: faUserMd, color: 'text-pink-500', tab: 'specialist' },
      { name: 'Quản lý Booking', path: '/dashboard?tab=booking', icon: faCalendarAlt, color: 'text-green-500', tab: 'booking' },
      { name: 'Quản lý Khu vực', path: '/dashboard?tab=zone', icon: faMapLocationDot, color: 'text-red-500', tab: 'zone' },
    ],
    5: [ // Specialist
      { name: 'Tổng quan', path: '/dashboard', icon: faChartBar, color: 'text-purple-500' },
      { name: 'Hồ sơ cá nhân', path: '/profile', icon: faUser, color: 'text-pink-500' },
      { name: 'Hồ sơ bệnh nhân', path: '/profile/patient', icon: faNotesMedical, color: 'text-blue-500' },
      { name: 'Ca bệnh', path: '/dashboard/cases', icon: faStethoscope, color: 'text-red-500' },
    ],
  };

  const currentMenuItems = menuItems[user?.role_id] || [];

  // Get role name based on role_id
  const getRoleName = (role_id) => {
    const roleMap = {
      1: 'Administrator',
      2: 'Nurse',
      4: 'Manager', 
      5: 'Specialist'
    };
    return roleMap[role_id] || 'User';
  };

  return (
    <div 
      className={`
        relative h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-rose-50 
        shadow-2xl transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-60'}
        border-r border-pink-100/50
        rounded-r-2xl flex flex-col
        min-w-[64px] max-w-[240px]
        overflow-y-auto max-h-screen
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 rounded-2xl">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Header */}
      <div className="relative p-6 border-b border-pink-200/30">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Lullaby
              </h2>
              <p className="text-xs text-gray-500 mt-1">Healthcare Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              p-2 rounded-xl transition-all duration-300 hover:scale-110
              ${isCollapsed ? 'bg-purple-100 hover:bg-purple-200' : 'bg-pink-100 hover:bg-pink-200'}
              text-purple-600 hover:text-purple-700 shadow-md hover:shadow-lg
            `}
          >
            <FontAwesomeIcon 
              icon={isCollapsed ? faChevronRight : faChevronLeft} 
              className="text-lg"
            />
          </button>
        </div>

        {/* User Profile Section */}
        <div className={`mt-6 transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100'}`}>
          <UserProfile user={user} getRoleName={getRoleName} />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4 px-2 flex-1">
        <div className="space-y-1">
          {currentMenuItems.map((item, index) => {
            // Determine if this item is active
            let isActive = false;
            if (item.tab) {
              isActive = pathname.startsWith('/dashboard') && currentTab === item.tab;
            } else {
              isActive = pathname === item.path;
            }
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  group flex items-center px-3 py-2 rounded-lg transition-all duration-300
                  text-sm
                  hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100
                  hover:shadow-md hover:scale-105 transform
                  ${isActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg font-bold'
                    : 'bg-white text-gray-700 hover:text-purple-700'}
                  animate-slideIn
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`
                  flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300
                  ${isActive
                    ? 'bg-white/20 text-white'
                    : `bg-gradient-to-br from-white to-gray-50 ${item.color} group-hover:scale-110 shadow-sm`}
                `}>
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-lg"
                  />
                </div>
                {!isCollapsed && (
                  <div className="ml-3 flex-1 flex items-center">
                    <span className="font-medium text-sm tracking-wide">
                      {item.name}
                    </span>
                  </div>
                )}
                {!isCollapsed && isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Collapse Button (when collapsed) */}
      {isCollapsed && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>
        </div>
      )}

      {/* Hover Effect Line */}
      {isHovered && !isCollapsed && (
        <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400 animate-slideDown rounded-full"></div>
      )}
    </div>
  );
};

// Enhanced User Profile Component
const UserProfile = ({ user, getRoleName }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
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
      <div 
        className="flex items-center p-3 rounded-xl bg-gradient-to-r from-white/50 to-pink-50/50 border border-pink-200/30 cursor-pointer hover:shadow-md transition-all duration-300"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-800 text-sm">
            {user?.full_name || 'User'}
          </h3>
          <p className="text-xs text-purple-600 font-medium">
            {getRoleName(user?.role_id)}
          </p>
        </div>
        <FontAwesomeIcon 
          icon={faChevronRight} 
          className={`text-gray-400 text-xs transition-transform duration-300 ${dropdownOpen ? 'rotate-90' : ''}`}
        />
      </div>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-pink-200/30 py-2 z-50 animate-slideDown">
          <button
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-300"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-red-500" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 