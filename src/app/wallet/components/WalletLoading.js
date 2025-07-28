'use client';

import { motion } from 'framer-motion';

const WalletLoading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-500">Đang tải thông tin ví...</p>
      </div>
    </motion.div>
  );
};

export default WalletLoading; 