'use client';

import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import feedbackService from '@/services/api/feedbackService';

/**
 * FeedbackForm
 * - Tự load feedback theo customizeTaskId (nếu có)
 * - Cho phép tạo mới hoặc cập nhật feedback (POST/PUT)
 */
const FeedbackForm = ({ customizeTaskId }) => {
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

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
      <div className="text-xs font-semibold text-gray-700 mb-2">Đánh giá dịch vụ</div>
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setRate(s)}
            className="focus:outline-none"
            disabled={loading || saving}
          >
            <FaStar className={(rate || 0) >= s ? 'text-yellow-400' : 'text-gray-300'} />
          </button>
        ))}
      </div>
      <textarea
        rows={2}
        placeholder="Nội dung (không bắt buộc)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full text-sm p-2 border rounded mb-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
        disabled={loading || saving}
      />
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
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


