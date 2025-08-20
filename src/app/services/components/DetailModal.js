'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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

const DetailModal = ({ 
  isOpen, 
  onClose, 
  item, 
  type = 'service', // 'service' or 'package'
  getServicesOfPackage,
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