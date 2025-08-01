"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import authService from "@/services/auth/authService";
import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  CTASection,
} from "./components";
import SuccessNotification from "./components/SuccessNotification";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = authService.isAuthenticated();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        setUser(authService.getCurrentUser());
      }
    };

    checkAuth();

    // Kiểm tra parameter welcome
    const welcome = searchParams.get("welcome");
    if (welcome === "true") {
      setShowWelcome(true);
      // Xóa parameter khỏi URL
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Welcome Notification */}
      {showWelcome && (
        <SuccessNotification
          message="Chào mừng bạn đến với Lullaby! 🎉"
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
