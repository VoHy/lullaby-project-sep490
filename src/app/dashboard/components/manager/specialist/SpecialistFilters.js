import { FaSearch, FaChartBar } from 'react-icons/fa';

const SpecialistFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  totalSpecialists,
  filteredCount
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search */}
        <div className="col-span-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Tên, số điện thoại, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaSearch />
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        {/* Results count */}
        <div className="flex items-end">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 w-full">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Kết quả tìm kiếm</span>
              <span className="text-lg font-bold text-purple-600">
                {filteredCount} / {totalSpecialists}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">chuyên gia được tìm thấy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistFilters; 