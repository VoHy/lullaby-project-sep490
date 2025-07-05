"use client";

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthContext } from '../../../context/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-pink-50 to-rose-100 shadow-2xl text font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="font-extrabold text-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 tracking-wide"
                id="logo-icon">
                Lullaby
              </Link>
            </div>
            <nav className="hidden sm:ml-8 sm:flex sm:space-x-10">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${
                  pathname === "/"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}>
                Trang chủ
              </Link>
              <Link
                href="/team"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/team')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
              >
                Đội Ngũ
              </Link>
              <Link
                href="/services"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/services')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
              >
                Dịch vụ
              </Link>
              <Link
                href="/news"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${
                  pathname.startsWith("/news")
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}>
                Tin tức
              </Link>
              {/* Menu điều hướng cho người dùng đã đăng nhập */}
              {user && (
                <>
                  <Link
                    href="/appointments"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${
                      pathname.startsWith("/appointments")
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}>
                    Lịch hẹn
                  </Link>
                  {/* Menu điều hướng dành riêng cho y tá/admin */}
                  {(user.role === 'nurse' || user.role === 'admin' || user.role === 'specialist') && (
                    <Link
                      href="/dashboard"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${
                        pathname.startsWith("/dashboard")
                          ? "border-blue-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}>
                      Quản lý
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center z-10">
            {user ? (
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff9fc1]"
                    id="user-menu-button"
                    onClick={toggleMenu}>
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600">
                      {user.role === 'admin' ? 'A' : user.role === 'nurse' ? 'N' : user.role === 'specialist' ? 'S' : 'U'}
                    </div>
                  </button>
                </div>
                {isMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-warm-white ring-1 ring-[#ff9fc1] ring-opacity-75 focus:outline-none"
                    role="menu">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-charcoal hover:bg-[#ff9fc1] hover:text-charcoal transition-colors duration-150"
                      role="menuitem"
                      onClick={() => setIsMenuOpen(false)}>
                      Hồ sơ
                    </Link>
                    {user.role === 'relative' && (
                      <>
                        <Link
                          href="/profile/patient"
                          className="block px-4 py-2 text-sm text-charcoal hover:bg-[#ff9fc1] hover:text-charcoal transition-colors duration-150"
                          role="menuitem"
                          onClick={() => setIsMenuOpen(false)}>
                          Hồ sơ bệnh nhân
                        </Link>
                        <Link
                          href="/payment/history"
                          className="block px-4 py-2 text-sm text-charcoal hover:bg-[#ff9fc1] hover:text-charcoal transition-colors duration-150"
                          role="menuitem"
                          onClick={() => setIsMenuOpen(false)}>
                          Lịch sử thanh toán
                        </Link>
                      </>
                    )}
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-charcoal hover:bg-[#ff9fc1] hover:text-charcoal transition-colors duration-150"
                      role="menuitem"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-5 py-2 border border-transparent text-base font-semibold rounded-md text-blue-600 bg-white hover:bg-gray-50">
                  Đăng nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-5 py-2 border border-transparent text-base font-semibold rounded-md text-white bg-black hover:bg-gray-700">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-charcoal hover:text-[#ff9fc1] hover:bg-[#ff9fc1]/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#ff9fc1]"
              onClick={toggleMenu}>
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${
                  isMenuOpen ? "hidden" : "block"
                } h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${
                  isMenuOpen ? "block" : "hidden"
                } h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } sm:hidden bg-[#ff9fc1]/90 backdrop-blur-sm`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === "/"
                ? "border-blue-500 text-blue-700 bg-blue-50"
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            }`}
            onClick={() => setIsMenuOpen(false)}>
            Trang chủ
          </Link>
          <Link
            href="/team"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/team')
                ? 'border-blue-500 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Đội Ngũ
          </Link>
          <Link
            href="/services"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/services')
                ? 'border-blue-500 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Dịch vụ
          </Link>
          <Link
            href="/news"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname.startsWith("/news")
                ? "border-blue-500 text-blue-700 bg-blue-50"
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            }`}
            onClick={() => setIsMenuOpen(false)}>
            Tin tức
          </Link>

          {user && (
            <>
              <Link
                href="/appointments"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  pathname.startsWith("/appointments")
                    ? "border-blue-500 text-blue-700 bg-blue-50"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}>
                Lịch hẹn
              </Link>

              {(user.role === 'nurse' || user.role === 'admin' || user.role === 'specialist') && (
                <Link
                  href="/dashboard"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    pathname.startsWith("/dashboard")
                      ? "border-blue-500 text-blue-700 bg-blue-50"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                  onClick={() => setIsMenuOpen(false)}>
                  Quản lý
                </Link>
              )}

              <Link
                href="/profile"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  pathname.startsWith("/profile")
                    ? "border-blue-500 text-blue-700 bg-blue-50"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}>
                Hồ sơ
              </Link>

              <button
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-charcoal hover:bg-[#ff9fc1]/20 hover:border-[#ff9fc1] hover:text-charcoal"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}>
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
