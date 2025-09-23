'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar, faUsers, faUserNurse, faCalendarAlt,
  faUser, faMoneyBill, faNotesMedical, faChevronLeft,
  faChevronRight, faSignOutAlt, faBars, faStethoscope,
  faUserMd, faNewspaper, faCalendarCheck, faMapLocationDot
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '@/context/AuthContext';
import accountService from '@/services/api/accountService';

// Enhanced User Profile Component (with avatar)
const UserProfile = ({ user, getRoleName, avatarUrl, displayName, initial }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

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
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {avatarUrl && !imgError ? (
              <img
                src={avatarUrl}
                alt={displayName || 'Avatar'}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span>{initial}</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-800 text-sm">
            {displayName || 'User'}
          </h3>
          <p className="text-xs text-purple-600 font-medium">
            {getRoleName(user?.roleID || user?.role_id)}
          </p>
        </div>
        <FontAwesomeIcon
          icon={faChevronRight}
          className={`text-gray-400 text-xs transition-transform duration-300 ${dropdownOpen ? 'rotate-90' : ''}`}
        />
      </div>

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

const Sidebar = ({ user }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { updateUser } = useContext(AuthContext);

  // Derive avatar and display name
  const avatarUrl = user?.avatarUrl || user?.AvatarUrl || user?.avatar || user?.Avatar || '';
  const displayName = user?.fullName || user?.full_name || user?.FullName || user?.Full_Name || user?.email || '';
  const initial = (displayName?.trim?.()[0] || 'U').toUpperCase();

  // Ensure avatar by fetching account if missing
  useEffect(() => {
    const ensureAvatar = async () => {
      try {
        const accountId = user?.accountID || user?.AccountID;
        if (!accountId) return;
        if (avatarUrl) return;
        const fresh = await accountService.getAccountById(accountId);
        const freshAvatar = fresh?.avatarUrl || fresh?.AvatarUrl || fresh?.avatar || fresh?.Avatar || '';
        if (freshAvatar) {
          updateUser ? updateUser({ ...(user || {}), ...fresh }) : null;
        }
      } catch (_) {
        // ignore
      }
    };
    ensureAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.accountID, user?.AccountID, avatarUrl]);

  const menuItems = {
    1: [ // Admin
      { name: 'Tổng quan', path: '/dashboard?tab=overview', icon: faChartBar, color: 'text-purple-500', tab: 'overview' },
      { name: 'Quản lý người dùng', path: '/dashboard?tab=users', icon: faUsers, color: 'text-blue-500', tab: 'users' },
      { name: 'Quản lý', path: '/dashboard?tab=managers', icon: faUserMd, color: 'text-indigo-500', tab: 'managers' },
      { name: 'Quản lý khu vực', path: '/dashboard?tab=zone', icon: faMapLocationDot, color: 'text-red-500', tab: 'zone' },
      { name: 'Quản lý lịch hẹn', path: '/dashboard?tab=bookings', icon: faCalendarAlt, color: 'text-green-500', tab: 'bookings' },
      { name: 'Quản lý dịch vụ', path: '/dashboard?tab=services', icon: faStethoscope, color: 'text-pink-500', tab: 'services' },
      { name: 'Báo cáo doanh thu', path: '/dashboard?tab=revenue', icon: faMoneyBill, color: 'text-yellow-500', tab: 'revenue' },
      { name: 'Quản lý tin tức', path: '/dashboard?tab=blog', icon: faNewspaper, color: 'text-red-500', tab: 'blog' },
      { name: 'Quản lý lịch nghỉ lễ', path: '/dashboard?tab=holiday', icon: faCalendarCheck, color: 'text-red-500', tab: 'holiday' },
    ],
    2: ({ major }) => [ // Nursing/Specialist
      { name: 'Lịch của tôi', path: '/dashboard?tab=schedule', icon: faCalendarAlt, color: 'text-green-500', tab: 'schedule' },
      { name: major === 'Nurse' ? 'Lịch hẹn' : 'Lịch sử lịch hẹn', path: '/dashboard?tab=bookings', icon: faStethoscope, color: 'text-red-500', tab: 'bookings' },
      { name: 'Hồ sơ khách hàng', path: '/dashboard?tab=patients', icon: faNotesMedical, color: 'text-blue-500', tab: 'patients' },
      { name: 'Ghi chú y tế', path: '/dashboard?tab=medicalnote', icon: faNotesMedical, color: 'text-blue-500', tab: 'medicalnote' },
      { name: 'Hồ sơ cá nhân', path: '/dashboard?tab=profile', icon: faUser, color: 'text-pink-500', tab: 'profile' },
    ],
    3: [ // Manager
      { name: 'Quản lý chuyên viên chăm sóc', path: '/dashboard?tab=nurse', icon: faUserNurse, color: 'text-blue-500', tab: 'nurse' },
      { name: 'Quản lý chuyên viên tư vấn', path: '/dashboard?tab=specialist', icon: faUserMd, color: 'text-pink-500', tab: 'specialist' },
      { name: 'Quản lý lịch hẹn', path: '/dashboard?tab=booking', icon: faCalendarAlt, color: 'text-green-500', tab: 'booking' },
    ],
  };

  // Get role name based on role_id or roleID
  const getRoleName = (role_id) => {
    const roleMap = {
      1: 'Quản trị viên',
      2: 'Chuyên viên',
      3: 'Quản lý',
    };
    return roleMap[role_id] || 'Unauthorized';
  };

  // Get role and major from user
  const userRole = user?.roleID || user?.role_id;
  const userMajor = user?.major; // Assuming major is passed for roleID 2
  const currentMenuItems = userRole === 2 ? menuItems[2]({ major: userMajor }) : menuItems[userRole] || [];

  // Redirect unauthorized users (e.g., Customer) to login or another page
  useEffect(() => {
    if (!menuItems[userRole]) {
      router.push('/auth/login'); // Redirect to login or another page
    }
  }, [userRole, router]);

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
        z-50
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 rounded-2xl pointer-events-none">
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
          <UserProfile user={user} getRoleName={getRoleName} avatarUrl={avatarUrl} displayName={displayName} initial={initial} />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4 px-2 flex-1">
        <div className="space-y-1">
          {currentMenuItems.length > 0 ? (
            currentMenuItems.map((item, index) => {
              let isActive = false;
              if (item.tab) {
                isActive = pathname.startsWith('/dashboard') && currentTab === item.tab;
              } else {
                isActive = pathname === item.path;
              }
              if (!currentTab && index === 0) {
                isActive = true;
              }
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className={`
                    group flex items-center px-3 py-2 rounded-lg
                    text-sm cursor-pointer w-full text-left select-none
                    hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100
                    hover:shadow-md
                    ${isActive
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg font-bold'
                      : 'bg-white text-gray-700 hover:text-purple-700'}
                    pointer-events-auto
                    no-underline
                    relative z-10
                    transition-all duration-200
                    hover:scale-105
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`
                    flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300
                    ${isActive
                      ? 'bg-white/20 text-white'
                      : `bg-gradient-to-br from-white to-gray-50 ${item.color} group-hover:scale-110 shadow-sm`}
                    pointer-events-none
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
            })
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2"></div>
              <p className="text-gray-500 text-sm">Không có menu</p>
              <p className="text-gray-400 text-xs mt-1">Role: {userRole}, Major: {userMajor || 'N/A'}</p>
            </div>
          )}
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

export default Sidebar;