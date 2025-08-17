'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import feedbackService from '@/services/api/feedbackService';
import customizeTaskService from '@/services/api/customizeTaskService';

// Component để hiển thị danh sách dịch vụ con trong gói
const PackageServicesList = ({ packageId, getServicesOfPackage }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const packageServices = await getServicesOfPackage(packageId);
        setServices(packageServices);
      } catch (error) {
        console.error('Error loading package services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [packageId, getServicesOfPackage]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
        <p className="text-sm text-gray-500">Đang tải dịch vụ con...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">Chưa có dịch vụ con nào trong gói</p>
      </div>
    );
  }

  return (
    <>
      {services.map(child => (
        <div key={child.serviceID} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <span className="font-medium text-blue-700">{child.serviceName}</span>
            <p className="text-xs text-gray-500">{child.description}</p>
          </div>
          <span className="text-sm font-bold text-pink-600">
            {child.price?.toLocaleString('vi-VN')} VNĐ
          </span>
        </div>
      ))}
    </>
  );
};

// Component đánh giá dịch vụ
const ServiceRating = ({ serviceId, customizeTasks = [], feedbacks = [], onRefreshData }) => {
  const [rate, setRate] = useState(0);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [existing, setExisting] = useState(null);
  const [saved, setSaved] = useState(false);

  // Tìm customizeTaskID cho service này
  const getCustomizeTaskId = () => {
    const task = customizeTasks.find(task => 
      task.serviceID === serviceId || 
      task.ServiceID === serviceId ||
      task.serviceTypeID === serviceId
    );
    return task?.customizeTaskID || task?.CustomizeTaskID || task?.id;
  };

  const customizeTaskId = getCustomizeTaskId();

  // Kiểm tra xem dịch vụ đã hoàn thành chưa
  const isServiceCompleted = () => {
    if (!customizeTaskId) return false;
    
    const task = customizeTasks.find(task => 
      (task.customizeTaskID || task.CustomizeTaskID || task.id) === customizeTaskId
    );
    
    // Kiểm tra status của task
    const status = task?.status || task?.Status;
    return status === 'completed' || status === 'done' || status === 'finished';
  };

  // Load existing feedback
  useEffect(() => {
    if (!customizeTaskId) return;
    
    const existingFeedback = feedbacks.find(feedback => 
      feedback.customizeTaskID === customizeTaskId || 
      feedback.CustomizeTaskID === customizeTaskId
    );
    
    if (existingFeedback) {
      setExisting(existingFeedback);
      setRate(Number(existingFeedback.rate || existingFeedback.Rate || 0));
      setContent(existingFeedback.content || existingFeedback.Content || '');
    }
  }, [customizeTaskId, feedbacks]);

  const handleSave = async () => {
    if (!customizeTaskId) {
      alert('Dịch vụ này chưa được thực hiện. Vui lòng đợi dịch vụ hoàn thành để đánh giá.');
      return;
    }

    if (!isServiceCompleted()) {
      alert('Dịch vụ này chưa hoàn thành. Vui lòng đợi dịch vụ hoàn thành để đánh giá.');
      return;
    }

    if (!rate && !content) {
      alert('Vui lòng chọn sao hoặc nhập nội dung đánh giá.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        customizeTaskID: customizeTaskId,
        rate: Number(rate || 0),
        content: content || ''
      };

      if (existing) {
        const fid = existing.feedbackID || existing.FeedbackID || existing.id || existing.ID;
        await feedbackService.updateFeedback(fid, payload);
      } else {
        await feedbackService.createFeedback(payload);
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      
      // Refresh data to update ratings
      if (onRefreshData) {
        onRefreshData();
      }
    } catch (error) {
      console.error('Lưu feedback thất bại:', error);
      if (error.message?.includes('customizeTaskID')) {
        alert('Dịch vụ này chưa được thực hiện hoặc chưa hoàn thành. Vui lòng đợi dịch vụ hoàn thành để đánh giá.');
      } else {
        alert('Lưu feedback thất bại. Vui lòng thử lại.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Nếu không có customizeTaskID, hiển thị thông báo
  if (!customizeTaskId) {
    return (
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">Đánh giá dịch vụ</h4>
        <p className="text-yellow-700 text-sm">
          Dịch vụ này chưa được thực hiện. Bạn chỉ có thể đánh giá sau khi dịch vụ đã hoàn thành.
        </p>
      </div>
    );
  }

  // Nếu dịch vụ chưa hoàn thành
  if (!isServiceCompleted()) {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Đánh giá dịch vụ</h4>
        <p className="text-blue-700 text-sm">
          Dịch vụ này đang được thực hiện. Bạn có thể đánh giá sau khi dịch vụ hoàn thành.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-semibold text-gray-700 mb-3">Đánh giá dịch vụ</h4>
      
      {/* Rating stars */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRate(star)}
            className="focus:outline-none"
            disabled={saving}
          >
            <FaStar className={`text-xl ${(rate || 0) >= star ? 'text-yellow-400' : 'text-gray-300'}`} />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rate > 0 ? `${rate}/5` : 'Chọn sao'}
        </span>
      </div>

      {/* Feedback content */}
      <textarea
        rows={3}
        placeholder="Nhập nội dung đánh giá (không bắt buộc)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={saving}
      />

      {/* Save button */}
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {saving ? 'Đang lưu...' : (existing ? 'Cập nhật đánh giá' : 'Gửi đánh giá')}
        </button>
        {saved && (
          <span className="text-green-600 text-sm font-medium">✓ Đã lưu đánh giá</span>
        )}
      </div>
    </div>
  );
};

const DetailModal = ({ 
  isOpen, 
  onClose, 
  item, 
  type = 'service', // 'service' or 'package'
  getServicesOfPackage,
  customizeTasks = [],
  feedbacks = [],
  onRefreshData
}) => {
  const router = useRouter();

  if (!isOpen || !item) return null;

  const handleBook = () => {
    onClose();
    if (type === 'package') {
      router.push(`/booking?package=${item.serviceID}`);
    } else {
      router.push(`/booking?service=${item.serviceID}`);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto"
      >
        <button 
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
        
        <h2 className={`text-2xl font-bold mb-6 ${
          type === 'package' ? 'text-purple-600' : 'text-blue-600'
        }`}>
          Chi tiết {type === 'package' ? 'gói dịch vụ' : 'dịch vụ'}
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">
              {type === 'package' ? 'Tên gói:' : 'Tên dịch vụ:'}
            </span>
            <span className="text-gray-900">{item.serviceName}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Giá:</span>
            <span className={`text-2xl font-bold ${
              type === 'package' ? 'text-purple-600' : 'text-blue-600'
            }`}>
              {item.price?.toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Thời gian:</span>
            <span className="text-gray-900">{item.duration} phút</span>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">Mô tả:</span>
            <p className="text-gray-600 mt-2 leading-relaxed">{item.description}</p>
          </div>
          
          {type === 'package' && getServicesOfPackage && (
            <div>
              <span className="font-semibold text-gray-700">Dịch vụ trong gói:</span>
              <div className="mt-3 space-y-2">
                <PackageServicesList packageId={item.serviceID} getServicesOfPackage={getServicesOfPackage} />
              </div>
            </div>
          )}

          {/* Rating section */}
          <ServiceRating 
            serviceId={item.serviceID}
            customizeTasks={customizeTasks}
            feedbacks={feedbacks}
            onRefreshData={onRefreshData}
          />
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            className={`px-6 py-3 rounded-xl text-white font-semibold hover:transition-colors ${
              type === 'package' 
                ? 'bg-purple-500 hover:bg-purple-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={handleBook}
          >
            Đặt {type === 'package' ? 'gói này' : 'dịch vụ này'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DetailModal; 