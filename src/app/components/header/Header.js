'use client';

import { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from '../../../context/AuthContext';
import accountService from '@/services/api/accountService';
import WalletIcon from './WalletIcon';
import NotificationBell from './NotificationBell';
import { FaUser, FaSignOutAlt, FaWallet } from 'react-icons/fa';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, updateUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Derive avatar url and display name robustly across field variants
  const avatarUrl = user?.avatarUrl || user?.AvatarUrl || user?.avatar || user?.Avatar || '';
  const displayName = user?.fullName || user?.full_name || user?.FullName || user?.Full_Name || user?.email || '';
  const initial = (displayName?.trim?.()[0] || 'U').toUpperCase();

  useEffect(() => {
    // reset image error when avatar changes
    setImgError(false);
  }, [avatarUrl]);

  // Fetch avatar (và thông tin account mới nhất) nếu thiếu avatar trong context
  useEffect(() => {
    const ensureAvatar = async () => {
      try {
        const accountId = user?.accountID || user?.AccountID;
        if (!accountId) return;
        if (avatarUrl) return; // đã có avatar thì bỏ qua
        const fresh = await accountService.getAccountById(accountId);
        const freshAvatar = fresh?.avatarUrl || fresh?.AvatarUrl || fresh?.avatar || fresh?.Avatar || '';
        if (freshAvatar) {
          updateUser({ ...(user || {}), ...fresh });
        }
      } catch (_) {
        // bỏ qua lỗi để không chặn UI
      }
    };
    ensureAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.accountID, user?.AccountID, avatarUrl]);

  // Init realtime listeners (SignalR + optional FCM)
  useEffect(() => {
    let unsub;
    (async () => {
      try {
        const { initRealtimeNotifications, initFirebaseMessaging } = await import('@/lib/realtime');
        await initRealtimeNotifications(() => localStorage.getItem('token') || '');

        // Optional FCM init if env provided
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };
        if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
          try { await initFirebaseMessaging(firebaseConfig); } catch (_) {}
        }

        // Ensure NotificationBell refreshes on events
        const handler = () => {
          const ev = new CustomEvent('notification:fetch');
          window.dispatchEvent(ev);
        };
        window.addEventListener('notification:refresh', handler);
        unsub = () => window.removeEventListener('notification:refresh', handler);
      } catch (_) {}
    })();
    return () => { try { unsub?.(); } catch (_) {} };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 shadow-md text-gray-800 font-sans">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group" id="logo-icon">
              {/* Logo hình ảnh */}
              <img
                src="/images/logo.png"
                alt="Lullaby Logo"
                className="w-10 h-10 object-contain rounded-full"
              />
              <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text group-hover:from-purple-700 group-hover:to-pink-700 transition-all duration-300">
                Lullaby
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 ml-8">
            {/* Admin (roleID = 1) */}
            {user && (user.roleID === 1 || user.RoleID === 1) && (
              <>
                <Link
                  href="/team"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/team')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Điều dưỡng viên
                </Link>
                <Link
                  href="/services"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/services')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Dịch vụ
                </Link>
                <Link
                  href="/news"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/news')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Tin tức
                </Link>
                <Link
                  href="/dashboard"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/dashboard')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Quản trị viên
                </Link>
              </>
            )}

            {/* NurseSpecialist (roleID = 2) */}
            {user && (user.roleID === 2 || user.RoleID === 2) && (
              <>
                <Link
                  href="/team"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/team')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Điều dưỡng viên
                </Link>
                <Link
                  href="/services"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/services')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Dịch vụ
                </Link>
                <Link
                  href="/news"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/news')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Tin tức
                </Link>
                <Link
                  href="/dashboard"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/dashboard')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Quản lý
                </Link>
              </>
            )}

            {/* Manager (roleID = 3) */}
            {user && (user.roleID === 3 || user.RoleID === 3) && (
              <>
                <Link
                  href="/team"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/team')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Điều dưỡng viên
                </Link>
                <Link
                  href="/services"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/services')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Dịch vụ
                </Link>
                <Link
                  href="/news"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/news')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Tin tức
                </Link>
                <Link
                  href="/dashboard"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/dashboard')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Quản lý
                </Link>
              </>
            )}

            {/* Customer (roleID = 4) hoặc chưa đăng nhập */}
            {(!user || user.roleID === 4 || user.RoleID === 4) && (
              <>
                <Link
                  href="/team"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/team')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Điều dưỡng viên
                </Link>
                <Link
                  href="/services"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/services')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Dịch vụ
                </Link>
                <Link
                  href="/news"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/news')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Tin tức
                </Link>
              </>
            )}

            {/* Menu điều hướng cho Customer đã đăng nhập */}
            {user && (user.roleID === 4 || user.RoleID === 4) && (
              <>
                <Link
                  href="/appointments"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/appointments')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Lịch hẹn
                </Link>
                <Link
                  href="/profile/patient"
                  className={`text-base font-medium transition-colors duration-200 ${pathname.startsWith('/profile/patient')
                    ? 'text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                  Hồ sơ người thân
                </Link>
              </>
            )}
          </nav>
          <div className="flex items-center gap-4">
            {/* Wallet Icon - chỉ hiển thị cho customer đã đăng nhập */}
            <WalletIcon />
            {/* Notification bell */}
            <NotificationBell />

            {user ? (
              <div className="relative">
                <button
                  onClick={toggleMenu}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-200 bg-white flex items-center justify-center text-purple-700 font-bold text-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  aria-label="Tài khoản"
                >
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
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                    {/* User info header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md mr-3">
                          {avatarUrl && !imgError ? (
                            <img
                              src={avatarUrl}
                              alt={displayName || 'Avatar'}
                              className="w-full h-full object-cover"
                              onError={() => setImgError(true)}
                            />
                          ) : (
                            <div className="w-full h-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {initial}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm truncate max-w-[150px]">{displayName}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Customer (roleID = 4) */}
                    {(user.roleID === 4 || user.RoleID === 4) && (
                      <>
                        <button
                          className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => { setIsMenuOpen(false); router.push('/profile'); }}
                        >
                          <FaUser className="w-4 h-4 mr-3 text-purple-600" />
                          <span>Tài khoản</span>
                        </button>
                        <button
                          className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => { setIsMenuOpen(false); router.push('/wallet'); }}
                        >
                          <FaWallet className="w-4 h-4 mr-3 text-green-600" />
                          <span>Ví tiền</span>
                        </button>

                        {/* Separator */}
                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                          className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => {
                            setIsMenuOpen(false);
                            logout();
                          }}
                        >
                          <FaSignOutAlt className="w-4 h-4 mr-3 text-red-600" />
                          <span>Đăng xuất</span>
                        </button>
                      </>
                    )}

                    {/* Admin, NurseSpecialist, Manager - chỉ có logout */}
                    {((user.roleID === 1 || user.RoleID === 1) ||
                      (user.roleID === 2 || user.RoleID === 2) ||
                      (user.roleID === 3 || user.RoleID === 3)) && (
                        <button
                          className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => {
                            setIsMenuOpen(false);
                            logout();
                          }}
                        >
                          <FaSignOutAlt className="w-4 h-4 mr-3 text-red-600" />
                          <span>Đăng xuất</span>
                        </button>
                      )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full font-medium bg-white text-purple-600 border border-purple-300 shadow-sm hover:bg-purple-50 hover:border-purple-400 transition-all duration-300"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                >
                  Đăng ký
                </Link>
              </div>
            )}
            {/* Mobile menu toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden ml-4 text-gray-600 hover:text-purple-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Admin (roleID = 1) */}
            {user && (user.roleID === 1 || user.RoleID === 1) && (
              <>
                <Link
                  href="/team"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/team')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Điều dưỡng viên
                </Link>
                <Link
                  href="/services"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/services')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dịch vụ
                </Link>
                <Link
                  href="/news"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/news')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tin tức
                </Link>
                <Link
                  href="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/dashboard')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Quản trị viên
                </Link>
              </>
            )}

            {/* NurseSpecialist (roleID = 2) */}
            {user && (user.roleID === 2 || user.RoleID === 2) && (
              <>
                <Link
                  href="/team"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/team')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Điều dưỡng viên
                </Link>
                <Link
                  href="/services"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/services')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dịch vụ
                </Link>
                <Link
                  href="/news"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/news')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tin tức
                </Link>
                <Link
                  href="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/dashboard')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Quản lý 
                </Link>
              </>
            )}

            {/* Manager (roleID = 3) */}
            {user && (user.roleID === 3 || user.RoleID === 3) && (
              <>
                <Link
                  href="/team"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/team')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Điều dưỡng viên
                </Link>
                <Link
                  href="/services"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/services')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dịch vụ
                </Link>
                <Link
                  href="/news"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/news')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tin tức
                </Link>
                <Link
                  href="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/dashboard')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Quản lý
                </Link>
              </>
            )}

            {/* Customer (roleID = 4) hoặc chưa đăng nhập */}
            {(!user || user.roleID === 4 || user.RoleID === 4) && (
              <>
                <Link
                  href="/team"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/team')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Điều dưỡng viên
                </Link>
                <Link
                  href="/services"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/services')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dịch vụ
                </Link>
                <Link
                  href="/news"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/news')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tin tức
                </Link>
              </>
            )}

            {/* Customer đã đăng nhập: thêm lịch hẹn, hồ sơ người thân */}
            {user && (user.roleID === 4 || user.RoleID === 4) && (
              <>
                <Link
                  href="/appointments"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/appointments')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Lịch hẹn
                </Link>
                <Link
                  href="/profile/patient"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/profile/patient')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hồ sơ người thân
                </Link>
              </>
            )}

            {/* Logout button for all logged in users */}
            {user && (
              <button
                className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
              >
                <FaSignOutAlt className="w-4 h-4 mr-3 text-red-600" />
                <span>Đăng xuất</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}