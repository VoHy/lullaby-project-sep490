'use client';

import { useEffect, useState, useContext, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { HeroSection, StatsSection, FeaturesSection, CTASection } from './components';
import SuccessNotification from './components/SuccessNotification';

function HomeContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const searchParams = useSearchParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!user);
    };

    checkAuth();
    
    // Kiểm tra parameter welcome
    const welcome = searchParams.get('welcome');
    if (welcome === 'true') {
      setShowWelcome(true);
      // Xóa parameter khỏi URL
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Welcome Notification */}
      {showWelcome && (
        <SuccessNotification 
          message="Chào mừng bạn đến với Lullaby!"
          onClose={() => setShowWelcome(false)}
        />
      )}
      
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải trang chủ...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
