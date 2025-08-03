'use client';

import { motion } from 'framer-motion';
import ServiceCard from './ServiceCard';

const ServiceSection = ({ 
  title, 
  services, 
  type, 
  selectedItems, 
  onSelect, 
  onDetail, 
  onBook, 
  isDisabled = false,
  expandedPackage,
  onToggleExpand,
  getServicesOfPackage,
  getRating
}) => {
  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: type === 'package' ? 0.2 : 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-1 h-8 rounded-full ${
          type === 'package' 
            ? 'bg-gradient-to-b from-purple-500 to-pink-500' 
            : 'bg-gradient-to-b from-blue-500 to-indigo-500'
        }`}></div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {services.length} {type === 'package' ? 'gói' : 'dịch vụ'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard
            key={service.serviceID}
            service={service}
            index={index}
            isSelected={selectedItems.includes(service.serviceID)}
            onSelect={onSelect}
            onDetail={onDetail}
            onBook={onBook}
            isDisabled={isDisabled}
            type={type}
            expandedPackage={expandedPackage}
            onToggleExpand={onToggleExpand}
            getServicesOfPackage={getServicesOfPackage}
            getRating={getRating}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ServiceSection; 