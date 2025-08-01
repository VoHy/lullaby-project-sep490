import React from 'react';

const ErrorMessage = ({ 
  message = "Đã xảy ra lỗi", 
  onRetry = null,
  type = "error",
  fullScreen = false 
}) => {
  const typeClasses = {
    error: {
      icon: "⚠️",
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200"
    },
    warning: {
      icon: "⚠️", 
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-200"
    },
    info: {
      icon: "ℹ️",
      bg: "bg-blue-50", 
      text: "text-blue-600",
      border: "border-blue-200"
    }
  };

  const classes = typeClasses[type];

  const errorContent = (
    <div className="text-center">
      <div className={`text-4xl mb-4`}>{classes.icon}</div>
      <p className={`${classes.text} mb-4`}>{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Thử lại
        </button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        {errorContent}
      </div>
    );
  }

  return (
    <div className={`${classes.bg} ${classes.border} border rounded-lg p-6`}>
      {errorContent}
    </div>
  );
};

export default ErrorMessage; 