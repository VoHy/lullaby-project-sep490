'use client';

import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from '@/services/api';
import Image from "next/image";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhoneNumber: '',
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
      const response = await authService.login({
        emailOrPhoneNumber: formData.emailOrPhoneNumber,
        password: formData.password,
      });

      // Chuẩn hóa dữ liệu trả về (hỗ trợ cả camelCase và PascalCase từ backend)
      const account = response?.account || response?.Account || null;
      const token = response?.token || response?.Token || account?.token || account?.Token;
      if (account && token) {
        login(account, token);
        // Chuyển hướng dựa trên vai trò của người dùng
        const roleID = account?.roleID ?? account?.RoleID;

        if (roleID === 1) { // Admin
          router.push('/dashboard');
        } else if (roleID === 2) { // NurseSpecialist
          router.push('/dashboard');
        } else if (roleID === 3) { // Manager
          router.push('/dashboard');
        } else if (roleID === 4) { // Customer
          router.push('/');
        } else {
          router.push('/');
        }
      } else {
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
      }
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.';

      if (err.message) {
        if (err.message.includes('<!DOCTYPE')) {
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Callback khi Google trả về credential
  const onGoogleCredential = async (resp) => {
    setError('');
    setIsLoading(true);
    try {
      const { credential } = resp || {};
      if (!credential) throw new Error('Không nhận được thông tin từ Google');
      const payload = jwtDecode(credential);
      const email = payload.email;
      const fullName = payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim();
      if (!email) throw new Error('Không lấy được email từ Google');

      // Gửi cả idToken (credential) để backend có thể xác minh chữ ký nếu hỗ trợ
      const response = await authService.loginWithGoogle({ fullName: fullName || 'Google User', email, idToken: credential });

      // Chuẩn hóa dữ liệu trả về (camelCase/PascalCase)
      const account = response?.account || response?.Account || null;
      const token = response?.token || response?.Token || account?.token || account?.Token;
      if (account && token) {
        login(account, token);
        const roleID = account?.roleID ?? account?.RoleID;
        if (roleID === 1 || roleID === 2 || roleID === 3) {
          router.push('/dashboard');
        } else if (roleID === 4) {
          router.push('/');
        } else {
          router.push('/');
        }
      } else {
        setError('Đăng nhập với Google thất bại. Vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error('Google login error:', err);
      let errorMessage = 'Đăng nhập với Google thất bại. Vui lòng thử lại sau.';
      if (err?.message) {
        if (err.message.includes('<!DOCTYPE')) {
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.';
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Không cần tự nạp script; GoogleOAuthProvider sẽ cung cấp.

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
          <h1 className="text-3xl font-bold mb-2 text-rose-600">Chào mừng trở lại</h1>
          <small className="text-gray-400 mb-6">Đăng nhập để tiếp tục</small>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold">Email hoặc Số điện thoại</label>
              <input
                type="text"
                name="emailOrPhoneNumber"
                placeholder="Nhập email hoặc số điện thoại của bạn"
                className="block w-full rounded-md border border-mint-green focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 py-2 px-3 text-gray-700"
                value={formData.emailOrPhoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="*****"
                  className="block w-full rounded-md border border-mint-green focus:border-pink-500 
                 focus:outline-none focus:ring-1 focus:ring-pink-400 py-2 px-3 pr-10 text-gray-700"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-pink-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Link href="/auth/reset-password" className="text-xs font-semibold text-pink-600 hover:underline">Đổi mật khẩu?</Link>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="mb-1.5 block w-full text-center text-white bg-pink-500 hover:bg-pink-600 px-2 py-2 rounded-md font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "..." : "Đăng nhập"}
            </button>
            <div className="flex flex-wrap justify-center w-full border border-gray-300 hover:border-gray-500 px-2 py-2 rounded-md bg-white">
              <GoogleLogin
                onSuccess={onGoogleCredential}
                onError={() => setError('Đăng nhập Google thất bại. Vui lòng thử lại.')}
                useOneTap={false}
                theme="outline"
                size="large"
                text="continue_with"
                shape="pill"
                logo_alignment="left"
                type="standard"
              />
            </div>
          </form>
          <div className="text-center mt-6">
            <span className="text-xs text-gray-400 font-semibold">Bạn không có tài khoản ? </span>
            <Link href="/auth/register" className="text-xs font-semibold text-pink-600 ml-1">Đăng ký</Link>
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