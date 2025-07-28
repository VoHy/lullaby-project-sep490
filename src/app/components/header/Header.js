'use client';

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from '../../../context/AuthContext';
import WalletIcon from './WalletIcon';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
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
              <Link href="/" className="font-extrabold text-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 tracking-wide" id="logo-icon">
                Lullaby
              </Link>
            </div>
            <nav className="hidden sm:ml-8 sm:flex sm:space-x-10">
              {/* Menu cho Admin - giống Relative nhưng có "Quản lý" thay vì "Hồ sơ Người Thân" */}
              {user && user.role_id === 1 && (
                <>
                  <Link
                    href="/team"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/team')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    Điều Dưỡng Viên
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
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/news')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    Tin tức
                  </Link>
                  <Link
                    href="/appointments"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/appointments')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    Lịch hẹn
                  </Link>
                  <Link
                    href="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/dashboard')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    Quản lý
                  </Link>
                </>
              )}

              {/* Menu cho Staff (Manager, Nurse, Specialist) */}
              {user && (user.role_id === 2 || user.role_id === 4 || user.role_id === 5) && (
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/dashboard')
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  Quản Lý
                </Link>
              )}

              {/* Menu công khai cho Relative hoặc chưa login */}
              {(!user || user.role_id === 3) && (
                <>
                  <Link
                    href="/team"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/team')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    Điều Dưỡng Viên
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
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/news')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    Tin tức
                  </Link>
                </>
              )}

              {/* Menu điều hướng cho người dùng đã đăng nhập (Relative) */}
              {user && user.role_id === 3 && (
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
                  <Link
                    href="/payment/history"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/payment/history')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    Lịch sử thanh toán
                  </Link>
                  <Link
                    href="/profile/patient"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/profile/patient')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    Hồ sơ Người Thân
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* Wallet Icon - chỉ hiển thị cho user đã đăng nhập */}
            {user && <WalletIcon />}
            
            {user ? (
              <div className="relative">
                <button onClick={toggleMenu} className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                  {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50">
                    {/* Chỉ hiển thị cho Relative và Staff, không cho Admin */}
                    {user.role_id !== 1 && (
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => { setIsMenuOpen(false); router.push('/profile'); }}
                      >
                        Tài Khoản
                      </button>
                    )}
                    {user.role_id === 3 && (
                      <>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => { setIsMenuOpen(false); router.push('/payment/history'); }}
                        >
                          Lịch sử thanh toán
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => { setIsMenuOpen(false); router.push('/profile/patient'); }}
                        >
                          Hồ sơ Người Thân
                        </button>
                      </>
                    )}
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => { 
                        setIsMenuOpen(false); 
                        logout(); 
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="px-4 py-2 bg-white text-pink-600 rounded font-semibold mr-2">Đăng nhập</Link>
                <Link href="/auth/register" className="px-4 py-2 bg-black text-white rounded font-semibold">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {/* Menu cho Admin - giống Relative nhưng có "Quản lý" thay vì "Hồ sơ Người Thân" */}
          {user && user.role_id === 1 && (
            <>
              <Link
                href="/team"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/team')
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Điều Dưỡng Viên
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
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/news')
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Tin tức
              </Link>
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
            </>
          )}

          {/* Menu cho Staff (Manager, Nurse, Specialist) */}
          {user && (user.role_id === 2 || user.role_id === 4 || user.role_id === 5) && (
            <Link
              href="/dashboard"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/dashboard')
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Quản Lý
            </Link>
          )}

          {/* Menu công khai cho Relative hoặc chưa login */}
          {(!user || user.role_id === 3) && (
            <>
              <Link
                href="/team"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/team')
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Điều Dưỡng Viên
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
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/news')
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Tin tức
              </Link>
            </>
          )}

          {/* Menu cho User role Relative */}
          {user && user.role_id === 3 && (
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
              <Link
                href="/profile/patient"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/profile/patient')
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Hồ sơ Người Thân
              </Link>
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
            </>
          )}

          {/* Common profile menu cho Staff (không cho Admin) */}
          {user && (user.role_id === 2 || user.role_id === 4 || user.role_id === 5) && (
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
          )}

          {/* Logout button for all logged in users */}
          {user && (
            <button
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
            >
              Đăng xuất
            </button>
          )}
        </div>
      </div>
    </header>
  );
} 