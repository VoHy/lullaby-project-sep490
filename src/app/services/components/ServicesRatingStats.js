'use client';

import { motion } from 'framer-motion';
import { FaStar, FaThumbsUp, FaUsers, FaChartLine } from 'react-icons/fa';
import ServiceRatingDisplay from './ServiceRatingDisplay';

const ServicesRatingStats = ({ serviceTypes = [], ratingsMap = {}, feedbacks = [] }) => {
  // Tính toán thống kê tổng hợp từ ratingsMap
  const calculateStats = () => {
    if (!serviceTypes.length) {
      return {
        totalServices: 0,
        totalFeedbacks: 0,
        averageRating: 5.0,
        topRatedServices: []
      };
    }

    const totalServices = serviceTypes.length;
    const totalFeedbacks = feedbacks.length;
    
    // Tính rating trung bình tổng hợp từ ratingsMap
    let totalRating = 0;
    let ratedServices = 0;
    
    serviceTypes.forEach(service => {
      const serviceRating = ratingsMap[service.serviceID];
      if (serviceRating && serviceRating.count > 0) {
        totalRating += serviceRating.rating;
        ratedServices++;
      }
    });
    
    const averageRating = ratedServices > 0 ? totalRating / ratedServices : 5.0;
    
    // Tìm các dịch vụ có rating cao nhất từ ratingsMap
    const serviceRatings = serviceTypes.map(service => {
      const rating = ratingsMap[service.serviceID] || { rating: 5.0, count: 0 };
      return { service, rating: rating.rating, count: rating.count };
    });
    
    const topRatedServices = serviceRatings
      .filter(item => item.count > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
    
    return {
      totalServices,
      totalFeedbacks,
      averageRating: parseFloat(averageRating.toFixed(1)),
      topRatedServices
    };
  };

  const stats = calculateStats();

  if (stats.totalServices === 0) return null;

  return (
    <motion.div
      className="mb-8 bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FaChartLine className="text-blue-500" />
        Thống kê đánh giá dịch vụ
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <FaUsers className="text-blue-500 text-2xl mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{stats.totalServices}</div>
          <div className="text-sm text-gray-600">Tổng dịch vụ</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <FaThumbsUp className="text-green-500 text-2xl mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{stats.totalFeedbacks}</div>
          <div className="text-sm text-gray-600">Đánh giá</div>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-xl">
          <FaStar className="text-yellow-500 text-2xl mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
          <div className="text-sm text-gray-600">Rating TB</div>
        </div>
      </div>
      
      {stats.topRatedServices.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Dịch vụ được đánh giá cao nhất:</h4>
          <div className="space-y-2">
            {stats.topRatedServices.map((item, index) => (
              <div key={item.service.serviceID} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{item.service.serviceName}</span>
                </div>
                <ServiceRatingDisplay 
                  rating={item.rating} 
                  count={item.count} 
                  size="sm" 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ServicesRatingStats;
