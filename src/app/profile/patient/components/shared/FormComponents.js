// Shared Form Components - Tái sử dụng các field thường gặp
import React from 'react';

// Form Field Component
export function FormField({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  options = [],
  className = '',
  placeholder = ''
}) {
  const baseClassName = "w-full rounded-lg border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-sm bg-white";
  
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2 text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={baseClassName}
          required={required}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseClassName} resize-none`}
          required={required}
          rows={3}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={baseClassName}
          required={required}
        />
      )}
    </div>
  );
}

// Avatar Upload Component
export function AvatarUpload({ 
  currentImage, 
  onImageChange, 
  size = 'w-24 h-24',
  name = 'avatar' 
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <label className="block text-sm font-medium mb-1 text-gray-700">Ảnh đại diện</label>
      <div className={`relative ${size}`}>
        <img 
          src={currentImage || '/images/hero-bg.jpg'} 
          alt="avatar" 
          className={`${size} rounded-full object-cover border-2 border-purple-200`} 
        />
        <label className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-purple-700 transition" title="Đổi ảnh">
          <input 
            type="file" 
            accept="image/*" 
            onChange={onImageChange} 
            className="hidden" 
            name={name}
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 21h10.5A2.25 2.25 0 0 0 19.5 18.75V8.25A2.25 2.25 0 0 0 17.25 6H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 21z" />
          </svg>
        </label>
      </div>
    </div>
  );
}

// Status Badge Component
export function StatusBadge({ status, variant = 'default' }) {
  const statusConfig = {
    active: {
      className: 'bg-green-100 text-green-700',
      text: variant === 'detailed' ? 'Đang hoạt động' : 'Hoạt động'
    },
    inactive: {
      className: 'bg-red-100 text-red-700',
      text: 'Ngừng hoạt động'
    }
  };

  const normalizedStatus = (status || '').toLowerCase();
  const config = statusConfig[normalizedStatus] || statusConfig.inactive;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      {config.text}
    </span>
  );
}

// Form Actions Component
export function FormActions({ 
  onCancel, 
  onSubmit, 
  loading = false, 
  submitText = 'Lưu',
  cancelText = 'Hủy' 
}) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
        disabled={loading}
      >
        {cancelText}
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition"
        disabled={loading}
      >
        {loading ? 'Đang lưu...' : submitText}
      </button>
    </div>
  );
}
