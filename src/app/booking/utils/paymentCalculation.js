/**
 * Utility functions for payment calculations
 * Handles discounts and extra fees according to business logic
 */

/**
 * Calculate the total amount with discounts applied (for display purposes on booking page)
 * @param {Array} services - Array of services with price and discount information
 * @returns {Object} Object containing subtotal, totalDiscount, and finalAmount
 */
export const calculateTotalWithDiscounts = (services) => {
  let subtotal = 0;
  let totalDiscount = 0;

  if (services && Array.isArray(services)) {
    services.forEach(service => {
      const price = service.price || service.Price || 0;
      const quantity = service.quantity || 1;
      const discount = service.discount || service.Discount || 0;
      
      const serviceSubtotal = price * quantity;
      const serviceDiscount = (serviceSubtotal * discount) / 100;
      
      subtotal += serviceSubtotal;
      totalDiscount += serviceDiscount;
    });
  }

  const finalAmount = subtotal - totalDiscount;

  return {
    subtotal,
    totalDiscount,
    finalAmount: Math.max(0, finalAmount) // Ensure amount is not negative
  };
};

/**
 * Calculate the final payment amount including extra fees
 * @param {number} baseAmount - Base amount (already includes discounts from booking.amount)
 * @param {number|null} extra - Extra fee percentage (null if no extra fees)
 * @returns {Object} Object containing baseAmount, extraAmount, and finalTotal
 */
export const calculateFinalAmountWithExtra = (baseAmount, extra) => {
  if (!extra || extra === null) {
    return {
      baseAmount,
      extraAmount: 0,
      finalTotal: baseAmount
    };
  }

  // Convert extra to decimal percentage if it's a whole number
  // If extra is 15, it means 15%, so we convert to 0.15
  const extraPercentage = extra > 1 ? extra / 100 : extra;
  
  const extraAmount = baseAmount * extraPercentage;
  const finalTotal = baseAmount + extraAmount;

  return {
    baseAmount,
    extraAmount,
    finalTotal,
    extraPercentage: extraPercentage * 100 // Return the percentage for display
  };
};

/**
 * Calculate the complete payment breakdown for payment page
 * @param {Array} services - Array of services (for display purposes)
 * @param {number} bookingAmount - Amount from booking (already includes discounts)
 * @param {number|null} extra - Extra fee percentage
 * @returns {Object} Complete payment breakdown
 */
export const calculateCompletePayment = (services, bookingAmount = 0, extra = null) => {
  // bookingAmount already includes discounts, so we use it directly as the base
  const discountedAmount = bookingAmount;
  
  // Apply extra fees to the already-discounted amount
  const { extraAmount, finalTotal, extraPercentage } = calculateFinalAmountWithExtra(discountedAmount, extra);

  // Calculate display information from services (for UI purposes)
  let displaySubtotal = 0;
  let displayTotalDiscount = 0;
  
  if (services && Array.isArray(services)) {
    services.forEach(service => {
      const price = service.price || service.Price || 0;
      const quantity = service.quantity || 1;
      const discount = service.discount || service.Discount || 0;
      
      const serviceSubtotal = price * quantity;
      const serviceDiscount = (serviceSubtotal * discount) / 100;
      
      displaySubtotal += serviceSubtotal;
      displayTotalDiscount += serviceDiscount;
    });
  }

  return {
    // Display information (from services)
    subtotal: displaySubtotal,
    totalDiscount: displayTotalDiscount,
    // Actual amounts (from booking)
    discountedAmount,
    extra,
    extraPercentage,
    extraAmount,
    finalTotal
  };
};

/**
 * Calculate total with discounts for booking page (before creating booking)
 * @param {Array} services - Array of services
 * @returns {Object} Total with discounts for display
 */
export const calculateBookingTotal = (services) => {
  return calculateTotalWithDiscounts(services);
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN') + ' VNĐ';
};
