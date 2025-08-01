'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const DetailModal = ({ 
  isOpen, 
  onClose, 
  item, 
  type = 'service', // 'service' or 'package'
  getServicesOfPackage 
}) => {
  const router = useRouter();

  if (!isOpen || !item) return null;

  const handleBook = () => {
    onClose();
    if (type === 'package') {
      router.push(`/booking?package=${item.ServiceID}`);
    } else {
      router.push(`/booking?service=${item.ServiceID}`);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative"
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
            <span className="text-gray-900">{item.ServiceName}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Giá:</span>
            <span className={`text-2xl font-bold ${
              type === 'package' ? 'text-purple-600' : 'text-blue-600'
            }`}>
              {item.Price.toLocaleString('vi-VN')}đ
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Thời gian:</span>
            <span className="text-gray-900">{item.Duration}</span>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">Mô tả:</span>
            <p className="text-gray-600 mt-2 leading-relaxed">{item.Description}</p>
          </div>
          
          {type === 'package' && getServicesOfPackage && (
            <div>
              <span className="font-semibold text-gray-700">Dịch vụ trong gói:</span>
              <div className="mt-3 space-y-2">
                {getServicesOfPackage(item.ServiceID).map(child => (
                  <div key={child.ServiceID} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-blue-700">{child.ServiceName}</span>
                      <p className="text-xs text-gray-500">{child.Description}</p>
                    </div>
                    <span className="text-sm font-bold text-pink-600">
                      {child.Price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                ))}
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