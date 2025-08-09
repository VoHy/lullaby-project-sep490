// Shared Modal Component - Tái sử dụng cho các modal form
import React from 'react';

export default function BaseModal({ 
  open, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-2xl',
  className = '' 
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-200 animate-fadeIn">
      <div className={`bg-white rounded-2xl shadow-2xl p-0 w-full ${maxWidth} relative scale-95 animate-popup-open ${className}`}>
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl z-10" 
          onClick={onClose}
        >
          &times;
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
            {title}
          </h2>
          
          {children}
        </div>
      </div>
    </div>
  );
}
