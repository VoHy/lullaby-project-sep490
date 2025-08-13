// SearchFilter.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaCalendar } from 'react-icons/fa';

export default function SearchFilter({
  searchText, setSearchText,
  statusFilter, setStatusFilter,
  dateFilter, setDateFilter
}) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="bg-white rounded-2xl shadow-lg p-6">
        
        {/* Search */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm lịch hẹn..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-lg"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">

          {/* Status */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-purple-500" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="paid">Đã thanh toán</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <FaCalendar className="text-purple-500" />
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
