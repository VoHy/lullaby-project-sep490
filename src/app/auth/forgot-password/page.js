'use client';

import { useState } from 'react';
import Link from 'next/link';
import apiService from '@/services/api/apiService';
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }
    
    setLoading(true);

    try {
      const response = await apiService.auth.forgotPassword(email);
      if (response.success) {
        setSuccess(response.message);
        setEmail(''); // Xóa email sau khi gửi thành công
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.'
      );
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
        <h2 className="text-3xl font-bold mb-2 text-rose-600 text-center">Quên mật khẩu</h2>
        <p className="mb-6 text-center text-gray-500 text-sm">
          Hãy nhập email của bạn. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-xs font-semibold">Địa chỉ email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={handleChange}
              className="block w-full rounded-md border border-mint-green focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 py-2 px-3 text-gray-700"
              placeholder="your.email@example.com"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm text-center">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="mb-1.5 block w-full text-center text-white bg-pink-500 hover:bg-pink-600 px-2 py-2 rounded-md font-semibold"
          >
            {loading ? 'Đang xử lý...' : 'Gửi'}
          </button>
        </form>
        <div className="text-center mt-6">
          <span className="text-xs text-gray-400 font-semibold">Đã nhớ mật khẩu?</span>
          <Link href="/auth/login" className="text-xs font-semibold text-pink-600 ml-1">Đăng nhập</Link>
        </div>
      </div>
    </motion.div>
  );
} 