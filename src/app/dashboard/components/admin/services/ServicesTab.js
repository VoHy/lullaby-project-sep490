'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBoxes } from '@fortawesome/free-solid-svg-icons';

const ServicesTab = () => {
  const [activeServiceTab, setActiveServiceTab] = useState('services');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Dịch vụ</h2>
        <div className="flex space-x-3">
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Thêm dịch vụ
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
            <FontAwesomeIcon icon={faBoxes} className="mr-2" />
            Thêm package
          </button>
        </div>
      </div>

      {/* Service Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveServiceTab('services')}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            activeServiceTab === 'services'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Dịch vụ đơn lẻ
        </button>
        <button
          onClick={() => setActiveServiceTab('packages')}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            activeServiceTab === 'packages'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Gói dịch vụ
        </button>
      </div>

      {/* Services Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {activeServiceTab === 'services' ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh sách dịch vụ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Service cards would go here */}
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-300 cursor-pointer">
                <FontAwesomeIcon icon={faPlus} className="text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600">Thêm dịch vụ mới</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh sách gói dịch vụ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Package cards would go here */}
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors duration-300 cursor-pointer">
                <FontAwesomeIcon icon={faPlus} className="text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600">Thêm gói dịch vụ mới</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesTab;
