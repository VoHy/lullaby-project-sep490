'use client';

import { useState, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from '../../../context/AuthContext';
import WalletIcon from './WalletIcon';
import NotificationBell from './NotificationBell';

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
              {/* Admin (roleID = 1) */}
              {user && (user.roleID === 1 || user.RoleID === 1) && (
                <>
                  <Link
                    href="/team"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/team')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    Điều dưỡng viên
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
                    href="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/dashboard')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
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
                     className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/team')
                         ? 'border-blue-500 text-gray-900'
                         : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                       }`}
                   >
                     Điều dưỡng viên
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
                   {/* Notification link removed: now handled by header bell icon */}
                   <Link
                     href="/dashboard"
                     className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/dashboard')
                         ? 'border-blue-500 text-gray-900'
                         : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                       }`}
                   >
                     Y tá
                   </Link>
                 </>
               )}

                             {/* Manager (roleID = 3) */}
               {user && (user.roleID === 3 || user.RoleID === 3) && (
                 <>
                   <Link
                     href="/team"
                     className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/team')
                         ? 'border-blue-500 text-gray-900'
                         : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                       }`}
                   >
                     Điều dưỡng viên
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
                   {/* Notification link removed: now handled by header bell icon */}
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

              {/* Customer (roleID = 4) hoặc chưa đăng nhập */}
              {(!user || user.roleID === 4 || user.RoleID === 4) && (
                <>
                  <Link
                    href="/team"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/team')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    Điều dưỡng viên
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

                             {/* Menu điều hướng cho Customer đã đăng nhập */}
               {user && (user.roleID === 4 || user.RoleID === 4) && (
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
                   {/* Notification link removed: now handled by header bell icon */}
                   <Link
                     href="/profile/patient"
                     className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold ${pathname.startsWith('/profile/patient')
                         ? 'border-blue-500 text-gray-900'
                         : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                       }`}
                   >
                     Hồ sơ người thân
                   </Link>
                 </>
               )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* Wallet Icon - chỉ hiển thị cho customer đã đăng nhập */}
            <WalletIcon />
            {/* Notification bell: between wallet and avatar for customer; next to avatar for other roles */}
            <NotificationBell />
            
            {user ? (
              <div className="relative">
                <button onClick={toggleMenu} className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                  {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50">
                                         {/* Customer (roleID = 4) */}
                     {(user.roleID === 4 || user.RoleID === 4) && (
                       <>
                         <button
                           className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                           onClick={() => { setIsMenuOpen(false); router.push('/profile'); }}
                         >
                           Tài khoản
                         </button>
                         <button
                           className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                           onClick={() => { setIsMenuOpen(false); router.push('/payment/history'); }}
                         >
                           Lịch sử thanh toán
                         </button>
                         <button
                           className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                           onClick={() => { 
                             setIsMenuOpen(false); 
                             logout(); 
                           }}
                         >
                           Đăng xuất
                         </button>
                       </>
                     )}
                    
                    {/* Admin, NurseSpecialist, Manager - chỉ có logout */}
                    {((user.roleID === 1 || user.RoleID === 1) || 
                      (user.roleID === 2 || user.RoleID === 2) || 
                      (user.roleID === 3 || user.RoleID === 3)) && (
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => { 
                          setIsMenuOpen(false); 
                          logout(); 
                        }}
                      >
                        Đăng xuất
                      </button>
                    )}
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
          {/* Admin (roleID = 1) */}
          {user && (user.roleID === 1 || user.RoleID === 1) && (
            <>
              <Link
                href="/team"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/team')
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Điều dưỡng viên
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
                href="/dashboard"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/dashboard')
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
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
                 className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/team')
                     ? 'border-blue-500 text-blue-700 bg-blue-50'
                     : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                   }`}
                 onClick={() => setIsMenuOpen(false)}
               >
                 Điều dưỡng viên
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
                {/* Notification link removed on mobile */}
               <Link
                 href="/dashboard"
                 className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/dashboard')
                     ? 'border-blue-500 text-blue-700 bg-blue-50'
                     : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                   }`}
                 onClick={() => setIsMenuOpen(false)}
               >
                 Chuyên gia
               </Link>
             </>
           )}

                     {/* Manager (roleID = 3) */}
           {user && (user.roleID === 3 || user.RoleID === 3) && (
             <>
               <Link
                 href="/team"
                 className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/team')
                     ? 'border-blue-500 text-blue-700 bg-blue-50'
                     : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                   }`}
                 onClick={() => setIsMenuOpen(false)}
               >
                 Điều dưỡng viên
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
                {/* Notification link removed on mobile */}
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

          {/* Customer (roleID = 4) hoặc chưa đăng nhập */}
          {(!user || user.roleID === 4 || user.RoleID === 4) && (
            <>
              <Link
                href="/team"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/team')
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Điều dưỡng viên
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

                     {/* Customer đã đăng nhập: thêm lịch hẹn, thông báo, hồ sơ người thân */}
           {user && (user.roleID === 4 || user.RoleID === 4) && (
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
                {/* Notification link removed on mobile */}
               <Link
                 href="/profile/patient"
                 className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/profile/patient')
                     ? 'border-blue-500 text-blue-700 bg-blue-50'
                     : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
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