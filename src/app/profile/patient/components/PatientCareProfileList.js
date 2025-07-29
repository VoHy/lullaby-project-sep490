import PatientCareProfileCard from './PatientCareProfileCard';
import { FaUsers, FaPlus } from 'react-icons/fa';

export default function PatientCareProfileList({ careProfiles, relativesList, zones, relativesFilter, setRelativesFilter, handleOpenForm, careProfileFilter, setCareProfileFilter, handleOpenCareProfileForm, onViewDetailCareProfile, onViewDetailRelative, handleOpenEditCareProfile, handleOpenEditRelative }) {
  // Lọc careProfiles theo filter
  const filteredCareProfiles = careProfileFilter === 'all'
    ? careProfiles
    : careProfiles.filter(c =>
        (c.status || c.Status || '').toLowerCase() === careProfileFilter.toLowerCase()
      );
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 p-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <FaUsers className="text-purple-500" />
          Hồ sơ chăm sóc
        </h2>
        <div className="flex items-center gap-2">
          <label htmlFor="careProfileFilter" className="text-sm font-medium text-gray-700">Lọc hồ sơ:</label>
          <select
            id="careProfileFilter"
            value={careProfileFilter}
            onChange={e => setCareProfileFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white"
          >
            <option value="all">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
          <button onClick={() => handleOpenCareProfileForm(null)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
            <FaPlus className="text-sm" />
            Thêm hồ sơ
          </button>
        </div>
      </div>
      {filteredCareProfiles.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có hồ sơ chăm sóc</h3>
          <p className="text-gray-600 mb-4">Bạn chưa có hồ sơ chăm sóc nào. Hãy tạo hồ sơ đầu tiên!</p>
          <button onClick={() => handleOpenCareProfileForm(null)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 mx-auto">
            <FaPlus className="text-sm" />
            Tạo hồ sơ mới
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCareProfiles.map(care => (
            <PatientCareProfileCard
              key={care.careProfileID}
              care={care}
              relativesList={relativesList}
              zones={zones}
              relFilter={relativesFilter[care.careProfileID] || 'all'}
              setRelFilter={val => setRelativesFilter(f => ({ ...f, [care.careProfileID]: val }))}
              handleOpenForm={handleOpenForm}
              onViewDetailCareProfile={onViewDetailCareProfile}
              onViewDetailRelative={onViewDetailRelative}
              handleOpenEditCareProfile={handleOpenEditCareProfile}
              handleOpenEditRelative={handleOpenEditRelative}
            />
          ))}
        </div>
      )}
    </>
  );
} 