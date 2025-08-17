'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";
import { AuthContext } from "../../../context/AuthContext";
import accountService from '@/services/api/accountService';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatarUrl: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
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
    setFieldErrors({ fullName: '', phoneNumber: '', email: '', password: '', confirmPassword: '' });

    // Validate phía client trước khi gọi API
    const newErrors = {};
    // Họ tên (optional: không để trống)
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }
    // Số điện thoại: 9-11 chữ số
    const digitsPhone = formData.phoneNumber.replace(/\D/g, '');
    if (!/^\d{9,11}$/.test(digitsPhone)) {
      newErrors.phoneNumber = 'Số điện thoại phải gồm 9–11 chữ số';
    }
    // Email format
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    // Mật khẩu tối thiểu 6 ký tự
    if ((formData.password || '').length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    // Xác nhận mật khẩu trùng khớp
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }

    setIsLoading(true);

    try {
      // Gọi trực tiếp backend theo Swagger: /api/accounts/register/customer
      const data = await accountService.registerCustomer({
        fullName: formData.fullName,
        phoneNumber: digitsPhone,
        email: formData.email,
        password: formData.password,
        avatarUrl: formData.avatarUrl || ''
      });

      if (data?.account) {
        // Nếu backend trả token, đăng nhập luôn để đồng bộ session
        if (data.token) {
          login(data.account, data.token);
        } else {
          login(data.account);
        }

        // Hiển thị thông báo thành công
        alert('Đăng ký thành công! Chào mừng bạn đến với Lullaby.');

        // Lấy role từ account
        const roleID = data.account.roleID;

        // Chuyển hướng dựa trên roleID
        if (roleID === 1) {
          // Admin
          router.push('/dashboard');
        } else if (roleID === 2) {
          // NurseSpecialist
          router.push('/dashboard');
        } else if (roleID === 3) {
          // Manager
          router.push('/dashboard');
        } else if (roleID === 4) {
          // Customer
          router.push('/?welcome=true');
        } else {
          // Nếu không xác định được role, về trang chủ
          router.push('/');
        }
      } else {
        // Nếu không có account data, chuyển đến trang đăng nhập
        alert('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
        router.push('/auth/login');
      }
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      let errorMessage = 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';

      const msg = (err?.message || '').toLowerCase();
      // Bắt trường hợp email trùng (theo thông báo phổ biến của BE)
      if (msg.includes('email') && (msg.includes('exists') || msg.includes('already') || msg.includes('đã tồn tại') || msg.includes('duplicate'))) {
        setFieldErrors(prev => ({ ...prev, email: 'Email đã tồn tại. Vui lòng dùng email khác.' }));
        errorMessage = '';
      } else {
        if (err.message) errorMessage = err.message;
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
                name="fullName"
                placeholder="Nhập họ tên"
                className="block w-full rounded-md border border-mint-green focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 py-2 px-3 text-gray-700"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              {fieldErrors.fullName && <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>}
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold">Số điện thoại</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Nhập số điện thoại"
                className="block w-full rounded-md border border-mint-green focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 py-2 px-3 text-gray-700"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              {fieldErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{fieldErrors.phoneNumber}</p>}
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
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
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
              {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
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
              {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="mb-1.5 block w-full text-center text-white bg-pink-500 hover:bg-pink-600 px-2 py-2 rounded-md font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
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