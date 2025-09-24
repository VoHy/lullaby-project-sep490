'use client';

import { FaStar } from 'react-icons/fa';

const ServiceRatingDisplay = ({ rating, count, size = 'sm' }) => {
  const starSize = size === 'lg' ? 'text-lg' : size === 'md' ? 'text-base' : 'text-sm';
  
  return (
    <div className="flex items-center gap-1">
      <FaStar className={`text-yellow-400 ${starSize}`} />
      <span className={`font-semibold text-gray-700 ${starSize}`}>
        {typeof rating === 'number' ? rating.toFixed(1) : rating}
      </span>
      {count > 0 && (
        <span className={`text-gray-400 ${starSize === 'text-lg' ? 'text-sm' : 'text-xs'}`}>
          ({count})
        </span>
      )}
    </div>
  );
};

export default ServiceRatingDisplay;
