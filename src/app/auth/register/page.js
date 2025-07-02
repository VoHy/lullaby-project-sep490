'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiService from '@/services/api/apiService';
import Image from 'next/image';
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    // Kiểm tra mật khẩu nhập lại
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);

    try {
      await apiService.auth.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      router.push('/auth/login');
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      let errorMessage = 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng nhập với Google
  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const fakeGoogleToken = 'fake-google-token-' + Date.now();
      
      const response = await apiService.auth.loginWithGoogle(fakeGoogleToken);
      console.log('Đăng nhập Google thành công:', response);
      
      if (response && response.user) {
        // Chuyển hướng dựa trên vai trò của người dùng
        const role = response.user.role;
        if (role === 'admin') {
          router.push('/dashboard');
        } else if (role === 'nurse') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } else {
        throw new Error('Không nhận được thông tin người dùng từ server');
      }
    } catch (err) {
      console.error('Lỗi đăng nhập Google:', err);
      let errorMessage = 'Đăng nhập với Google thất bại. Vui lòng thử lại sau.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex min-h-screen items-center justify-center"
    >
      <div className="flex shadow-md rounded-2xl overflow-hidden w-full max-w-4xl bg-white/80">
        {/* Register form */}
        <div className="flex flex-col justify-center px-10 py-12 w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-2 text-rose-600">Đăng ký tài khoản</h1>
          <small className="text-gray-400 mb-6">Vui lòng nhập thông tin để đăng ký</small>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold">Họ tên</label>
              <input
                type="text"
                name="name"
                placeholder="Nhập họ tên"
                className="block w-full rounded-md border border-mint-green focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 py-2 px-3 text-gray-700"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
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
              <label className="mb-2 block text-xs font-semibold">Mật khẩu</label>
              <input
                type="password"
                name="password"
                placeholder="Nhập mật khẩu"
                className="block w-full rounded-md border border-mint-green focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 py-2 px-3 text-gray-700"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold">Xác nhận mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                className="block w-full rounded-md border border-mint-green focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 py-2 px-3 text-gray-700"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="mb-1.5 block w-full text-center text-white bg-pink-500 hover:bg-pink-600 px-2 py-2 rounded-md font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "..." : "Đăng ký"}
            </button>
          </form>
          <div className="text-center mt-6">
            <span className="text-xs text-gray-400 font-semibold">Đã có tài khoản?</span>
            <Link href="/auth/login" className="text-xs font-semibold text-pink-600 ml-1">Đăng nhập</Link>
          </div>
        </div>
        {/* Banner */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-white">
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src="/images/hero-bg.jpg"
              alt="Banner Register"
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