'use client';

import { FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const ServiceStatusBadge = ({ serviceId, customizeTasks = [] }) => {
  // Tìm customize task cho service này
  const getCustomizeTask = () => {
    return customizeTasks.find(task => 
      task.serviceID === serviceId || 
      task.ServiceID === serviceId ||
      task.serviceTypeID === serviceId
    );
  };

  const task = getCustomizeTask();
  
  if (!task) {
    return null; // Không hiển thị badge nếu chưa có task
  }

  const status = task.status || task.Status;

  // Xác định trạng thái và màu sắc
  let statusConfig = {
    text: 'Chưa thực hiện',
    color: 'bg-gray-100 text-gray-600',
    icon: FaClock
  };

  if (status === 'completed' || status === 'done' || status === 'finished') {
    statusConfig = {
      text: 'Đã hoàn thành',
      color: 'bg-green-100 text-green-700',
      icon: FaCheckCircle
    };
  } else if (status === 'paid' || status === 'isScheduled' || status === 'active') {
    statusConfig = {
      text: 'Đang thực hiện',
      color: 'bg-blue-100 text-blue-700',
      icon: FaClock
    };
  } else if (status === 'cancelled' || status === 'failed') {
    statusConfig = {
      text: 'Đã hủy',
      color: 'bg-red-100 text-red-700',
      icon: FaExclamationTriangle
    };
  }

  const IconComponent = statusConfig.icon;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
      <IconComponent className="text-xs" />
      {statusConfig.text}
    </div>
  );
};

export default ServiceStatusBadge;
