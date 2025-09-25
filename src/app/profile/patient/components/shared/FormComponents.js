// Shared Form Components - Tái sử dụng các field thường gặp
import React from 'react';

// Default avatars (kept here to avoid creating a new config file)
export const CARE_PROFILE_DEFAULT_AVATAR = 'https://i.ibb.co/zWSDrsBx/ae10a4719f321f9123ab1a3b7e02fa2b.jpg';
export const RELATIVE_DEFAULT_AVATAR = 'https://i.ibb.co/MXjZs9F/4e2bc1c91a903b5b33e423c8ec64eaf3.jpg';

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
  placeholder = '',
  error = ''
}) {
  const baseClassName = `
  w-full px-3 py-2 rounded-xl border border-gray-300 
  bg-white text-sm shadow-sm
  focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400
  transition
`;

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
          className={`${baseClassName} ${error ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : ''}`}
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
          className={`${baseClassName} resize-none ${error ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : ''}`}
          required={required}
          rows={3}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseClassName} ${error ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : ''}`}
          required={required}
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

// Avatar URL Component - Similar to profile account
export function AvatarUpload({
  currentImage,
  onImageChange,
  size = 'w-24 h-24',
  name = 'image',
  error = '',
  defaultImage = ''
}) {
  // Determine which image to show: prefer a real non-empty currentImage, otherwise fallback to defaultImage or empty string
  const resolvedImage = (currentImage && typeof currentImage === 'string' && currentImage.trim() !== '')
    ? currentImage
    : (defaultImage || '');

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="block text-sm font-medium mb-1 text-gray-700">Ảnh đại diện</label>
      <div className={`${size} mb-3`}>
        <img
          src={resolvedImage}
          alt="avatar"
          className={`${size} rounded-full object-cover border-2 ${error ? 'border-red-300' : 'border-purple-200'}`}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 text-center">
          {error}
        </p>
      )}
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
        className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition"
        disabled={loading}
      >
        {loading ? 'Đang lưu...' : submitText}
      </button>
    </div>
  );
}
