'use client';

import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

const QuantitySelector = ({ 
  serviceId, 
  initialQuantity = 1, 
  minQuantity = 1, 
  maxQuantity = 10,
  onQuantityChange,
  disabled = false 
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange?.(serviceId, newQuantity);
    }
  };

  const handleDecrease = () => {
    if (quantity > minQuantity) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange?.(serviceId, newQuantity);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= minQuantity && value <= maxQuantity) {
      setQuantity(value);
      onQuantityChange?.(serviceId, value);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-lg p-2">
      <button
        onClick={handleDecrease}
        disabled={disabled || quantity <= minQuantity}
        className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FaMinus className="text-xs" />
      </button>
      
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={minQuantity}
        max={maxQuantity}
        disabled={disabled}
        className="w-12 text-center text-sm font-semibold bg-transparent border-none outline-none"
      />
      
      <button
        onClick={handleIncrease}
        disabled={disabled || quantity >= maxQuantity}
        className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FaPlus className="text-xs" />
      </button>
    </div>
  );
};

export default QuantitySelector;
