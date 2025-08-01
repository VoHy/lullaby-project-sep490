const transactionHistories = [
  {
    TransactionHistoryID: 1,
    WalletID: 1,
    TransactionType: 'deposit',
    Amount: 500000,
    Description: 'Nạp tiền qua chuyển khoản ngân hàng',
    Status: 'completed',
    TransactionDate: '2024-01-15T08:00:00Z',
    PaymentMethod: 'bank_transfer',
    ReferenceNumber: 'TXN_20240115_001',
    CreatedAt: '2024-01-15T08:00:00Z',
    UpdatedAt: '2024-01-15T08:00:00Z'
  },
  {
    TransactionHistoryID: 2,
    WalletID: 1,
    TransactionType: 'withdrawal',
    Amount: -100000,
    Description: 'Thanh toán dịch vụ chăm sóc sức khỏe',
    Status: 'completed',
    TransactionDate: '2024-01-16T10:00:00Z',
    PaymentMethod: 'wallet',
    ReferenceNumber: 'TXN_20240116_001',
    CreatedAt: '2024-01-16T10:00:00Z',
    UpdatedAt: '2024-01-16T10:00:00Z'
  },
  {
    TransactionHistoryID: 3,
    WalletID: 2,
    TransactionType: 'deposit',
    Amount: 300000,
    Description: 'Nạp tiền qua QR Code',
    Status: 'pending',
    TransactionDate: '2024-01-17T14:00:00Z',
    PaymentMethod: 'qr_code',
    ReferenceNumber: 'TXN_20240117_001',
    CreatedAt: '2024-01-17T14:00:00Z',
    UpdatedAt: '2024-01-17T14:00:00Z'
  },
  {
    TransactionHistoryID: 4,
    WalletID: 2,
    TransactionType: 'withdrawal',
    Amount: -75000,
    Description: 'Thanh toán dịch vụ tư vấn dinh dưỡng',
    Status: 'completed',
    TransactionDate: '2024-01-18T09:00:00Z',
    PaymentMethod: 'wallet',
    ReferenceNumber: 'TXN_20240118_001',
    CreatedAt: '2024-01-18T09:00:00Z',
    UpdatedAt: '2024-01-18T09:00:00Z'
  },
  {
    TransactionHistoryID: 5,
    WalletID: 3,
    TransactionType: 'deposit',
    Amount: 1000000,
    Description: 'Nạp tiền qua chuyển khoản ngân hàng',
    Status: 'completed',
    TransactionDate: '2024-01-19T11:00:00Z',
    PaymentMethod: 'bank_transfer',
    ReferenceNumber: 'TXN_20240119_001',
    CreatedAt: '2024-01-19T11:00:00Z',
    UpdatedAt: '2024-01-19T11:00:00Z'
  }
];

export default transactionHistories; 