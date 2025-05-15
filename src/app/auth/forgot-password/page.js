'use client';

import { useState } from 'react';
import Link from 'next/link';
import apiService from '@/services/api/apiService';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Quên mật khẩu</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hãy nhập email của bạn. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Địa chỉ email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm text-center">{success}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Đang xử lý...' : 'Gửi'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
} 