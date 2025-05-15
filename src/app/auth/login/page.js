'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiService from '@/services/api/apiService';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiService.auth.login(formData);
      if (response.user) {
        // Chuyển hướng dựa trên vai trò của người dùng
        const role = response.user.role;
        if (role === 'admin') {
          router.push('/dashboard');
        } else if (role === 'nurse') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng nhập với Google
  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Giả lập việc lấy token từ Google OAuth
      const fakeGoogleToken = 'fake-google-token-' + Date.now();
      
      const response = await apiService.auth.loginWithGoogle(fakeGoogleToken);
      
      if (response.user) {
        // Chuyển hướng dựa trên vai trò của người dùng
        const role = response.user.role;
        if (role === 'admin') {
          router.push('/dashboard');
        } else if (role === 'nurse') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Đăng nhập với Google thất bại. Vui lòng thử lại sau.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-white p-4">
      <div className="w-full max-w-md border-mint-green shadow-lg rounded-lg overflow-hidden">
        <div className="space-y-1 bg-mint-green/20 p-6">
          <h1 className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-center text-3xl text-charcoal bg-soft-mint-green">Login</h1>
          <p className="text-center text-charcoal/70">
          Enter your credentials to access your account
          </p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-charcoal">
                Email
              </label>
              <div className="relative">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="absolute left-3 top-2.5 h-5 w-5 text-charcoal/50" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="pl-10 w-full px-3 py-2 border border-mint-green/50 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-green"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-charcoal">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-sm text hover:text-sky-blue/80 hover:underline">
                  Forget Password?
                </Link>
              </div>
              <div className="relative">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="absolute left-3 top-2.5 h-5 w-5 text-charcoal/50" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pl-10 w-full px-3 py-2 border border-mint-green/50 rounded-md focus:outline-none focus:ring-2 focus:ring-mint-green"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-charcoal/70 hover:text-charcoal"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                  <span className="sr-only">{showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                </button>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-charcoal bg-soft-mint-green hover:bg-mint-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint-green"
              disabled={isLoading}
            >
              {isLoading ? "..." : "Login"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-charcoal/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-xs text-charcoal/60">
              OR CONTINUE WITH
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            type="button"
            className="w-full flex justify-center py-2 px-4 border border-sky-blue/50 rounded-md shadow-sm text-sm font-medium text-charcoal bg-white hover:bg-sky-blue/10"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Login with Google
          </button>
        </div>
        <div className="flex justify-center bg-mint-green/10 py-4">
          <p className="text-sm text-charcoal/70">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-sky-blue hover:text-sky-blue/80 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 