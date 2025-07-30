import React from 'react';

const DataTable = ({ 
  columns = [], 
  data = [], 
  loading = false,
  error = null,
  onRowClick = null,
  emptyMessage = "Không có dữ liệu",
  className = ""
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-gray-400 mb-4">📭</div>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-lg ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={`px-6 py-3 text-left ${column.className || ''}`}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`px-6 py-4 ${column.className || ''}`}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable; 