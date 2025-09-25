'use client';

import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import feedbackService from '@/services/api/feedbackService';

/**
 * FeedbackForm
 * - Tự load feedback theo customizeTaskId (nếu có)
 * - Cho phép tạo mới hoặc cập nhật feedback (POST/PUT)
 * - Disable feedback khi booking đã bị hủy
 */
const FeedbackForm = ({
  customizeTaskId,
  isBookingCancelled = false,
  bookingStatus,
  canCreateFeedback = true,
  canUpdateFeedback = true,
  createFeedbackBlockedMessage = null,
  updateFeedbackBlockedMessage = null
}) => {
  const [rate, setRate] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existing, setExisting] = useState(null); // feedback object
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!customizeTaskId) return;
      try {
        setLoading(true);
        const fb = await feedbackService.getByCustomizeTask(customizeTaskId).catch(() => null);
        if (cancelled) return;
        if (fb) {
          setExisting(fb);
          setRate(Number(fb.rate || fb.Rate || 0));
          setContent(fb.content || fb.Content || '');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [customizeTaskId]);

  const handleSave = async () => {
    if (!customizeTaskId) return;
    if (isBookingCancelled) {
      alert('Không thể đánh giá dịch vụ khi booking đã bị hủy.');
      return;
    }
    // Enforce create/update policy
    if (existing) {
      if (!canUpdateFeedback) {
        alert(updateFeedbackBlockedMessage || 'Không thể cập nhật đánh giá: thời hạn cập nhật đã hết.');
        return;
      }
    } else {
      if (!canCreateFeedback) {
        alert(createFeedbackBlockedMessage || 'Không thể tạo đánh giá: thời hạn tạo đánh giá đã hết.');
        return;
      }
    }

    if (!rate && !content) {
      alert('Vui lòng chọn sao hoặc nhập nội dung đánh giá.');
      return;
    }
    try {
      setSaving(true);
      if (existing) {
        const fid = existing.feedbackID || existing.FeedbackID || existing.id || existing.ID;
        await feedbackService.updateFeedback(fid, { rate: Number(rate || 0), content: content || '' });
      } else {
        await feedbackService.createFeedback({ customizeTaskID: customizeTaskId, rate: Number(rate || 0), content: content || '' });
        const fb = await feedbackService.getByCustomizeTask(customizeTaskId).catch(() => null);
        if (fb) setExisting(fb);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Lưu feedback thất bại', e);
      alert('Lưu feedback thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  if (!customizeTaskId) return null;

  const isBlockedDueToPolicy = (!existing && !canCreateFeedback) || (existing && !canUpdateFeedback);

  return (
    <div className={`mt-2 p-3 rounded border ${isBookingCancelled ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className={`text-xs font-semibold mb-2 ${isBookingCancelled ? 'text-red-700' : 'text-gray-700'}`}>
        Đánh giá dịch vụ
        {isBookingCancelled && (
          <span className="ml-2 text-red-600 font-normal">(Không khả dụng - lịch hẹn đã hủy)</span>
        )}
        {isBlockedDueToPolicy && (
          <div className="mt-1 text-xs text-yellow-700 font-normal">
            {(!existing && createFeedbackBlockedMessage) ? createFeedbackBlockedMessage : null}
            {(existing && updateFeedbackBlockedMessage) ? updateFeedbackBlockedMessage : null}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => !isBookingCancelled && !isBlockedDueToPolicy && setRate(s)}
            className="focus:outline-none"
            disabled={loading || saving || isBookingCancelled || isBlockedDueToPolicy}
          >
            <FaStar className={`${
              (rate || 0) >= s 
                ? (isBookingCancelled ? 'text-gray-400' : 'text-yellow-400')
                : (isBookingCancelled ? 'text-gray-200' : 'text-gray-300')
            }`} />
          </button>
        ))}
      </div>
      
      <textarea
        rows={2}
        placeholder={isBookingCancelled ? "Không thể đánh giá - Booking đã hủy" : "Nội dung (không bắt buộc)"}
        value={content}
        onChange={(e) => !isBookingCancelled && !isBlockedDueToPolicy && setContent(e.target.value)}
        className={`w-full text-sm p-2 border rounded mb-2 focus:outline-none focus:ring-1 ${
          isBookingCancelled 
            ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
            : 'border-gray-300 focus:ring-gray-300'
        }`}
        disabled={loading || saving || isBookingCancelled || isBlockedDueToPolicy}
      />
      
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || loading || isBookingCancelled || isBlockedDueToPolicy}
          className={`px-3 py-1.5 text-sm rounded ${
            (isBookingCancelled || isBlockedDueToPolicy)
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:opacity-60`}
        >
          {saving ? 'Đang lưu...' : (existing ? 'Cập nhật feedback' : 'Gửi feedback')}
        </button>
        {saved && (
          <span className="text-green-600 text-xs font-medium">Đã lưu đánh giá</span>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;


