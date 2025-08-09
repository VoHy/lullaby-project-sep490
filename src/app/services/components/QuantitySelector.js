'use client';

import { FaMinus, FaPlus } from 'react-icons/fa';

const QuantitySelector = ({ quantity = 1, onQuantityChange, min = 1, max = 10 }) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || min;
    if (value >= min && value <= max) {
      onQuantityChange(value);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 mb-3">
      <span className="text-sm font-medium text-gray-700">Số lượng:</span>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          disabled={quantity <= min}
          className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <FaMinus className="text-xs" />
        </button>
        
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="w-12 text-center border border-gray-300 rounded px-1 py-1 text-sm font-medium"
        />
        
        <button
          onClick={handleIncrease}
          disabled={quantity >= max}
          className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <FaPlus className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;