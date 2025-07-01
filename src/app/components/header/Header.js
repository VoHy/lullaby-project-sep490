'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import authService from '@/services/auth/authService';

export default function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsLoggedIn(authenticated);

      if (authenticated) {
        const user = authService.getCurrentUser();
        setUserRole(user?.role || 'guest');
      } else {
        setUserRole('guest');
      }
    };

    checkAuth();
    // Đăng ký listener cho thay đổi localStorage (đăng nhập/đăng xuất)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserRole('guest');
    // Trigger localStorage event để các components khác biết
    window.dispatchEvent(new Event('storage'));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-pink-50 to-rose-100 shadow-sm text font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-extrabold text-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 tracking-wide" id="logo-icon">
                Lullaby
              </Link>
            </div>
            <nav className="hidden sm:ml-8 sm:flex sm:space-x-10">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname === '/'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
              >
                Trang chủ
              </Link>
              <Link
                href="/nurse"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/nurse')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
              >
                Y tá
              </Link>
              <Link
                href="/news"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/news')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
              >
                Tin tức
              </Link>

              {/* Menu điều hướng cho người dùng đã đăng nhập */}
              {isLoggedIn && (
                <>
                  <Link
                    href="/appointments"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/appointments')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    Lịch hẹn
                  </Link>

                  {/* Menu điều hướng dành riêng cho y tá/admin */}
                  {(userRole === 'nurse' || userRole === 'admin' || userRole === 'specialist') && (
                    <Link
                      href="/dashboard"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/dashboard')
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                    >
                      Quản lý
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center z-10">
            {isLoggedIn ? (
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu-button"
                    onClick={toggleMenu}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600">
                      {userRole === 'admin' ? 'A' : userRole === 'nurse' ? 'N' : userRole === 'specialist' ? 'S' : 'U'}
                    </div>
                  </button>
                </div>

                {isMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Hồ sơ
                    </Link>
                    {userRole === 'relative' && (
                      <>
                        <Link
                          href="/profile/patient"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Hồ sơ bệnh nhân
                        </Link>
                        <Link
                          href="/payment/history"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Lịch sử thanh toán
                        </Link>
                      </>
                    )}
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-5 py-2 border border-transparent text-base font-semibold rounded-md text-blue-600 bg-white hover:bg-gray-50"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-5 py-2 border border-transparent text-base font-semibold rounded-md text-white bg-black hover:bg-gray-700"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === '/'
                ? 'border-blue-500 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Trang chủ
          </Link>
          <Link
            href="/nurse"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/nurse')
                ? 'border-blue-500 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Y tá
          </Link>
          <Link
            href="/news"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/news')
                ? 'border-blue-500 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Tin tức
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/appointments"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/appointments')
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Lịch hẹn
              </Link>

              {(userRole === 'nurse' || userRole === 'admin' || userRole === 'specialist') && (
                <Link
                  href="/dashboard"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/dashboard')
                      ? 'border-blue-500 text-blue-700 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Quản lý
                </Link>
              )}

              <Link
                href="/profile"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/profile')
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Hồ sơ
              </Link>

              <button
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                href="/auth/register"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 