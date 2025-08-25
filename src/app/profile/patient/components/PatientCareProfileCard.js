import { FaPhone, FaMapMarkerAlt, FaStickyNote, FaUsers, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { formatDateToDDMMYYYY } from '../../utils/dateUtils';
import { StatusBadge } from './shared/FormComponents';
import { normalizeFieldNames } from '../utils/formUtils';
import { filterItems, getCareProfileId, getRelativeId } from '../utils/displayUtils';

export default function PatientCareProfileCard({ care, relativesList, relFilter, setRelFilter, handleOpenForm, onViewDetailCareProfile, onViewDetailRelative, handleOpenEditCareProfile, handleOpenEditRelative, handleDeleteCareProfile, handleDeleteRelative }) {
  const normalizedCare = normalizeFieldNames(care);
  const careId = getCareProfileId(care);

  // Filter relatives using utility function
  const careRelatives = relativesList.filter(r =>
    getCareProfileId({ careProfileID: r.careProfileID }) === careId
  );
  const filteredRelatives = filterItems(careRelatives, relFilter);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewDetailCareProfile && onViewDetailCareProfile(care)}>
          <img
            src={(normalizedCare.image && normalizedCare.image.trim() !== '') ? normalizedCare.image : "/images/hero-bg.jpg"}
            alt={normalizedCare.profileName}
            className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
          />
          <div>
            <h3 className="text-lg font-bold text-purple-700 hover:underline">{normalizedCare.profileName}</h3>
            <p className="text-sm text-gray-500">{formatDateToDDMMYYYY(normalizedCare.dateOfBirth) || 'N/A'}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={normalizedCare.status} variant="detailed" />
          <div className="flex items-center gap-1">
            <button
              className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-purple-600 transition"
              title="Sửa hồ sơ"
              onClick={e => { e.stopPropagation(); handleOpenEditCareProfile && handleOpenEditCareProfile(care); }}
            >
              <FaEdit />
            </button>
            <button
              className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600 transition"
              title="Xóa hồ sơ"
              onClick={e => { e.stopPropagation(); handleDeleteCareProfile && handleDeleteCareProfile(careId); }}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <FaPhone className="text-gray-400" />
          <span className="text-sm text-gray-600">{normalizedCare.phoneNumber || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="text-gray-400" />
          <span className="text-sm text-gray-600">{normalizedCare.address || 'N/A'}</span>
        </div>
        {normalizedCare.note && (
          <div className="flex items-start gap-3">
            <FaStickyNote className="text-gray-400 mt-1" />
            <span className="text-sm text-gray-600">{normalizedCare.note}</span>
          </div>
        )}
      </div>

      {/* Relatives Section */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-purple-500" />
            Con cái ({filteredRelatives.length})
          </h4>
          <div className="flex items-center gap-2">
            <label htmlFor={`relFilter-${careId}`} className="text-xs font-medium text-gray-700">Lọc:</label>
            <select
              id={`relFilter-${careId}`}
              value={relFilter}
              onChange={e => setRelFilter(e.target.value)}
              className="px-2 py-1 rounded border border-gray-300 text-xs focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white"
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
            <button
              onClick={() => handleOpenForm(null, careId)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 text-xs"
            >
              <FaPlus className="text-xs" /> Thêm con
            </button>
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto pr-1"> {/* 👈 thêm container có scroll */}
          {filteredRelatives.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Chưa có người thân nào.</p>
          ) : (
            <div className="space-y-2">
              {filteredRelatives.map((relative, idx) => {
                const normalizedRelative = normalizeFieldNames(relative);
                const relativeId = getRelativeId(relative);

                return (
                  <div
                    key={relativeId ? `relative-${relativeId}` : `idx-${idx}`}
                    className="bg-gray-50 rounded-lg p-3 flex items-center justify-between cursor-pointer group"
                    onClick={() => onViewDetailRelative && onViewDetailRelative(relative)}
                  >
                    <div>
                      <p className="font-medium text-purple-600 hover:underline">{normalizedRelative.relativeName}</p>
                      <p className="text-xs text-gray-500">{formatDateToDDMMYYYY(normalizedRelative.dateOfBirth) || 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={normalizedRelative.status} />
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-purple-600 transition"
                          title="Sửa người thân"
                          onClick={e => { e.stopPropagation(); handleOpenEditRelative && handleOpenEditRelative(relative, careId); }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600 transition"
                          title="Xóa người thân"
                          onClick={e => { e.stopPropagation(); handleDeleteRelative && handleDeleteRelative(relativeId); }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 