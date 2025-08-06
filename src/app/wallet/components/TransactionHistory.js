'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHistory, FaArrowUp, FaArrowDown, FaCalendar } from 'react-icons/fa';
import TransactionDetailModal from './TransactionDetailModal';
import transactionHistoryService from '@/services/api/transactionHistoryService';

// Utility function để lấy transaction ID một cách nhất quán
const getTransactionId = (transaction) => {
  return transaction?.transactionHistoryID || transaction?.TransactionHistoryID;
};

// Utility function để lấy transaction amount một cách nhất quán
const getTransactionAmount = (transaction) => {
  return transaction?.amount || transaction?.Amount || 0;
};

// Utility function để lấy transaction note một cách nhất quán
const getTransactionNote = (transaction) => {
  return transaction?.note || transaction?.Note || 'Giao dịch';
};

// Utility function để lấy transaction status một cách nhất quán
const getTransactionStatus = (transaction) => {
  return transaction?.status || transaction?.Status || 'paid';
};

// Utility function để lấy transaction date một cách nhất quán
const getTransactionDate = (transaction) => {
  return transaction?.transactionDate || transaction?.TransactionDate || new Date();
};

const TransactionHistory = ({ transactions, searchText, setSearchText, filterStatus, setFilterStatus }) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingTransactionId, setLoadingTransactionId] = useState(null);
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
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';  
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Thành công';
      case 'paid': return 'Đã thanh toán';
      case 'failed': return 'Thất bại';
      default: return 'Không xác định';
    }
  };

  const handleTransactionClick = async (transaction) => {
    try {
      const transactionId = getTransactionId(transaction);
      setLoadingTransactionId(transactionId);
      const detailedTransaction = await transactionHistoryService.getTransactionHistoryById(transactionId);
      setSelectedTransaction(detailedTransaction);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết giao dịch:', error);
      alert('Không thể tải chi tiết giao dịch. Vui lòng thử lại.');
    } finally {
      setLoadingTransactionId(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const note = getTransactionNote(transaction);
    
    const matchesSearch = note.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || getTransactionStatus(transaction) === filterStatus;
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
            <option value="paid">Đã thanh toán</option>
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
          {filteredTransactions.map((transaction, index) => {
            const transactionId = getTransactionId(transaction);
            const amount = getTransactionAmount(transaction);
            const note = getTransactionNote(transaction);
            const status = getTransactionStatus(transaction);
            const date = getTransactionDate(transaction);
            
            return (
              <motion.div
                key={transactionId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
                onClick={() => handleTransactionClick(transaction)}
                title="Click để xem chi tiết giao dịch"
              >
                                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        amount > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {amount > 0 ? (
                          <FaArrowUp className="text-green-600 text-sm" />
                        ) : (
                          <FaArrowDown className="text-red-600 text-sm" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{note}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaCalendar className="text-xs" />
                            {formatDate(date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        amount > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {amount > 0 ? '-' : ''}{amount.toLocaleString('vi-VN')}đ
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                      </span>
                      {loadingTransactionId === transactionId && (
                        <div className="mt-1 text-xs text-purple-600">
                          Đang tải...
                        </div>
                      )}
                    </div>
                  </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal chi tiết giao dịch */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </motion.div>
  );
};

export default TransactionHistory; 