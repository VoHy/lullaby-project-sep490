'use client';

import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiService from '@/services/api/apiService';
import Image from "next/image";
import { motion } from "framer-motion";
import { AuthContext } from "../../../context/AuthContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useContext(AuthContext);

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
        login(response.user);
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
        login(response.user);
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex min-h-screen items-center justify-center"
      >
      <div className="flex shadow-md rounded-2xl overflow-hidden w-full max-w-4xl bg-white/80">
        {/* Login form */}
        <div className="flex flex-col justify-center px-10 py-12 w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-2 text-rose-600">Welcome back</h1>
          <small className="text-gray-400 mb-6">Please login to continue</small>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                className="block w-full rounded-md border border-mint-green focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 py-2 px-3 text-gray-700"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="*****"
                className="block w-full rounded-md border border-mint-green focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 py-2 px-3 text-gray-700"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember" type="checkbox" className="mr-1 checked:bg-pink-500" />
                <label htmlFor="remember" className="text-xs font-semibold">Remember me</label>
              </div>
              <Link href="/auth/forgot-password" className="text-xs font-semibold text-pink-600 hover:underline">Forgot password?</Link>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="mb-1.5 block w-full text-center text-white bg-pink-500 hover:bg-pink-600 px-2 py-2 rounded-md font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "..." : "Đăng nhập"}
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex flex-wrap justify-center w-full border border-gray-300 hover:border-gray-500 px-2 py-2 rounded-md bg-white"
            >
              <img className="w-5 mr-2" src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="Google" />
              Login with Google
            </button>
          </form>
          <div className="text-center mt-6">
            <span className="text-xs text-gray-400 font-semibold">Don't have an account?</span>
            <Link href="/auth/register" className="text-xs font-semibold text-pink-600 ml-1">Register</Link>
          </div>
        </div>
        {/* Banner */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-white">
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src="/images/hero-bg.jpg"
              alt="Banner Login"
              width={384}
              height={512}
              className="object-cover w-full h-[32rem] rounded-r-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
} 