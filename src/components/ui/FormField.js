import React from 'react';

const FormField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error = null,
  required = false,
  placeholder = "",
  options = [],
  className = "",
  disabled = false,
  ...props 
}) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
          />
        );

      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
            disabled={disabled}
            {...props}
          >
            <option value="">{placeholder || 'Chọn...'}</option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'file':
        return (
          <input
            type="file"
            name={name}
            onChange={onChange}
            className={inputClasses}
            disabled={disabled}
            {...props}
          />
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField; 