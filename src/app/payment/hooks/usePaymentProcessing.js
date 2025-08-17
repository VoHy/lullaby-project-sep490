import { useState, useCallback } from 'react';
import invoiceService from '@/services/api/invoiceService';
import transactionHistoryService from '@/services/api/transactionHistoryService';
import customizeTaskService from '@/services/api/customizeTaskService';

export const usePaymentProcessing = ({
  booking,
  bookingData,
  selectionMode,
  selectedStaffByTask,
  canConfirm,
  contextWallet,
  refreshWalletData,
  router
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Helper function xử lý thành công
  const handlePaymentSuccess = useCallback(async (invoiceId) => {
    console.log('Payment successful for invoice:', invoiceId);

    // Refresh wallet data thông qua WalletContext
    try {
      await refreshWalletData();
      console.log('Wallet data refreshed via context');
    } catch (refreshError) {
      console.warn('Could not refresh wallet via context:', refreshError);
    }

    // Show success modal
    setLastInvoiceId(invoiceId);
    setShowSuccessModal(true);

    // Auto redirect
    setTimeout(() => {
      router.push('/appointments');
    }, 3000);
  }, [refreshWalletData, router]);

  // Handle payment confirmation
  const handleConfirm = useCallback(async () => {
    if (!booking || !bookingData) {
      throw new Error('Không có thông tin booking để thanh toán');
    }

    try {
      setIsProcessingPayment(true);

      // Validate user selection mode
      if (selectionMode === 'user') {
        if (!canConfirm) {
          throw new Error('Vui lòng chọn đủ điều dưỡng cho tất cả dịch vụ trước khi thanh toán.');
        }
      }

      // Check wallet balance
      const userWallet = contextWallet;
      if (!userWallet) {
        throw new Error('Không tìm thấy ví của bạn. Vui lòng kiểm tra lại tài khoản.');
      }

      const walletAmount = userWallet.amount || userWallet.Amount || 0;
      if (walletAmount < bookingData.total) {
        throw new Error(`Số dư ví không đủ để thanh toán. Cần: ${bookingData.total?.toLocaleString('vi-VN')}₫, Hiện có: ${walletAmount?.toLocaleString('vi-VN')}₫`);
      }

      // Create invoice
      const bookingID = parseInt(booking.bookingID || booking.booking_ID);
      const baseAmount = booking.amount || booking.totalAmount || booking.total_Amount || 0;
      const extraFee = booking.extra || 0;
      const finalTotal = bookingData.total;

      const invoiceData = {
        bookingID: bookingID,
        content: `Thanh toán booking #${bookingID}`,
        totalAmount: baseAmount,
        amount: baseAmount,
        total_amount: baseAmount,
        price: baseAmount,
        value: baseAmount,
        extra: extraFee,
        finalTotal: finalTotal
      };

      let invoiceResponse;
      try {
        invoiceResponse = await invoiceService.createInvoice(invoiceData);
        console.log('Invoice created successfully:', invoiceResponse);
      } catch (createErr) {
        const msg = createErr?.message || '';
        if (/already paid/i.test(msg)) {
          try {
            const existingInvoice = await invoiceService.getInvoiceByBooking(bookingID);
            if (existingInvoice?.invoiceID) {
              await handlePaymentSuccess(existingInvoice.invoiceID);
              return;
            }
          } catch (getErr) {
            // fallthrough to show error below
          }
        }
        throw createErr;
      }

      // Get invoice ID
      let invoiceId;
      if (invoiceResponse && typeof invoiceResponse === 'object') {
        if (invoiceResponse.message === 'Invoice paid successfully.') {
          // Invoice đã được thanh toán - lấy existing invoice
          try {
            const existingInvoice = await invoiceService.getInvoiceByBooking(bookingID);
            if (existingInvoice && existingInvoice.invoiceID) {
              console.log('Invoice already paid, using existing invoiceID:', existingInvoice.invoiceID);
              await handlePaymentSuccess(existingInvoice.invoiceID);
              return;
            }
          } catch (getError) {
            console.error('Error getting invoice:', getError);
          }

          // Fallback: coi như thành công với bookingID
          await handlePaymentSuccess(bookingID);
          return;
        } else {
          // Invoice mới được tạo - lấy invoiceID
          invoiceId = invoiceResponse.invoiceID || invoiceResponse.InvoiceID;
          if (!invoiceId) {
            console.error('No invoiceID in response:', invoiceResponse);
            throw new Error('Không thể tạo invoice - không có ID trả về');
          }
        }
      } else {
        console.error('Invalid invoice response:', invoiceResponse);
        throw new Error('Phản hồi từ server không hợp lệ khi tạo invoice');
      }

      // Process payment
      try {
        await transactionHistoryService.invoicePayment(invoiceId);
        await handlePaymentSuccess(invoiceId);
      } catch (payErr) {
        // Nếu BE trả lỗi "đã thanh toán" -> coi như thành công
        const msg = payErr?.message || '';
        if (/already paid/i.test(msg)) {
          await handlePaymentSuccess(invoiceId);
        } else {
          throw payErr;
        }
      }

    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    } finally {
      setIsProcessingPayment(false);
    }
  }, [
    booking,
    bookingData,
    selectionMode,
    canConfirm,
    contextWallet,
    handlePaymentSuccess
  ]);

  return {
    isProcessingPayment,
    showSuccessModal,
    setShowSuccessModal,
    lastInvoiceId,
    handleConfirm,
    handlePaymentSuccess
  };
};
