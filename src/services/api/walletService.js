import wallets from '../../mock/Wallet';
import walletHistories from '../../mock/WalletHistory';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const walletService = {
  getWallets: async () => {
    if (USE_MOCK) {
      return Promise.resolve(wallets);
    }
    const res = await fetch('/api/wallets');
    return res.json();
  },

  getWalletById: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(wallets.find(w => w.WalletID === id));
    }
    const res = await fetch(`/api/wallets/${id}`);
    return res.json();
  },

  getWalletHistories: async (walletId) => {
    if (USE_MOCK) {
      return Promise.resolve(walletHistories.filter(h => h.WalletID === walletId));
    }
    const res = await fetch(`/api/wallets/${walletId}/histories`);
    return res.json();
  },

  // === THANH TOÁN THẬT ===
  
  // Tạo giao dịch nạp tiền
  createDepositTransaction: async (walletId, amount, paymentMethod) => {
    if (USE_MOCK) {
      // Simulate payment gateway
      const transaction = {
        TransactionID: `TXN_${Date.now()}`,
        WalletID: walletId,
        Amount: amount,
        PaymentMethod: paymentMethod,
        Status: 'pending',
        CreatedAt: new Date().toISOString()
      };
      return Promise.resolve(transaction);
    }

    const res = await fetch('/api/wallets/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletId,
        amount,
        paymentMethod
      })
    });
    return res.json();
  },

  // Lấy danh sách phương thức thanh toán
  getPaymentMethods: async () => {
    if (USE_MOCK) {
      return Promise.resolve([
        {
          id: 'bank_transfer',
          name: 'Chuyển khoản ngân hàng',
          icon: '🏦',
          description: 'Chuyển khoản trực tiếp đến tài khoản ngân hàng',
          processingTime: '5-10 phút',
          fee: 0
        },
      ]);
    }

    const res = await fetch('/api/payment-methods');
    return res.json();
  },

  // Xác nhận giao dịch
  confirmTransaction: async (transactionId, paymentData) => {
    if (USE_MOCK) {
      // Simulate payment confirmation
      return Promise.resolve({
        success: true,
        transactionId,
        status: 'success',
        message: 'Giao dịch thành công'
      });
    }

    const res = await fetch(`/api/transactions/${transactionId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return res.json();
  },

  // Kiểm tra trạng thái giao dịch
  getTransactionStatus: async (transactionId) => {
    if (USE_MOCK) {
      return Promise.resolve({
        transactionId,
        status: 'success',
        amount: 100000,
        processedAt: new Date().toISOString()
      });
    }

    const res = await fetch(`/api/transactions/${transactionId}/status`);
    return res.json();
  },

  // Lấy thông tin ngân hàng
  getBankInfo: async () => {
    if (USE_MOCK) {
      return Promise.resolve({
        bankName: 'Vietcombank',
        accountNumber: '1234567890',
        accountName: 'CONG TY LULLABY',
        branch: 'Chi nhánh TP.HCM',
        transferContent: 'NAP_TIEN_[SỐ_ĐIỆN_THOẠI]'
      });
    }

    const res = await fetch('/api/bank-info');
    return res.json();
  },

  // Tạo QR Code thanh toán
  generateQRCode: async (amount, paymentMethod) => {
    if (USE_MOCK) {
      return Promise.resolve({
        qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        qrCodeData: 'https://lullaby.com/pay?amount=' + amount + '&method=' + paymentMethod
      });
    }

    const res = await fetch('/api/payment/qr-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, paymentMethod })
    });
    return res.json();
  },

  // === CÁC METHOD CŨ ===
  
  createWallet: async (data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...data, WalletID: wallets.length + 1 });
    }
    const res = await fetch('/api/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateWallet: async (id, data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...wallets.find(w => w.WalletID === id), ...data });
    }
    const res = await fetch(`/api/wallets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteWallet: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/wallets/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default walletService; 