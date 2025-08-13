'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

const EmptyState = ({ onNewAppointment }) => {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-6xl mb-4"></div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có lịch hẹn nào</h3>
      <p className="text-gray-600 mb-6">Bạn chưa có lịch hẹn nào hoặc không tìm thấy lịch hẹn phù hợp.</p>
      <button
        onClick={onNewAppointment}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        <FaPlus className="inline mr-2" />
        Đặt lịch hẹn mới
      </button>
    </motion.div>
  );
};

export default EmptyState; 