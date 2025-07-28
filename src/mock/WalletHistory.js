const walletHistories = [
  {
    TransactionHistoryID: 1,
    WalletID: 1,
    InvoiceID: 1,
    Before: 1200000,
    Amount: -200000,
    After: 1000000,
    Receiver: "Nguyen Van A",
    Transferrer: "Nguyen Van E",
    Note: "Thanh toán dịch vụ",
    Status: "success",
    TransactionDate: "2024-06-01T12:00:00Z"
  },
  {
    TransactionHistoryID: 2,
    WalletID: 2,
    InvoiceID: 2,
    Before: 400000,
    Amount: 100000,
    After: 500000,
    Receiver: "Nguyen Van B",
    Transferrer: "Tran Thi F",
    Note: "Nạp tiền ví",
    Status: "success",
    TransactionDate: "2024-06-02T13:00:00Z"
  },
  {
    TransactionHistoryID: 3,
    WalletID: 3,
    InvoiceID: null,
    Before: 0,
    Amount: 0,
    After: 0,
    Receiver: "System",
    Transferrer: "System",
    Note: "Tạo ví mới",
    Status: "success",
    TransactionDate: "2024-06-03T10:00:00Z"
  }
];

export default walletHistories; 