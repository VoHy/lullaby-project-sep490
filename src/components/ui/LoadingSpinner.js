import React from 'react';

const LoadingSpinner = ({ 
  message = "Đang tải...", 
  size = "medium", 
  color = "purple",
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-12 w-12", 
    large: "h-16 w-16"
  };

  const colorClasses = {
    purple: "border-purple-500",
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    pink: "border-pink-500"
  };

  const spinner = (
    <div className="text-center">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 ${colorClasses[color]} mx-auto mb-4`}></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      {spinner}
    </div>
  );
};

export default LoadingSpinner; 