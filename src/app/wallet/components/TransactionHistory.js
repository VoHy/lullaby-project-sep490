'use client';

import { motion } from 'framer-motion';
import { FaHistory, FaArrowUp, FaArrowDown, FaUser, FaCalendar } from 'react-icons/fa';

const TransactionHistory = ({ transactions, searchText, setSearchText, filterStatus, setFilterStatus }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success': return 'Thành công';
      case 'pending': return 'Đang xử lý';
      case 'failed': return 'Thất bại';
      default: return 'Không xác định';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.Note.toLowerCase().includes(searchText.toLowerCase()) ||
                         transaction.Transferrer.toLowerCase().includes(searchText.toLowerCase()) ||
                         transaction.Receiver.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.Status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FaHistory className="text-purple-500" />
          Lịch sử giao dịch
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          >
            <option value="all">Tất cả</option>
            <option value="success">Thành công</option>
            <option value="pending">Đang xử lý</option>
            <option value="failed">Thất bại</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8">
          <FaHistory className="text-3xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Không có giao dịch nào</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.TransactionHistoryID}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.Amount > 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.Amount > 0 ? (
                      <FaArrowUp className="text-green-600 text-sm" />
                    ) : (
                      <FaArrowDown className="text-red-600 text-sm" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{transaction.Note}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaUser className="text-xs" />
                        {transaction.Transferrer} → {transaction.Receiver}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendar className="text-xs" />
                        {formatDate(transaction.TransactionDate)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${
                    transaction.Amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.Amount > 0 ? '+' : ''}{transaction.Amount.toLocaleString('vi-VN')}đ
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.Status)}`}>
                    {getStatusText(transaction.Status)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TransactionHistory; 