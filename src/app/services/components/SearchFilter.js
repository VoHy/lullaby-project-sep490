'use client';

import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

const SearchFilter = ({ searchText, setSearchText, selectedCategory, setSelectedCategory }) => {
  const categories = [
    { id: 'all', name: 'Tất cả', icon: '' },
    { id: 'Nurse', name: 'Y tá', icon: '' },
    { id: 'Specialist', name: 'Chuyên gia', icon: '' }
  ];

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchFilter; 