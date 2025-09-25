'use client';

import { FaStar } from 'react-icons/fa';

const ServiceRatingDisplay = ({ rating, count, size = 'sm' }) => {
  // Show rating when either:
  // - there is a positive count OR
  // - there is a rating value (> 0) even if count missing (API may return average only)
  const numericCount = Number(count) || 0;
  const numericRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;

  if (numericCount <= 0 && (!numericRating || numericRating <= 0)) return null;

  const starSize = size === 'lg' ? 'text-lg' : size === 'md' ? 'text-base' : 'text-sm';

  return (
    <div className="flex items-center gap-1">
      <FaStar className={`text-yellow-400 ${starSize}`} />
      <span className={`font-semibold text-gray-700 ${starSize}`}>
        {numericRating ? numericRating.toFixed(1) : '0.0'}
      </span>
      {numericCount > 0 && (
        <span className={`text-gray-400 ${starSize === 'text-lg' ? 'text-sm' : 'text-xs'}`}>
          ({numericCount})
        </span>
      )}
    </div>
  );
};

export default ServiceRatingDisplay;
