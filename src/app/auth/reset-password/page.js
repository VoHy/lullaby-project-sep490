'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/services/api';
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({
    emailOrPhoneNumber: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    emailOrPhoneNumber: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const fe = { emailOrPhoneNumber: '', oldPassword: '', newPassword: '', confirmPassword: '' };
    let hasError = false;
    if (!form.emailOrPhoneNumber.trim()) {
      fe.emailOrPhoneNumber = 'Vui lòng nhập email hoặc số điện thoại';
      hasError = true;
    }
    if (!form.oldPassword) {
      fe.oldPassword = 'Vui lòng nhập mật khẩu hiện tại';
      hasError = true;
    }
    // Password policy: min 8 chars, at least one uppercase, one number, one special character
    const pwd = form.newPassword || '';
    const pwdPolicy = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!pwd || !pwdPolicy.test(pwd)) {
      fe.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt';
      hasError = true;
    }
    if (form.newPassword !== form.confirmPassword) {
      fe.confirmPassword = 'Xác nhận mật khẩu không khớp';
      hasError = true;
    }
    setFieldErrors(fe);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.resetPassword({
        emailOrPhoneNumber: form.emailOrPhoneNumber,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      // BE có thể trả message/success
      if (res?.message) setSuccess(res.message);
      else setSuccess('Đổi mật khẩu thành công.');
      setForm({ emailOrPhoneNumber: '', oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const msg = err?.message || 'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.';
      setError(msg);
    } finally {
      setLoading(false);
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
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-10">
        <h2 className="text-3xl font-bold mb-2 text-rose-600 text-center">Đổi mật khẩu</h2>
        <p className="mb-6 text-center text-gray-500 text-sm">Nhập thông tin bên dưới để đổi mật khẩu.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-xs font-semibold">Email hoặc Số điện thoại</label>
            <input
              name="emailOrPhoneNumber"
              type="text"
              required
              value={form.emailOrPhoneNumber}
              onChange={handleChange}
              className="block w-full rounded-md border border-mint-green focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 py-2 px-3 text-gray-700"
              placeholder="your.email@example.com hoặc 09xxxxxxx"
            />
            {fieldErrors.emailOrPhoneNumber && <div className="text-red-500 text-xs mt-1">{fieldErrors.emailOrPhoneNumber}</div>}
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold">Mật khẩu hiện tại</label>
            <input
              name="oldPassword"
              type="password"
              required
              value={form.oldPassword}
              onChange={handleChange}
              className="block w-full rounded-md border border-mint-green focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 py-2 px-3 text-gray-700"
              placeholder="******"
            />
            {fieldErrors.oldPassword && <div className="text-red-500 text-xs mt-1">{fieldErrors.oldPassword}</div>}
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold">Mật khẩu mới</label>
            <input
              name="newPassword"
              type="password"
              required
              value={form.newPassword}
              onChange={handleChange}
              className="block w-full rounded-md border border-mint-green focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 py-2 px-3 text-gray-700"
              placeholder="ít nhất 6 ký tự"
            />
            {fieldErrors.newPassword && <div className="text-red-500 text-xs mt-1">{fieldErrors.newPassword}</div>}
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold">Xác nhận mật khẩu mới</label>
            <input
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className="block w-full rounded-md border border-mint-green focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 py-2 px-3 text-gray-700"
              placeholder="nhập lại mật khẩu mới"
            />
            {fieldErrors.confirmPassword && <div className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</div>}
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm text-center">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="mb-1.5 block w-full text-center text-white bg-pink-500 hover:bg-pink-600 px-2 py-2 rounded-md font-semibold"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </form>
        <div className="text-center mt-6">
          <span className="text-xs text-gray-400 font-semibold">Quay lại</span>
          <Link href="/auth/login" className="text-xs font-semibold text-pink-600 ml-1">Đăng nhập</Link>
        </div>
      </div>
    </motion.div>
  );
}