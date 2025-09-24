import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ErrorDisplay = ({ errors, onClose }) => {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaTimes className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Có {errors.length} lỗi cần khắc phục:
            </h3>
            <div className="mt-2">
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            className="ml-3 flex-shrink-0 text-red-400 hover:text-red-600"
            onClick={onClose}
          >
            <FaTimes className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;