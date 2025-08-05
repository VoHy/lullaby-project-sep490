/**
 * Format date string to dd-mm-yyyy format
 * @param {string} dateStr - Date string to format
 * @returns {string} - Formatted date string in dd-mm-yyyy format
 */
export function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Nếu không parse được, trả về nguyên gốc
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  } catch (error) {
    return dateStr; // Fallback về nguyên gốc nếu có lỗi
  }
}

/**
 * Format date string to yyyy-mm-dd format for input fields
 * @param {string} dateStr - Date string to format
 * @returns {string} - Formatted date string in yyyy-mm-dd format
 */
export function formatDateForInput(dateStr) {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    return date.toISOString().split('T')[0]; // Returns yyyy-mm-dd
  } catch (error) {
    return dateStr;
  }
} 